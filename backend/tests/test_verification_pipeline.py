import json
import sys
from types import SimpleNamespace

import pytest

from app.services import verification_pipeline


def _source(url, content):
    return {
        "url": url,
        "title": "Retrieved result",
        "domain": verification_pipeline._domain_for_url(url),
        "content": content,
        "date": "",
        "score": 0.8,
    }


def _fixed_search(sources):
    def search(claim, key):
        if not claim or not key:
            raise AssertionError("search received empty input")
        return sources, len(sources)

    return search


def _fixed_analysis(judgments):
    def analyze(claim, retrieved, key):
        if not claim or not key or not retrieved:
            raise AssertionError("analysis received empty input")
        return {
            "verdict": "TRUE",
            "summary": "Retrieved sources support the claim.",
            "analysis": "Independent sources report the same fact.",
            "reasoning": [{"index": "01", "title": "Agreement", "description": "Two sources agree."}],
            "sourceEvaluations": judgments,
        }

    return analyze


def test_verified_quotes_from_independent_domains_can_pass(monkeypatch):
    sources = [
        _source(
            "https://science.example.com/water",
            "Water boils at 100 degrees Celsius at sea level.",
        ),
        _source(
            "https://reference.example.org/boiling",
            "At sea level, pure water boils at 100 degrees Celsius.",
        ),
    ]
    judgments = [
        {
            "sourceIndex": 1,
            "relationship": "SUPPORTS",
            "excerpt": "Water boils at 100 degrees Celsius at sea level.",
        },
        {
            "sourceIndex": 2,
            "relationship": "SUPPORTS",
            "excerpt": "At sea level, pure water boils at 100 degrees Celsius.",
        },
    ]
    monkeypatch.setenv("TAVILY_API_KEY", "test-tavily-key")
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setattr(
        verification_pipeline,
        "_search_sources",
        _fixed_search(sources),
    )
    monkeypatch.setattr(
        verification_pipeline,
        "_analysis",
        _fixed_analysis(judgments),
    )

    result = verification_pipeline.verify_claim("Water boils at 100C at sea level")

    assert result["verdict"] == "TRUE"
    assert result["confidence"] > 0
    assert len(result["evidence"]) == 2
    assert all(item["quote"] in sources[index]["content"] for index, item in enumerate(result["evidence"]))


def test_unmatched_quote_is_dropped_and_result_is_inconclusive(monkeypatch):
    sources = [
        _source("https://one.example.com/a", "A retrieved source with actual text about water."),
        _source("https://two.example.org/b", "Another retrieved source with actual text about water."),
    ]
    monkeypatch.setenv("TAVILY_API_KEY", "test-tavily-key")
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setattr(
        verification_pipeline,
        "_search_sources",
        _fixed_search(sources),
    )
    monkeypatch.setattr(
        verification_pipeline,
        "_analysis",
        _fixed_analysis(
            [
                {
                    "sourceIndex": index,
                    "relationship": "SUPPORTS",
                    "excerpt": "This fabricated quotation is not present in a source.",
                }
                for index in (1, 2)
            ]
        ),
    )

    result = verification_pipeline.verify_claim("A claim")

    assert result["verdict"] == "INCONCLUSIVE"
    assert result["confidence"] == 0
    assert result["evidence"] == []


def test_search_results_from_one_domain_are_inconclusive(monkeypatch):
    sources = [
        _source("https://example.com/a", "A sufficiently long retrieved source snippet."),
        _source("https://news.example.com/b", "Another sufficiently long retrieved source snippet."),
    ]
    monkeypatch.setenv("TAVILY_API_KEY", "test-tavily-key")
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setattr(
        verification_pipeline,
        "_search_sources",
        _fixed_search(sources),
    )

    def unexpected_analysis(claim, retrieved, key):
        raise AssertionError(f"analysis should not run: {claim}, {retrieved}, {key}")

    monkeypatch.setattr(
        verification_pipeline,
        "_analysis",
        unexpected_analysis,
    )

    result = verification_pipeline.verify_claim("A claim")

    assert result["verdict"] == "INCONCLUSIVE"
    assert result["confidence"] == 0
    assert result["evidenceOverview"]["context"] == 2


def test_gemini_retries_temporary_failure_then_uses_fallback(monkeypatch):
    calls = []
    delays = []

    def generate_content(**kwargs):
        calls.append(kwargs["model"])
        if kwargs["model"] == "custom-primary":
            raise RuntimeError("503 UNAVAILABLE: high demand")
        return SimpleNamespace(text=json.dumps({"verdict": "INCONCLUSIVE"}))

    fake_genai = SimpleNamespace(
        Client=lambda **kwargs: SimpleNamespace(
            models=SimpleNamespace(generate_content=generate_content)
        )
    )
    monkeypatch.setitem(sys.modules, "google", SimpleNamespace(genai=fake_genai))
    monkeypatch.setenv("GEMINI_MODEL", "custom-primary")
    monkeypatch.setattr(verification_pipeline.time, "sleep", delays.append)

    result = verification_pipeline._analysis("claim", [], "test-key")

    assert result == {"verdict": "INCONCLUSIVE"}
    assert calls == ["custom-primary", "custom-primary", "gemini-3.8-flash"]
    assert delays == [1]


def test_gemini_moves_to_fallback_after_non_temporary_failure(monkeypatch):
    calls = []

    def generate_content(**kwargs):
        calls.append(kwargs["model"])
        if kwargs["model"] == "invalid-primary":
            raise RuntimeError("404 model not found")
        return SimpleNamespace(text=json.dumps({"verdict": "INCONCLUSIVE"}))

    fake_genai = SimpleNamespace(
        Client=lambda **kwargs: SimpleNamespace(
            models=SimpleNamespace(generate_content=generate_content)
        )
    )
    monkeypatch.setitem(sys.modules, "google", SimpleNamespace(genai=fake_genai))
    monkeypatch.setenv("GEMINI_MODEL", "invalid-primary")

    result = verification_pipeline._analysis("claim", [], "test-key")

    assert result == {"verdict": "INCONCLUSIVE"}
    assert calls == ["invalid-primary", "gemini-3.8-flash"]


def test_all_temporary_gemini_failures_raise_unavailable(monkeypatch):
    def generate_content(**kwargs):
        raise RuntimeError("503 UNAVAILABLE: high demand")

    fake_genai = SimpleNamespace(
        Client=lambda **kwargs: SimpleNamespace(
            models=SimpleNamespace(generate_content=generate_content)
        )
    )
    monkeypatch.setitem(sys.modules, "google", SimpleNamespace(genai=fake_genai))
    monkeypatch.setenv("GEMINI_MODEL", "custom-primary")
    monkeypatch.setattr(verification_pipeline.time, "sleep", lambda _: None)

    with pytest.raises(verification_pipeline.GeminiUnavailableError):
        verification_pipeline._analysis("claim", [], "test-key")
