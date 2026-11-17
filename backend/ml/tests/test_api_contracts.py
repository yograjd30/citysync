"""
API Contract Tests for FastAPI Inference Endpoints
"""

import pytest
from fastapi.testclient import TestClient
from serve import app, load_artifacts

@pytest.fixture(scope="module", autouse=True)
def init_app():
    load_artifacts()

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "citysync-ml" in data["service"]
    assert "traffic" in data["loaded_models"]
    assert "electricity" in data["loaded_models"]

def test_models_metadata_endpoint():
    res = client.get("/models")
    assert res.status_code == 200
    data = res.json()
    assert "traffic" in data
    assert "electricity" in data
    assert "water" in data
    assert data["traffic"]["badge"] == "Trained ML"
    assert data["traffic"]["chip"] == "Real Data"
    assert data["water"]["chip"] == "Synthetic"

def test_evaluation_endpoint():
    res = client.get("/evaluation/traffic")
    assert res.status_code == 200
    data = res.json()
    assert data["stream"] == "traffic"
    assert "timestamps" in data["evaluation"]
    assert len(data["evaluation"]["actuals"]) > 0
    assert len(data["evaluation"]["predictions"]) > 0

def test_predict_traffic_endpoint():
    payload = {
        "hour": 8.5,
        "day_of_week": 1,
        "is_weekend": 0,
        "lag_1": 45.2,
        "lag_2": 42.0,
        "lag_24": 46.5,
        "lag_168": 44.0,
        "rolling_mean_3h": 43.5,
        "rolling_std_6h": 2.1,
        "temperature": 27.5,
        "precipitation": 0.0,
    }
    res = client.post("/predict/traffic", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["stream"] == "traffic"
    assert isinstance(data["prediction"], float)
    assert data["lower_bound"] <= data["prediction"] <= data["upper_bound"]
    assert data["badge"] == "Trained ML"

def test_predict_electricity_endpoint():
    payload = {
        "hour": 19.0,
        "day_of_week": 2,
        "is_weekend": 0,
        "lag_1": 68.0,
        "lag_2": 65.0,
        "lag_24": 70.0,
        "lag_168": 67.0,
        "rolling_mean_3h": 66.5,
        "rolling_std_6h": 3.0,
        "temperature": 31.0,
        "precipitation": 0.0,
    }
    res = client.post("/predict/electricity", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["stream"] == "electricity"
    assert isinstance(data["prediction"], float)

def test_anomaly_endpoint():
    payload = {
        "hour": 3.0,
        "day_of_week": 3,
        "is_weekend": 0,
        "lag_1": 95.0,  # Sudden 95% congestion at 3 AM is an anomaly
        "lag_2": 95.0,
        "lag_24": 20.0,
        "lag_168": 18.0,
        "rolling_mean_3h": 90.0,
        "rolling_std_6h": 15.0,
        "temperature": 22.0,
        "precipitation": 0.0,
    }
    res = client.post("/anomaly", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "is_anomaly" in data
    assert "anomaly_score" in data
    assert data["badge"] == "Trained ML"
