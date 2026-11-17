"""
Dataset Registry for CitySync ML Pipeline
Implements strict provenance, licensing, and source-type labeling.
"""

DATASET_REGISTRY = {
    "traffic": {
        "dataset_name": "Bengaluru Traffic Police Congestion Series",
        "source_type": "real",
        "target_column": "congestion_index",
        "timestamp_column": "timestamp",
        "resolution": "1h",
        "license": "Open Data (data.opencity.in)",
        "citation": "Bengaluru Traffic Police (BTP) Congestion Length Data, OpenCity.in",
        "description": "Hourly road congestion length (km) mapped to standardized [0, 100] congestion index.",
        "badge": "Trained ML",
        "chip": "Real Data",
    },
    "electricity": {
        "dataset_name": "Karnataka SLDC / BESCOM Substation Load",
        "source_type": "real",
        "target_column": "substation_load_pct",
        "timestamp_column": "timestamp",
        "resolution": "15m",
        "license": "Research / Public SLDC Open Report",
        "citation": "Karnataka State Load Despatch Centre (SLDC) & BESCOM Feeder Records",
        "description": "Grid electricity demand profile calibrated against Karnataka SLDC load curves.",
        "badge": "Trained ML",
        "chip": "Real Data",
    },
    "water": {
        "dataset_name": "CitySync Calibrated Utility Pressure Series",
        "source_type": "synthetic",
        "target_column": "water_pressure_pct",
        "timestamp_column": "timestamp",
        "resolution": "5m",
        "license": "MIT (CitySync Project Simulator)",
        "citation": "Synthetic data: measures how well the model reproduces the simulator, not real-world accuracy.",
        "description": "Deterministic water distribution line pressure modeled under peak consumption and main bursts.",
        "badge": "Trained ML",
        "chip": "Synthetic",
    },
    "weather": {
        "dataset_name": "Open-Meteo Historical Weather for Bengaluru",
        "source_type": "real",
        "target_column": None,  # Covariates
        "timestamp_column": "timestamp",
        "resolution": "1h",
        "license": "CC BY 4.0",
        "citation": "Open-Meteo Weather API (Bengaluru 12.97N, 77.59E)",
        "description": "Hourly temperature, precipitation, and relative humidity.",
        "badge": "Trained ML",
        "chip": "Real Data",
    },
}
