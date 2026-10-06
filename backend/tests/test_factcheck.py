import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_empty_claim(client):
    response = client.post('/api/fact-check', json={'claim': ''})
    assert response.status_code == 400

def test_non_string_claim_is_rejected(client):
    response = client.post('/api/fact-check', json={'claim': 42})
    assert response.status_code == 400
    assert response.get_json()['code'] == 'INVALID_CLAIM'

def test_claim_over_limit_is_rejected(client):
    response = client.post('/api/fact-check', json={'claim': 'x' * 1001})
    assert response.status_code == 400

def test_missing_claim_is_rejected(client):
    response = client.post('/api/fact-check', json={})
    assert response.status_code == 400

def test_valid_claim_reports_missing_config_without_mock(client, monkeypatch):
    monkeypatch.delenv('GEMINI_API_KEY', raising=False)
    monkeypatch.delenv('TAVILY_API_KEY', raising=False)
    response = client.post('/api/fact-check', json={'claim': 'The Great Wall of China is visible from the Moon.'})
    assert response.status_code == 503
    data = response.get_json()
    assert data['code'] == 'SERVER_MISCONFIGURED'
    assert 'verdict' not in data

def test_unknown_claim_reports_missing_config_without_mock(client, monkeypatch):
    monkeypatch.delenv('GEMINI_API_KEY', raising=False)
    monkeypatch.delenv('TAVILY_API_KEY', raising=False)
    response = client.post('/api/fact-check', json={'claim': 'Something with no known archive match'})
    assert response.status_code == 503
    assert response.get_json()['code'] == 'SERVER_MISCONFIGURED'

def test_missing_tavily_key_is_not_a_result(client, monkeypatch):
    monkeypatch.setenv('GEMINI_API_KEY', 'test-gemini-key')
    monkeypatch.delenv('TAVILY_API_KEY', raising=False)
    response = client.post('/api/fact-check', json={'claim': 'Water boils at 100C at sea level'})
    assert response.status_code == 503
    assert response.get_json()['status'] == 'failed'
    assert 'verdict' not in response.get_json()

def test_failure_is_not_a_result(client, monkeypatch):
    def boom(claim):
        raise RuntimeError(f"failure for {claim}")

    monkeypatch.setattr("app.routes.factcheck_routes.verify_claim", boom)
    response = client.post('/api/fact-check', json={'claim': 'x'})
    assert response.status_code == 502
    assert response.get_json()['status'] == 'failed'
    assert 'verdict' not in response.get_json()
