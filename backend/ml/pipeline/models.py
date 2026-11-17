"""
Model Architecture, Baselines, and Uncertainty Wrappers
"""

import numpy as np
from typing import Dict, Any, Tuple
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def compute_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = float(r2_score(y_true, y_pred))
    return {"mae": round(mae, 2), "rmse": round(rmse, 2), "r2": round(r2, 3)}

def compute_baselines(test_df, target_col: str) -> Dict[str, Any]:
    y_true = test_df[target_col].values
    y_persistence = test_df["lag_1"].values
    y_seasonal_naive = test_df["lag_168"].values

    return {
        "persistence": compute_metrics(y_true, y_persistence),
        "seasonal_naive": compute_metrics(y_true, y_seasonal_naive),
    }

class TrafficElectricityRegressor:
    def __init__(self, n_estimators: int = 50, max_depth: int = 10, random_state: int = 42):
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            random_state=random_state,
            n_jobs=1,
        )
        self.feature_names = []

    def fit(self, X: np.ndarray, y: np.ndarray, feature_names: list):
        self.feature_names = list(feature_names)
        self.model.fit(X, y)
        return self

    def predict_with_interval(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        preds = self.model.predict(X)
        # 10th and 90th percentile prediction distribution from individual trees
        tree_preds = np.array([tree.predict(X) for tree in self.model.estimators_])
        lower = np.percentile(tree_preds, 10, axis=0)
        upper = np.percentile(tree_preds, 90, axis=0)
        return preds, lower, upper

    def get_feature_importances(self) -> Dict[str, float]:
        importances = self.model.feature_importances_
        return {feat: round(float(imp), 4) for feat, imp in zip(self.feature_names, importances)}

class AnomalyDetector:
    def __init__(self, n_estimators: int = 50, contamination: float = 0.03, random_state: int = 42):
        self.model = IsolationForest(
            n_estimators=n_estimators,
            contamination=contamination,
            random_state=random_state,
            n_jobs=1,
        )
        self.feature_names = []

    def fit(self, X: np.ndarray, feature_names: list):
        self.feature_names = list(feature_names)
        self.model.fit(X)
        return self

    def detect(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        # -1 for anomaly, 1 for inlier
        raw_pred = self.model.predict(X)
        is_anomaly = (raw_pred == -1).astype(int)
        # decision_function: lower means more abnormal
        scores = -self.model.decision_function(X) # Inverted so higher = more anomalous
        return is_anomaly, scores
