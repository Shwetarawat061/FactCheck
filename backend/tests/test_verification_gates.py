from app.services.verification_gates import gate


def test_one_source_is_inconclusive():
    verdict, confidence = gate(
        "TRUE",
        [{"sourceDomain": "example.com", "relationship": "SUPPORTS"}],
        0,
    )

    assert verdict == "INCONCLUSIVE"
    assert confidence == 0


def test_multiple_sources_from_one_domain_are_inconclusive():
    verdict, confidence = gate(
        "TRUE",
        [
            {"sourceDomain": "example.com", "relationship": "SUPPORTS"},
            {"sourceDomain": "news.example.com", "relationship": "SUPPORTS"},
        ],
        0,
    )

    assert verdict == "INCONCLUSIVE"
    assert confidence == 0


def test_two_independent_domains_can_pass_gate():
    verdict, confidence = gate(
        "TRUE",
        [
            {"sourceDomain": "example.com", "relationship": "SUPPORTS"},
            {"sourceDomain": "news.example.org", "relationship": "SUPPORTS"},
        ],
        0,
    )

    assert verdict == "TRUE"
    assert confidence > 0
