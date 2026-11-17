"""
Preprocessing and Feature Engineering Pipeline
Enforces strict chronological train/val/test splits and trailing-only windows.
Zero future data leakage.
"""

import numpy as np
import pandas as pd
from typing import Tuple, List, Dict, Any

FEATURE_COLUMNS = [
    "hour_sin",
    "hour_cos",
    "day_of_week",
    "is_weekend",
    "lag_1",
    "lag_2",
    "lag_24",
    "lag_168",
    "rolling_mean_3h",
    "rolling_std_6h",
    "temperature",
    "precipitation",
]

def build_features(df: pd.DataFrame, target_col: str) -> pd.DataFrame:
    """
    Builds strictly past-only features for time series forecasting.
    Trailing windows exclusively (closed='left').
    """
    df = df.copy()
    if not isinstance(df.index, pd.DatetimeIndex):
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df = df.sort_values("timestamp").reset_index(drop=True)
        df = df.set_index("timestamp")

    # Cyclical hour features
    hours = df.index.hour + df.index.minute / 60.0
    df["hour_sin"] = np.sin(2 * np.pi * hours / 24.0)
    df["hour_cos"] = np.cos(2 * np.pi * hours / 24.0)
    df["day_of_week"] = df.index.day_of_week
    df["is_weekend"] = (df.index.day_of_week >= 5).astype(int)

    # Strictly backward-looking lags
    df["lag_1"] = df[target_col].shift(1)
    df["lag_2"] = df[target_col].shift(2)
    df["lag_24"] = df[target_col].shift(24)
    df["lag_168"] = df[target_col].shift(168)

    # Trailing-only rolling features (closed='left' guarantees current step is excluded)
    # Using shift(1) before rolling to be 100% immune to leakage across pandas versions
    shifted_target = df[target_col].shift(1)
    df["rolling_mean_3h"] = shifted_target.rolling(window=3, min_periods=1).mean()
    df["rolling_std_6h"] = shifted_target.rolling(window=6, min_periods=1).std().fillna(0)

    # Ensure weather columns exist with plausible defaults if not provided
    if "temperature" not in df.columns:
        # Bengaluru typical temperature curve: 20C to 32C
        df["temperature"] = 24.0 + 6.0 * np.sin(2 * np.pi * (hours - 9) / 24.0)
    if "precipitation" not in df.columns:
        df["precipitation"] = 0.0

    # Drop initial rows where lag_168 is NaN
    df = df.dropna(subset=FEATURE_COLUMNS + [target_col])
    return df

def chronological_split(
    df: pd.DataFrame,
    train_pct: float = 0.70,
    val_pct: float = 0.15,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Splits time series chronologically into Train, Validation, and Test sets.
    Never shuffles temporal data.
    """
    n = len(df)
    train_end = int(n * train_pct)
    val_end = int(n * (train_pct + val_pct))

    train_df = df.iloc[:train_end].copy()
    val_df = df.iloc[train_end:val_end].copy()
    test_df = df.iloc[val_end:].copy()

    return train_df, val_df, test_df
