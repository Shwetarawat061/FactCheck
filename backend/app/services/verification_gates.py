"""Conservative verdict gates for retrieved and validated evidence."""

from math import isfinite
from urllib.parse import urlparse

_VERDICTS = {
    "TRUE",
    "MOSTLY TRUE",
    "MIXED",
    "MOSTLY FALSE",
    "FALSE",
    "INCONCLUSIVE",
    "UNVERIFIED",
}
_DECISIVE_RELATIONSHIPS = {"SUPPORTS", "CONTRADICTS"}
_MULTIPART_SUFFIXES = {
    "ac.uk",
    "co.in",
    "co.jp",
    "co.nz",
    "co.uk",
    "com.au",
    "com.br",
    "com.cn",
    "com.mx",
    "com.sg",
    "com.tr",
    "org.uk",
}


def _registered_domain(evidence: dict) -> str:
    domain = evidence.get("sourceDomain") or evidence.get("source")
    if not isinstance(domain, str) or not domain.strip():
        url = evidence.get("url")
        if isinstance(url, str):
            domain = urlparse(url).hostname or ""
    if not isinstance(domain, str):
        return ""

    labels = domain.strip().lower().rstrip(".").removeprefix("www.").split(".")
    if len(labels) < 2:
        return ""
    suffix = ".".join(labels[-2:])
    label_count = 3 if suffix in _MULTIPART_SUFFIXES else 2
    return ".".join(labels[-label_count:])


def gate(verdict: str, evidence: list[dict], dropped_ratio: float) -> tuple[str, int]:
    """Return a gated verdict and heuristic confidence, or no verdict and zero."""
    if not isinstance(verdict, str) or verdict.upper() not in _VERDICTS:
        return "INCONCLUSIVE", 0
    if not isinstance(dropped_ratio, (int, float)) or not isfinite(dropped_ratio):
        return "INCONCLUSIVE", 0
    if dropped_ratio < 0 or dropped_ratio > 0.5:
        return "INCONCLUSIVE", 0

    domains = {_registered_domain(item) for item in evidence}
    domains.discard("")
    decisive = [
        item
        for item in evidence
        if item.get("relationship") in _DECISIVE_RELATIONSHIPS
    ]
    decisive_domains = {_registered_domain(item) for item in decisive}
    decisive_domains.discard("")

    normalized_verdict = verdict.upper()
    if (
        len(evidence) < 2
        or len(domains) < 2
        or len(decisive) < 2
        or len(decisive_domains) < 2
        or normalized_verdict in {"INCONCLUSIVE", "UNVERIFIED"}
    ):
        return "INCONCLUSIVE", 0

    supports = sum(item.get("relationship") == "SUPPORTS" for item in decisive)
    contradicts = sum(item.get("relationship") == "CONTRADICTS" for item in decisive)
    if supports and contradicts:
        return "MIXED", 74
    if supports:
        if normalized_verdict in {"FALSE", "MOSTLY FALSE", "MIXED"}:
            normalized_verdict = "TRUE"
    elif contradicts and normalized_verdict in {"TRUE", "MOSTLY TRUE", "MIXED"}:
        normalized_verdict = "FALSE"

    if len(decisive) >= 4:
        confidence = 94
    elif len(decisive) >= 3:
        confidence = 88
    else:
        confidence = 80
    return normalized_verdict, confidence
