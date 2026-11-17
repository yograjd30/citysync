# CitySync: A City Out of Sync — Concepts Brief (RFC)

* **Author:** Yograj D
* **Date:** 2026-11-17
* **Status:** Draft / In Review (GATE 1)

---

## 1. Overview & Problem Definition

### 1.1 Problem Statement
Modern urban infrastructure systems (traffic, electricity, and public utilities such as water) are tightly coupled yet operated in silos. A disturbance in one system creates cascading failures in others:
- Traffic congestion delays utility maintenance and increases commercial power demand.
- Power substation overloads degrade traffic signals and disable water pumps.
- Water main bursts undermine road networks and trigger auxiliary electric pump surges.

City planners and operators lack an integrated decision-support tool to observe these ripple effects, forecast threshold breaches, and simulate candidate interventions before escalating into crises.

### 1.2 Product Definition & Value Proposition
**CitySync** ("*See the chain reaction before it happens*") is a web-based decision-support dashboard for municipal infrastructure operators. It integrates:
1. A **deterministic 24-node dependency graph** (8 zones × 3 systems) modeling cross-system coupling with realistic time lags.
2. A **Living Glass UI** with real-time cascade tracing ("Ripple Engine") and branching what-if simulations ("Future Fork").
3. A **rigorous, testable ML layer** (FastAPI/scikit-learn) delivering 2-hour forecasts, uncertainty bounds, and anomaly detection alongside rule-based baselines.
4. **Three-tier data honesty labeling**: Every visual is strictly badged as `Simulated`, `Rule-based`, or `Trained ML`.

---

## 2. Scope Challenge & The Smallest Winning Product

To maximize innovation and UI/UX scoring within hackathon constraints, the build scope is partitioned into a lean, unbeatable core versus prioritized cuts.

### 2.1 The Smallest Version That Wins (Core MVP)
The core MVP must deliver the complete end-to-end chain reaction without gaps:
1. **Deterministic Engine:** 8 zones (Downtown, Tech Park, Residential North, Residential South, Industrial Estate, Stadium District, Old Town, Port & Airport) across 3 systems (Traffic, Electricity, Water).
2. **Coupling Model:** Bidirectional inter-zone and intra-zone propagation with defined lags (e.g., substation stress $\to$ signal failure in 12 min $\to$ traffic congestion).
3. **Living Glass Dashboard:** SVG isometric city grid reacting to city stability, KPI glass cards, simulated clock controls (1x, 5x, 20x), and live alerts feed.
4. **Signature Visuals:**
   - **Ripple Engine:** Animated propagation of stress across the dependency graph and city tiles.
   - **Future Fork:** Interactive timeline scrubber (past 6h to next 2h) with side-by-side baseline vs. intervention branching.
5. **Analytical Capabilities:** Early warnings (time-to-breach), ranked intervention recommendations (with before/after stability and residents helped/affected), and the Weak Link Finder.
6. **Real ML Layer:** FastAPI service with 2 Random Forest regressors (traffic, electricity), 1 anomaly detector (Isolation Forest), baseline comparisons (persistence & seasonal naive), and live metadata serving on the Model Info page.
7. **Bulletproof Auth:** Google OAuth Authorization Code flow with one-time frontend exchange code (Safari cookie-blocking compliant).

### 2.2 What to Cut If Time is Compressed (Priority Fallback Order)
If development time runs short, features will be trimmed in this strict sequence:
1. **Cut Stretch Goals 8 & 9 (Playbooks & Command Bar):** Replace with pre-configured quick-action scenario buttons.
2. **Cut Stretch Goal 6 (Cascade Fingerprints):** Omit the 12-incident vector similarity matcher; rely on direct heuristic cascade tracing.
3. **Simplify 3D Isometric View to Flat SVG Grid:** If isometric SVG rendering or Safari hardware acceleration suffers, default to the 2D glass tile matrix.
4. **Water ML Model Fallback:** Water has no public sub-daily open dataset in Bengaluru; if training the synthetic water Random Forest adds overhead, display the statistical baseline on water and keep real ML focused on Traffic and Electricity.
5. **Static Evaluation Snapshot for ML:** Express can serve the pre-computed evaluation JSON and metadata, ensuring the Model Info page works even if the Python FastAPI Render instance is cold-starting.

### 2.3 The Signature Demo Story (The 3-Minute Hackathon Winning Walkthrough)
A judge must grasp the innovation within 10 seconds. The demo follows a single, high-drama, cohesive narrative:
1. **T = 0 (Baseline Normal):** Dashboard shows a calm teal/blue glass background, Stability Index at 88/100, all 24 nodes green.
2. **T = 5 min (The Shock):** Trigger the *"Heatwave + Stadium Event"* scenario via the Guided First Run button.
3. **T = 15 min (The Ripple):**
   - Stadium District traffic surges to 85% (Critical).
   - The **Ripple Engine** pulses across the map: high traffic causes commercial/signal power spikes.
   - Heatwave pushes Residential North substation load to 94%.
   - Why Panel fires: *"Substation 3 at 94% capacity $\to$ signals degrade in 12 min $\to$ Downtown gridlock."*
4. **T = 30 min (The Breach & Early Warning):**
   - Early Warning alerts show Downtown Water Pumping Station heading toward pressure collapse in 45 minutes (due to backup pump electrical trip).
   - Background hue shifts from amber to warning magenta.
5. **T = 35 min (Intervention & Future Fork):**
   - Operator clicks *"Get Recommendations"*.
   - System evaluates 4 candidate interventions; Top recommendation: *"Reroute Stadium egress + shed non-critical Industrial load"*.
   - Operator engages **Future Fork**: Lane A (unmitigated disaster, Stability drops to 32, 14 nodes critical) vs. Lane B (mitigated, Stability recovers to 76, 42,000 residents protected).
6. **T = 45 min (Verification & Transparency):**
   - Quick pivot to **Weak Link Finder** (identifies Substation 3 as the #1 single point of failure).
   - Inspect **Model Info** page (showing actual vs. predicted test curve and real dataset citation).
   - Export **Decision Brief** (one-click printable Mayor report).

---

## 3. Section 2B Machine Learning Layer: Dataset Selection (GATE 1 Decision)

The data policy mandates: **Real data first**, **synthetic only when explicitly labeled**, and **zero ungrounded claims**.

### 3.1 Candidate Evaluation & Options

| Stream | Candidate Dataset | Resolution / Coverage | License & Access | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Traffic** | **Bengaluru Traffic Police (BTP) on OpenCity** | Hourly congestion length (km), multi-month historical | Open Data / Public Access | **Option A (Recommended):** Use BTP hourly congestion for primary training. Extract lag features (t-1, t-24, t-168) and weather covariates. |
| *Traffic Alt* | DataMeet Bangalore Traffic | Route travel speeds | Open Data (check versioning) | Option B: Alternative if OpenCity format requires excessive manual normalization. |
| **Electricity** | **Karnataka SLDC on HuggingFace (`happyman/Karnataka-SLDC`)** | 15-minute BESCOM load + temperature, 116 days (Apr–Aug 2024) | Gated / Research agreement required | **Option A (Recommended if local file provided):** Most granular real power data available. If user provides file to `backend/ml/data/raw`, train on it. |
| *Electricity Alt* | Indian Energy Generation Observatory (IEEE DataPort) | Daily state-level load (Oct 2025–2026) | Academic / Open | Option B: Daily resolution is too coarse for 5-min/hourly dispatch; use for macro-calibration only. Fallback to calibrated synthetic for micro-peaks if SLDC unfeasible. |
| **Water** | BWSSB Data on OpenCity | Static ward capacity / monthly totals | Public | **Synthetic with Honest Label:** No sub-daily pressure/flow series exists publicly. Generate realistic synthetic pressure series from the simulator, train a Random Forest, and badge as *"Trained on simulated data: measures fidelity to simulator, not real world"*. |
| **Weather** | **Open-Meteo Historical Weather API** | Hourly temperature, humidity, precipitation for Bengaluru ($12.97^\circ\text{N}, 77.59^\circ\text{E}$) | Open / Non-commercial & commercial free with attribution | **Include as standard covariates** across all models. |

---

## 4. Multi-Lens Goldfish Analysis & Architectural Stress-Testing

### 4.1 Contrarian / YAGNI Lens
- **Risk:** Implementing WebSockets for the simulation clock introduces stateful connection tracking, complex reconnection logic on Render, and horizontal scaling headaches.
- **Resolution:** Render restarts and sleep cycles demand a **stateless, pure deterministic simulation engine**. The client advances the time step $t$, or polls every 2–3s during playback. Given identical seeds and inputs, $f(\text{seed}, t, \text{events})$ reproduces the exact state. Zero WebSocket state needed.
- **Risk:** Over-engineering an LLM summarizer for the Decision Brief.
- **Resolution:** Zero external LLM APIs. The Decision Brief and Why Panels use structured template interpolations driven directly by engine graph metrics.

### 4.2 Cost, Quota & Token Economics Lens
- **Risk:** Render free tier allocation is 750 shared hours/month. Two persistent services (Node + FastAPI) will consume ~1,440 hours if kept awake.
- **Resolution:**
  - Strict absence of continuous background pings.
  - Implement a friendly wake-up screen (`Waking up the city engine...`) for cold starts (60s timeout with retries).
  - Pre-generate an evaluation snapshot during build so that the frontend Model Info page can render immediately without blocking on the Python service.

### 4.3 UX & iPhone Safari Compatibility Lens
- **Risk:** Safari on iOS enforces strict 3rd-party cookie blocking. A cross-domain cookie set by Render (`onrender.com`) will be discarded by Safari on Vercel (`vercel.app`).
- **Resolution:** Authorization Code flow redirects to `frontend/callback?code=XYZ`. The frontend performs a POST exchange for a signed JWT, storing it in memory and `localStorage` (wrapped in `try/catch` for private browsing mode). All subsequent requests pass `Authorization: Bearer <token>`.
- **Risk:** Complex SVG isometric maps and multi-layered backdrop blurs can cause frame drops on mobile Safari.
- **Resolution:** Max 2 stacked blur layers. Provide a responsive bottom tab bar on mobile and an automated fallback to a flat 2D tile grid when `prefers-reduced-motion` is active or viewport width $< 640\text{px}$.

---

## 5. Goals vs. Non-Goals

### In-Scope Goals
- Full-stack web application with distinct `frontend/` (React/Vite/Tailwind) and `backend/` (Express API + `backend/ml/` FastAPI).
- Pure deterministic city simulation engine with 24 infrastructure nodes across 8 zones.
- Living Glass design system with real-time reactive gradient mesh and isometric/2D city views.
- Signature features: Ripple Engine, Future Fork, Weak Link Finder, Why Panels, and Decision Brief.
- Complete ML pipeline: data ingestion, chronological train/val/test splits, Random Forest regressors, Isolation Forest anomaly detector, baselines, and uncertainty intervals.
- Google OAuth 2.0 with Safari one-time code exchange.

### Explicit Non-Goals
- No external generative AI / LLM API calls (no OpenAI, Anthropic, or Gemini API keys required).
- No arbitrary email/password authentication or custom user registration flows.
- No real-time WebSockets or stateful server sessions.
- No fake accuracy claims: simulated and synthetic data are explicitly labeled.

---

## 6. Key Decisions for GATE 1 Approval

To proceed to **Phase A, Step 2 (`/egm-draft`)**, please confirm:
1. **Dataset Strategy:**
   - **Traffic:** Use Bengaluru OpenCity BTP traffic congestion (hourly) + calibrated synthetic zone projections.
   - **Electricity:** Use Karnataka SLDC if user provides the CSV in `backend/ml/data/raw`, OR fall back to calibrated synthetic load generated with Open-Meteo weather features.
   - **Water:** Synthetic deterministic demand/pressure with explicit label *"Trained on simulated data"*.
2. **Scope & Demo Narrative:** Approval of the *"Heatwave + Stadium Event"* 3-minute demo flow and the priority cut order.
3. **Architecture:** Two decoupled Render services + Vercel SPA + MongoDB Atlas.
