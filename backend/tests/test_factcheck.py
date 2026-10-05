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

def test_valid_claim_evaluation(client):
    response = client.post('/api/fact-check', json={'claim': 'The Great Wall of China is visible from the Moon.'})
    assert response.status_code == 200
    data = response.get_json()
    assert 'verdict' in data
    assert 'evidence' in data
    assert data['verdict'] == 'FALSE'
