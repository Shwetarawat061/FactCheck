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
