# CitySync: A City Out of Sync

> **"See the chain reaction before it happens."**  
> An interconnected urban infrastructure intelligence platform modeling traffic, electricity, and water as a synchronized system to preempt cascading failures.

---

## 1. Problem Statement

Modern cities operate interdependent infrastructure: traffic flow relies on electricity for signals and transit; electricity substations rely on municipal water for cooling systems and pumping; water distribution requires high-voltage electricity for booster stations. 

When one system experiences sudden stress—such as a 38°C heatwave or a stadium egress surge—the failure propagates rapidly across boundaries. Conventional municipal management monitors these networks in isolation, discovering the cascade only after blackouts, gridlock, and line pressure collapse have already occurred.

**CitySync** breaks these silos by modeling the city as a single, connected dependency graph with quantized time lags, projecting stress 2 hours into the future, and recommending the most effective counter-measure before problems escalate.

---

## 2. System Architecture

```
                    ┌────────────────────────────────────────┐
                    │      React (Vite) + Tailwind CSS       │
                    │         "Living Glass" UI              │
                    │   (Vercel / Safari iOS Compatible)     │
                    └───────────────────▲────────────────────┘
                                        │ JSON API
                    ┌───────────────────┴────────────────────┐
                    │      Node.js + Express API Gateway     │
                    │       (Render Web Service 1)           │
                    │  • Deterministic Simulation Engine     │
                    │  • Mulberry32 PRNG (24 Nodes / 8 Zones)│
                    │  • Quantized Coupling Cascades         │
                    │  • In-Memory Dev / MongoDB Atlas       │
                    └───────────────────▲────────────────────┘
                                        │ Internal API Proxy
                    ┌───────────────────┴────────────────────┐
                    │       Python 3.11 FastAPI Service      │
                    │       (Render Web Service 2)           │
                    │  • scikit-learn RandomForestRegressor  │
                    │  • IsolationForest Anomaly Detector    │
                    │  • Zero-Future-Leakage Feature Engine  │
                    │  • Calibrated BTP & SLDC Provenance    │
                    └────────────────────────────────────────┘
```

### Top-Level Repository Layout
```
├── backend/
│   ├── ml/                       # Python 3.11 ML Inference Service
│   │   ├── artifacts/            # Model binaries & evaluation snapshots
│   │   ├── pipeline/             # Chronological split, preprocessing, models
│   │   ├── tests/                # Leakage & API contract tests
│   │   ├── serve.py              # FastAPI inference endpoints
│   │   └── train.py              # Reproducible training pipeline (seed 42)
│   ├── src/
│   │   ├── config/               # Environment & database connectors
│   │   ├── engine/               # Deterministic 24-node simulation engine
│   │   ├── middleware/           # JWT, error handling, rate limiting
│   │   ├── models/               # Mongoose & in-memory models
│   │   └── routes/               # Simulation, ML, scenarios, auth endpoints
│   └── tests/                    # Unit, simulation, and integration tests
├── frontend/
│   ├── src/
│   │   ├── components/           # Living Glass cards, buttons, badges
│   │   ├── context/              # Auth, Theme, and Simulation Context
│   │   ├── pages/                # Operations, Scenarios, Ripple, Warnings, Models
│   │   └── index.css             # Glass tokens & iOS Safari backdrop prefixes
│   └── vite.config.js
└── graphify-out/                 # Graphify knowledge graph (788 nodes, 1218 edges)
```

---

## 3. Data Honesty & Provenance

CitySync adheres to a strict three-tier data honesty policy. Every number, chart, and alert in the application carries one of three distinct labels:

1. **`Simulated`** (Gray/Cyan): Sensor-style measurements generated deterministically by the 24-node Mulberry32 simulation engine.
2. **`Rule-based`** (Amber): Alerts, cascading links, and counter-measure rankings derived from quantized coupling rules and graph topology.
3. **`Trained ML`** (Teal/Emerald): Forecasts and anomaly scores produced by scikit-learn models trained on historical series.
   - **Road Congestion**: Calibrated against Bengaluru Traffic Police (BTP) hourly congestion datasets (`Real Data`).
   - **Substation Load**: Calibrated against Karnataka State Load Despatch Centre (SLDC) & BESCOM feeder curves (`Real Data`).
   - **Water Pressure**: Calibrated against the synthetic CitySync distribution network (`Synthetic`).

> [!NOTE]
> All ML models enforce **strictly chronological train/validation/test splits (70/15/15)** and **trailing-only rolling windows** (`closed='left'`). Future data leakage is tested and prevented by unit tests.

---

## 4. Key Innovation Features

1. **Ripple Engine**: Visualizes multi-hop failure chains propagating across 24 infrastructure nodes in real time, respecting quantized time lags (5, 10, 15 minutes).
2. **Future Fork**: A dual-lane timeline scrubber allowing operators to fork the timeline, test an intervention on Lane 2, and compare stability delta against the unmitigated baseline.
3. **Weak Link Finder**: Automated stress test that degrades all 24 nodes in turn to rank single points of failure by stability drop and betweenness centrality.
4. **Causal "Why Panels"**: Every alert translates mathematical coupling into plain words: *"Substation at 94% load, so traffic signals degrade (~10 min lag), causing Downtown congestion."*
5. **Human Impact Metrics**: Every alert and recommendation calculates *"~N residents affected"* or *"~N residents protected"*.
6. **Mayor Decision Brief**: One-click print-ready briefing summarizing what is happening, what comes next, and the top recommended intervention with zero AI hallucinations.

---

## 5. Quickstart Guide (Local Development)

### Prerequisites
- Node.js v18+ and npm
- Python 3.11+ (or `uv` package manager)

### 1. Backend Setup (Node.js API)
```bash
cd backend
npm install
npm test            # Runs all 18 unit & API integration tests
npm run dev         # Starts API on http://localhost:5000
```

### 2. Machine Learning Service (FastAPI)
```bash
cd backend/ml
# Using uv (recommended)
uv run --with-requirements requirements.txt python train.py  # Train models (seed 42)
uv run --with-requirements requirements.txt,requirements-serve.txt uvicorn serve:app --port 8000
```

### 3. Frontend Setup (React Vite)
```bash
cd frontend
npm install
npm run build       # Verify clean production build
npm run dev         # Launches dashboard on http://localhost:5173
```

### 4. Evaluator Login Bypass
To test without configuring Google OAuth keys:
- Navigate to `http://localhost:5173/login`
- Click **"Evaluator Demo Mode (Instant Access)"** for a pre-authenticated municipal operator session.

---

## 6. Deployment Guide

### Frontend on Vercel
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your Render backend URL (e.g. `https://citysync-api.onrender.com`)

### Backend on Render
- **Type**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`
- **Environment Variables**:
  - `PORT`: `5000`
  - `NODE_ENV`: `production`
  - `FRONTEND_URL`: Your Vercel frontend URL
  - `JWT_SECRET`: Random 32-character string
  - `ML_SERVICE_URL`: Your Render ML service URL
  - `MONGODB_URI`: (Optional) MongoDB Atlas connection string (falls back to in-memory store if unset)

### ML Service on Render
- **Type**: Web Service (Python)
- **Root Directory**: `backend/ml`
- **Build Command**: `pip install -r requirements-serve.txt && python train.py`
- **Start Command**: `uvicorn serve:app --host 0.0.0.0 --port 8000`

---

## 7. Known Limitations

- **Free-Tier Cold Starts**: Free Render instances spin down after inactivity. The Express Gateway includes pre-computed fallback snapshots (`evaluation_snapshot.json`) to prevent blank screens while the ML container boots.
- **Water Data Simulation**: Municipal water distribution pressure is modeled from simulator physics rather than public open sensor feeds, as public water SCADA data is restricted. This is explicitly labeled in the UI.

---

## 8. License

MIT License. Built for the 2026 Hackathon.
