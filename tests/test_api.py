import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Traceveil API is running" in response.json()["message"]

def test_ingest_event():
    event_data = {
        "user_id": "test_user",
        "event_type": "test_event",
        "metadata": {"test": "data"},
        "timestamp": "2024-01-29T10:00:00Z"
    }
    response = client.post("/ingest", json=event_data)
    assert response.status_code == 200
    assert "risk_score" in response.json()

def test_get_user_risk():
    response = client.get("/user/test_user/risk")
    # May return 404 if no events, which is expected
    assert response.status_code in [200, 404]