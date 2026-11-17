"""
CitySync ML FastAPI Prediction Service
Lightweight inference service designed to run on Render (free tier, <=512MB RAM).
Provides real-time model predictions, uncertainty intervals, anomaly detection, and evaluation metadata.
"""

import os
import json
import logging
from typing import Dict, Any, Optional
import joblib
import numpy as np
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("citysync-ml")

app = FastAPI(
    title="CitySync ML Prediction Service",
    version="1.0.0",
    description="Deterministic and classical ML inference endpoints for city infrastructure stress forecasting."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
ML_INTERNAL_API_KEY = os.getenv("ML_INTERNAL_API_KEY", "citysync-ml-dev-key")

# Cache loaded models
MODELS: Dict[str, Any] = {}
METADATA: Dict[str, Any] = {}
EVALUATION: Dict[str, Any] = {}

def load_artifacts():
    global MODELS, METADATA, EVALUATION
    # Load metadata
    meta_path = os.path.join(ARTIFACTS_DIR, "metadata.json")
    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            METADATA = json.load(f)
            logger.info("Loaded metadata.json")

    # Load evaluation snapshot
    eval_path = os.path.join(ARTIFACTS_DIR, "evaluation_snapshot.json")
    if os.path.exists(eval_path):
        with open(eval_path, "r", encoding="utf-8") as f:
            EVALUATION = json.load(f)
            logger.info("Loaded evaluation_snapshot.json")

    # Load joblib models if present
    for stream in ["traffic", "electricity", "water"]:
        path = os.path.join(ARTIFACTS_DIR, f"{stream}_rf.joblib")
        if os.path.exists(path):
            try:
                MODELS[stream] = joblib.load(path)
                logger.info(f"Loaded {stream}_rf.joblib")
            except Exception as e:
                logger.warning(f"Could not load {stream} model: {e}")

    iso_path = os.path.join(ARTIFACTS_DIR, "isolation_forest.joblib")
    if os.path.exists(iso_path):
        try:
            MODELS["anomaly"] = joblib.load(iso_path)
            logger.info("Loaded isolation_forest.joblib")
        except Exception as e:
            logger.warning(f"Could not load anomaly model: {e}")

@app.on_event("startup")
def startup_event():
    load_artifacts()

def verify_api_key(x_internal_api_key: Optional[str] = Header(None)):
    expected_key = os.getenv("ML_INTERNAL_API_KEY")
    if expected_key and x_internal_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Internal-API-Key header")
    return True

# ----------------- Request Models -----------------
class FeaturePayload(BaseModel):
    hour: float = Field(..., ge=0, le=24, description="Hour of the day [0-24)")
    day_of_week: int = Field(..., ge=0, le=6, description="0=Monday, 6=Sunday")
    is_weekend: int = Field(..., ge=0, le=1)
    lag_1: float = Field(..., description="Target value at t-1")
    lag_2: float = Field(..., description="Target value at t-2")
    lag_24: float = Field(..., description="Target value at t-24")
    lag_168: float = Field(..., description="Target value at t-168")
    rolling_mean_3h: float = Field(..., description="Trailing 3h mean")
    rolling_std_6h: float = Field(..., description="Trailing 6h std")
    temperature: float = Field(25.0, description="Ambient temperature in Celsius")
    precipitation: float = Field(0.0, description="Precipitation in mm")

    def to_feature_vector(self) -> np.ndarray:
        hour_sin = np.sin(2 * np.pi * self.hour / 24.0)
        hour_cos = np.cos(2 * np.pi * self.hour / 24.0)
        return np.array([[
            hour_sin,
            hour_cos,
            self.day_of_week,
            self.is_weekend,
            self.lag_1,
            self.lag_2,
            self.lag_24,
            self.lag_168,
            self.rolling_mean_3h,
            self.rolling_std_6h,
            self.temperature,
            self.precipitation,
        ]])

# ----------------- Endpoints -----------------
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "citysync-ml",
        "loaded_models": list(MODELS.keys()),
        "has_metadata": bool(METADATA),
        "has_evaluation": bool(EVALUATION),
    }

@app.get("/models")
def get_models_info():
    if not METADATA:
        # Try reloading once
        load_artifacts()
    return METADATA

@app.get("/evaluation/{stream}")
def get_evaluation_data(stream: str):
    evals = EVALUATION.get("evaluations", {})
    if stream not in evals:
        raise HTTPException(
            status_code=404,
            detail=f"Stream '{stream}' not found in evaluation snapshot. Available: {list(evals.keys())}"
        )
    meta = METADATA.get(stream, {})
    return {
        "stream": stream,
        "metadata": meta,
        "evaluation": evals[stream],
        "badge": meta.get("badge", "Trained ML"),
        "chip": meta.get("chip", "Real Data"),
    }

@app.post("/predict/{stream}")
def predict_stream(
    stream: str,
    payload: FeaturePayload,
    authorized: bool = Depends(verify_api_key),
):
    if stream not in ["traffic", "electricity", "water"]:
        raise HTTPException(status_code=400, detail=f"Invalid stream '{stream}'. Must be traffic, electricity, or water.")

    model = MODELS.get(stream)
    if model is None:
        # Fallback to persistence/seasonal baseline prediction if model binary not loaded
        val = payload.lag_1
        return {
            "stream": stream,
            "prediction": round(float(val), 2),
            "lower_bound": round(float(val * 0.9), 2),
            "upper_bound": round(float(val * 1.1), 2),
            "badge": "Rule-based",
            "chip": "Baseline Fallback",
            "warning": "ML model binary not loaded; returning persistence fallback."
        }

    X = payload.to_feature_vector()
    preds, lower, upper = model.predict_with_interval(X)
    meta = METADATA.get(stream, {})

    return {
        "stream": stream,
        "prediction": round(float(preds[0]), 2),
        "lower_bound": round(float(lower[0]), 2),
        "upper_bound": round(float(upper[0]), 2),
        "badge": meta.get("badge", "Trained ML"),
        "chip": meta.get("chip", "Real Data"),
    }

@app.post("/anomaly")
def detect_anomaly(
    payload: FeaturePayload,
    authorized: bool = Depends(verify_api_key),
):
    iso = MODELS.get("anomaly")
    if iso is None:
        return {
            "is_anomaly": False,
            "anomaly_score": 0.0,
            "badge": "Rule-based",
            "warning": "Anomaly model binary not loaded"
        }

    X = payload.to_feature_vector()
    is_anomaly, scores = iso.detect(X)
    return {
        "is_anomaly": bool(is_anomaly[0] == 1),
        "anomaly_score": round(float(scores[0]), 4),
        "badge": "Trained ML",
        "chip": "Real Data",
    }
