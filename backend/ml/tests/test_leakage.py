"""
ML Integrity Tests: Zero Future Data Leakage & Split Verification
"""

import numpy as np
import pandas as pd
import pytest
from datetime import datetime, timedelta

from pipeline.preprocessing import build_features, chronological_split, FEATURE_COLUMNS

def test_zero_lookahead_leakage():
    """
    Verifies that mutating target values at step t_k does NOT alter
    feature values at step t < t_k.

    After build_features drops NaN rows (lag_168 needs 168 rows), the
    feature DataFrame starts at raw index ~168. We mutate raw index 230+
    and check that every feature row whose *original timestamp* is strictly
    before the mutation point is identical. The mutation boundary is chosen
    so that even lag_1/lag_2 of the first mutated row cannot appear
    inside the safe window.
    """
    start_time = datetime(2026, 1, 1, 0, 0)
    n_hours = 400
    timestamps = [start_time + timedelta(hours=i) for i in range(n_hours)]

    # Original series
    np.random.seed(42)
    values_orig = np.random.uniform(20, 80, size=n_hours)
    df_orig = pd.DataFrame({"timestamp": timestamps, "target": values_orig})
    feat_orig = build_features(df_orig, "target")

    # Mutate future values at raw step 350 onwards (well past the warm-up zone)
    mutate_from = 350
    values_mutated = values_orig.copy()
    values_mutated[mutate_from:] = values_mutated[mutate_from:] + 1000.0
    df_mutated = pd.DataFrame({"timestamp": timestamps, "target": values_mutated})
    feat_mutated = build_features(df_mutated, "target")

    # Find the timestamp at the mutation boundary
    boundary_ts = timestamps[mutate_from]

    # Safe window: every feature row whose timestamp is strictly before
    # (boundary - 1 hour) so that lag_1 of the boundary row is excluded
    safe_ts = boundary_ts - timedelta(hours=2)
    feat_orig_past = feat_orig.loc[feat_orig.index < safe_ts][FEATURE_COLUMNS]
    feat_mutated_past = feat_mutated.loc[feat_mutated.index < safe_ts][FEATURE_COLUMNS]

    assert len(feat_orig_past) > 50, "Safe window must contain enough rows to be meaningful"

    pd.testing.assert_frame_equal(
        feat_orig_past,
        feat_mutated_past,
        check_exact=True,
        obj="Past feature representations must be invariant to future target mutations"
    )

def test_chronological_split_no_overlap():
    """
    Verifies train, validation, and test splits are strictly chronological
    with zero index overlap and zero shuffling.
    """
    start_time = datetime(2026, 1, 1, 0, 0)
    timestamps = [start_time + timedelta(hours=i) for i in range(200)]
    df = pd.DataFrame({"timestamp": timestamps, "target": np.arange(200)})
    feat_df = build_features(df, "target")

    train_df, val_df, test_df = chronological_split(feat_df, train_pct=0.7, val_pct=0.15)

    assert len(train_df) > 0
    assert len(val_df) > 0
    assert len(test_df) > 0

    # Strict chronological order check
    assert train_df.index[-1] < val_df.index[0], "Train set must precede Validation set"
    assert val_df.index[-1] < test_df.index[0], "Validation set must precede Test set"

    # Zero overlap check
    combined_len = len(train_df) + len(val_df) + len(test_df)
    assert combined_len == len(feat_df), "Split sets must partition the full dataset exactly"
