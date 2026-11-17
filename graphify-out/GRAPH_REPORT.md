# Graph Report - hacthon 3rd sem  (2026-11-17)

## Corpus Check
- 120 files · ~71,506 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 2, .css 1)

## Summary
- 840 nodes · 1241 edges · 59 communities (46 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `889b9eea`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Dashboard.jsx
- story.mjs
- simulation.js
- [Feature/Project Name]
- frontend/package.json
- CitySync: Technical Design Document (Remediated)
- serve.py
- backend/package.json
- EGM Peanuts and Hay Bootstrap (`egm-bootstrap`)
- CitySync: A City Out of Sync — Concepts Brief (RFC)
- train.py
- CitySync: A City Out of Sync
- Subflows
- index.js
- Unslop
- routes/auth.js
- scenarios
- scenarios
- scenarios
- scenarios
- scenarios
- scenarios
- scenarios
- Goldfish Review: Loop (Orchestration Driver)
- Tokens
- mongoose
- services
- ml.js
- Signs of slop
- scenarios.js
- EGM Brainstorm: Interactive Multi-Lens Ideation & Refinement
- Execution Workflow
- CitySync: 7-Slide Pitch Deck Outline
- api.test.js
- unslop/SKILL.md
- Right to left
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- Effects
- Visuals
- interface
- Verification and Evaluation Commands for `egm-bootstrap`
- Test Plan: EGM Brainstorm Skill
- Test Plan: EGM Draft Skill
- Test Plan: Goldfish Review Resolve Skill
- Test Plan: Goldfish Review Loop Skill
- Test Plan: EGM Review & Subagents
- egm-drift-report/SKILL.md
- egm-drift-report/TEST.md
- CitySync: 3-Minute Live Hackathon Demo Script

## God Nodes (most connected - your core abstractions)
1. `GlassCard()` - 27 edges
2. `react` - 27 edges
3. `Badge()` - 24 edges
4. `apiRequest()` - 23 edges
5. `Dashboard()` - 20 edges
6. `train_and_evaluate()` - 18 edges
7. `lucide-react` - 16 edges
8. `Unslop` - 16 edges
9. `useSimulation()` - 15 edges
10. `simulateStep()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `loadForecast()` --calls--> `apiRequest()`  [EXTRACTED]
  frontend/src/pages/EarlyWarnings.jsx → frontend/src/api/client.js
- `loadData()` --calls--> `apiRequest()`  [EXTRACTED]
  frontend/src/pages/ModelInfo.jsx → frontend/src/api/client.js
- `loadRecommendations()` --calls--> `apiRequest()`  [EXTRACTED]
  frontend/src/pages/Recommendations.jsx → frontend/src/api/client.js
- `loadData()` --calls--> `apiRequest()`  [EXTRACTED]
  frontend/src/pages/Resilience.jsx → frontend/src/api/client.js
- `verifySession()` --calls--> `apiRequest()`  [EXTRACTED]
  frontend/src/context/AuthContext.jsx → frontend/src/api/client.js

## Import Cycles
- None detected.

## Communities (59 total, 13 thin omitted)

### Community 0 - "Dashboard.jsx"
Cohesion: 0.11
Nodes (47): apiRequest(), setClientToken(), App(), AppContent(), ProtectedRoute(), Badge(), Button(), CommandBar() (+39 more)

### Community 1 - "story.mjs"
Cohesion: 0.05
Nodes (26): args, chrome, positionals, args, chrome, file, frame, frames (+18 more)

### Community 2 - "simulation.js"
Cohesion: 0.11
Nodes (25): fs, path, NODE_CAPACITIES, SYSTEM_WEIGHTS, SYSTEMS, ZONE_ADJACENCY, ZONES, DEFAULT_COUPLING_RULES (+17 more)

### Community 3 - "[Feature/Project Name]"
Cohesion: 0.06
Nodes (31): 1. `[File Path 1]` ([Create | Modify]), 2. `[File Path 2]` ([Create | Modify]), Additional Resources, Alternative A: [Alternative Title], Alternatives Considered, Critical User Journeys (CUJs), CUJ 1: [Journey Title], CUJ 2: [Journey Title] (+23 more)

### Community 4 - "frontend/package.json"
Cohesion: 0.08
Nodes (29): dependencies, clsx@^2.1.1, lucide-react@^0.378.0, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^6.23.0, tailwind-merge@^2.3.0, devDependencies (+21 more)

### Community 5 - "CitySync: Technical Design Document (Remediated)"
Cohesion: 0.07
Nodes (28): 10. iPhone Safari & Living Glass Implementation, 11. Critical User Journeys (CUJs), 1. Overview & Problem Statement, 2.1 Goals, 2.2 Non-Goals, 2. Goals & Non-Goals, 3.1 Dual Render Cold-Start Mitigation, 3. High-Level Architecture & Communication Flow (+20 more)

### Community 6 - "serve.py"
Cohesion: 0.08
Nodes (9): detect_anomaly(), FeaturePayload, get_evaluation_data(), get_models_info(), health_check(), load_artifacts(), predict_stream(), startup_event() (+1 more)

### Community 7 - "backend/package.json"
Cohesion: 0.12
Nodes (21): dependencies, cors@^2.8.5, dotenv@^16.4.5, express-rate-limit@^7.2.0, helmet@^7.1.0, passport@^0.7.0, passport-google-oauth20@^2.0.0, description (+13 more)

### Community 8 - "EGM Peanuts and Hay Bootstrap (`egm-bootstrap`)"
Cohesion: 0.11
Nodes (17): 📄 Component Package (Peanuts) README Template, egm-bootstrap README Templates, 📄 Intermediate Blueprint README Template, 📄 Repository Root (Blueprint / Hay) README Template, Delegation, EGM Peanuts and Hay Bootstrap (`egm-bootstrap`), Execution Constraints (CRITICAL), Inputs (+9 more)

### Community 9 - "CitySync: A City Out of Sync — Concepts Brief (RFC)"
Cohesion: 0.11
Nodes (18): 1.1 Problem Statement, 1.2 Product Definition & Value Proposition, 1. Overview & Problem Definition, 2.1 The Smallest Version That Wins (Core MVP), 2.2 What to Cut If Time is Compressed (Priority Fallback Order), 2.3 The Signature Demo Story (The 3-Minute Hackathon Winning Walkthrough), 2. Scope Challenge & The Smallest Winning Product, 3.1 Candidate Evaluation & Options (+10 more)

### Community 10 - "train.py"
Cohesion: 0.09
Nodes (12): AnomalyDetector, compute_baselines(), compute_metrics(), TrafficElectricityRegressor, build_features(), chronological_split(), test_chronological_split_no_overlap(), test_zero_lookahead_leakage() (+4 more)

### Community 11 - "CitySync: A City Out of Sync"
Cohesion: 0.11
Nodes (18): 1. Backend Setup (Node.js API), 1. Problem Statement, 2. Machine Learning Service (FastAPI), 2. System Architecture, 3. Data Honesty & Provenance, 3. Frontend Setup (React Vite), 4. Evaluator Login Bypass, 4. Key Innovation Features (+10 more)

### Community 12 - "Subflows"
Cohesion: 0.12
Nodes (16): Delegation, Execution Constraints (CRITICAL), Inputs, Review, Validation & Automated Remediation, Step 1: Intake & Setup, Step 2: Curated Pipeline Preset Selection, Step 3: Semantic Split Discovery, Step 4: Staging Strategy (+8 more)

### Community 13 - "index.js"
Cohesion: 0.15
Nodes (14): express@^4.19.2, connectDB(), getIsConnected(), mongoose, authLimiter, cors, express, generalLimiter (+6 more)

### Community 14 - "Unslop"
Cohesion: 0.12
Nodes (16): 1. Spacing, 2. Color, 3. Icons, 4. Copy, 5. Type, 6. Layout, 7. Details, 8. Visuals (+8 more)

### Community 15 - "routes/auth.js"
Cohesion: 0.15
Nodes (10): jsonwebtoken@^9.0.2, dotenv, authenticateJWT(), jwt, crypto, exchangeCodes, express, jwt (+2 more)

### Community 16 - "scenarios"
Cohesion: 0.13
Nodes (14): message, pattern, type, description, scenarios, description, eval_type, scenario_id (+6 more)

### Community 17 - "scenarios"
Cohesion: 0.13
Nodes (14): message, pattern, type, description, scenarios, description, eval_type, scenario_id (+6 more)

### Community 18 - "scenarios"
Cohesion: 0.13
Nodes (14): message, pattern, type, description, scenarios, description, eval_type, scenario_id (+6 more)

### Community 19 - "scenarios"
Cohesion: 0.13
Nodes (14): message, pattern, type, description, scenarios, description, eval_type, scenario_id (+6 more)

### Community 20 - "scenarios"
Cohesion: 0.13
Nodes (14): message, pattern, type, description, scenarios, description, eval_type, scenario_id (+6 more)

### Community 21 - "scenarios"
Cohesion: 0.13
Nodes (14): message, pattern, type, description, scenarios, description, eval_type, scenario_id (+6 more)

### Community 22 - "scenarios"
Cohesion: 0.13
Nodes (14): message, pattern, type, description, scenarios, description, eval_type, scenario_id (+6 more)

### Community 23 - "Goldfish Review: Loop (Orchestration Driver)"
Cohesion: 0.14
Nodes (13): 2.1 Unconditional Target Resolution, 2.2 Review Swarm Execution, 2.3 Aggregated Resolution Hand-off, 2.4 Iteration Check & Turn Boundary, Delegation, Execution Workflow, Goldfish Review: Loop (Orchestration Driver), Inputs (+5 more)

### Community 24 - "Tokens"
Cohesion: 0.14
Nodes (14): Accent, App layout, Buttons, Dark, Depth, Icons, Light, Motion (+6 more)

### Community 25 - "mongoose"
Cohesion: 0.14
Nodes (10): mongoose@^8.3.1, CouplingSchema, mongoose, IncidentSchema, mongoose, mongoose, ScenarioSchema, mongoose (+2 more)

### Community 26 - "services"
Cohesion: 0.12
Nodes (16): fromService, generateValue, key, value, name, property, type, services (+8 more)

### Community 27 - "ml.js"
Cohesion: 0.15
Nodes (7): express, fs, http, https, path, router, snapshotPath

### Community 28 - "Signs of slop"
Cohesion: 0.17
Nodes (12): Components, Copy, Icons, Landing pages and heroes, Motion, Right to left, Signs of slop, Spacing (+4 more)

### Community 29 - "scenarios.js"
Cohesion: 0.17
Nodes (9): mongoose, PlaybookSchema, express, inMemoryPlaybooks, inMemoryScenarios, mongoose, PRESET_PLAYBOOKS, PRESET_SCENARIOS (+1 more)

### Community 30 - "EGM Brainstorm: Interactive Multi-Lens Ideation & Refinement"
Cohesion: 0.18
Nodes (10): Delegation, EGM Brainstorm: Interactive Multi-Lens Ideation & Refinement, Execution Constraints (CRITICAL), Execution Workflow, Overview, Step 1: Deep Clarification & Problem Statement Drilling, Step 2: Goldfish Review & Synthesis, Step 3: Interactive Iteration & Refinement Loop (+2 more)

### Community 31 - "Execution Workflow"
Cohesion: 0.18
Nodes (10): Execution Workflow, Goldfish Review: Resolve, Inputs, Overview, Prerequisites & Context Strategy, Step 1: Intake Validation & Gather Context, Step 2: Evaluate & Categorize, Step 3: Report Fixes (+2 more)

### Community 32 - "CitySync: 7-Slide Pitch Deck Outline"
Cohesion: 0.22
Nodes (8): CitySync: 7-Slide Pitch Deck Outline, Slide 1: Title & Hook, Slide 2: Problem — "A City Out of Sync", Slide 3: The Solution — Unified Cross-Infrastructure Intelligence, Slide 4: Innovation Layer — Visualizing the Chain Reaction, Slide 5: Machine Learning & Absolute Data Honesty, Slide 6: Measurable Operator Impact, Slide 7: Tech Stack & Deployment

### Community 33 - "api.test.js"
Cohesion: 0.28
Nodes (5): app, assert, test, assert, test

### Community 35 - "Right to left"
Cohesion: 0.25
Nodes (8): Copy, Direction, Icons, Mixed text, Numbers, Right to left, Scripture and quoted text, Type

### Community 36 - "interface"
Cohesion: 0.29
Nodes (6): interface, brand_color, display_name, icon_large, icon_small, short_description

### Community 37 - "interface"
Cohesion: 0.29
Nodes (6): interface, brand_color, display_name, icon_large, icon_small, short_description

### Community 38 - "interface"
Cohesion: 0.29
Nodes (6): interface, brand_color, display_name, icon_large, icon_small, short_description

### Community 39 - "interface"
Cohesion: 0.29
Nodes (6): interface, brand_color, display_name, icon_large, icon_small, short_description

### Community 40 - "interface"
Cohesion: 0.29
Nodes (6): interface, brand_color, display_name, icon_large, icon_small, short_description

### Community 41 - "interface"
Cohesion: 0.29
Nodes (6): interface, brand_color, display_name, icon_large, icon_small, short_description

### Community 42 - "interface"
Cohesion: 0.29
Nodes (6): interface, brand_color, display_name, icon_large, icon_small, short_description

### Community 43 - "Effects"
Cohesion: 0.29
Nodes (7): Dithering, Duotone, Effects, Glyphs, Halftone dots, Implementation, Performance

### Community 44 - "Visuals"
Cohesion: 0.29
Nodes (7): Decide what the visual is, Generate it, Objects for moments, Prompt recipe, Put it on the page, Styles that work, Visuals

### Community 45 - "interface"
Cohesion: 0.40
Nodes (4): interface, default_prompt, display_name, short_description

### Community 58 - "CitySync: 3-Minute Live Hackathon Demo Script"
Cohesion: 0.25
Nodes (7): [0:00 – 0:30] The Hook: The Hidden Chain Reaction, [0:30 – 1:00] Diurnal Flow & The Synthetic City, [1:00 – 1:45] Injecting the Crisis: The Ripple Engine, [1:45 – 2:15] The Causal "Why Panel" & Early Warning, [2:15 – 2:45] Future Fork: Testing Interventions Before Deploying, [2:45 – 3:00] Data Integrity & Wrap Up, CitySync: 3-Minute Live Hackathon Demo Script

## Knowledge Gaps
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `index.js` to `simulation.js`, `backend/package.json`, `routes/auth.js`, `ml.js`, `scenarios.js`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Should `Dashboard.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11423423423423423 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Dashboard.jsx` to `frontend/package.json`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Should `story.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.053156146179401995 - nodes in this community are weakly interconnected._
- **Why does `mongoose` connect `mongoose` to `scenarios.js`, `index.js`, `backend/package.json`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Should `simulation.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11341463414634147 - nodes in this community are weakly interconnected._
- **Should `[Feature/Project Name]` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._