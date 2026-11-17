const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Scenario = require('../models/Scenario');
const Playbook = require('../models/Playbook');

// Preset built-in scenarios
const PRESET_SCENARIOS = [
  {
    _id: 'preset_heatwave_stadium',
    title: 'Heatwave & Stadium Surge',
    description: '38°C heatwave coincidental with sold-out championship match at Stadium District.',
    seed: 42,
    events: [
      { type: 'heatwave', severity: 85, startStep: 120, durationSteps: 72 },
      { type: 'stadium_event', zoneId: 'stadium', severity: 95, startStep: 180, durationSteps: 36 },
    ],
    interventions: [],
    isTemplate: true,
  },
  {
    _id: 'preset_pipe_burst_industrial',
    title: 'Industrial Main Pipe Burst',
    description: 'Catastrophic rupture on primary industrial water feeder spreading to residential zones.',
    seed: 101,
    events: [
      { type: 'pipe_burst', zoneId: 'industrial', severity: 90, startStep: 110, durationSteps: 48 },
    ],
    interventions: [],
    isTemplate: true,
  },
  {
    _id: 'preset_downtown_grid_failure',
    title: 'Downtown Substation Transformer Trip',
    description: 'Severe transformer outage in commercial core degrading street traffic signals.',
    seed: 202,
    events: [
      { type: 'substation_outage', zoneId: 'downtown', severity: 100, startStep: 140, durationSteps: 24 },
    ],
    interventions: [],
    isTemplate: true,
  },
];

// Preset built-in playbooks
const PRESET_PLAYBOOKS = [
  {
    _id: 'pb_stadium_egress',
    name: 'Stadium Egress & Grid Relief',
    category: 'stadium',
    description: 'Proactively reroute traffic around Stadium District and cycle cooling pumps off-peak.',
    interventions: [
      { id: 'reroute_traffic', targetNodeId: 'stadium:traffic', delaySteps: 0 },
      { id: 'retime_signals', targetNodeId: 'stadium:traffic', delaySteps: 2 },
    ],
    timesUsed: 14,
    avgStabilityGain: 18.5,
  },
  {
    _id: 'pb_heatwave_curtailment',
    name: 'Heatwave Industrial Curtailment',
    category: 'heatwave',
    description: 'Curtail heavy industrial energy load during peak temperature hours to protect grid.',
    interventions: [
      { id: 'shed_industrial_load', targetNodeId: 'industrial:electricity', delaySteps: 0 },
      { id: 'start_backup_pump', targetNodeId: 'residential_north:water', delaySteps: 3 },
    ],
    timesUsed: 22,
    avgStabilityGain: 24.2,
  },
];

// In-memory fallback stores for offline/dev execution
const inMemoryScenarios = [...PRESET_SCENARIOS];
const inMemoryPlaybooks = [...PRESET_PLAYBOOKS];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * GET /api/scenarios
 */
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbScenarios = await Scenario.find().sort({ createdAt: -1 });
      return res.json([...PRESET_SCENARIOS, ...dbScenarios]);
    }
    res.json(inMemoryScenarios);
  } catch (err) {
    res.json(inMemoryScenarios);
  }
});

/**
 * POST /api/scenarios
 */
router.post('/', async (req, res) => {
  const { title, description, seed, events, interventions } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const scenarioData = {
    title,
    description: description || '',
    seed: seed ?? 42,
    events: events || [],
    interventions: interventions || [],
    createdBy: req.user?.email || 'evaluator@citysync.gov',
  };

  try {
    if (isDbConnected()) {
      const created = await Scenario.create(scenarioData);
      return res.status(201).json(created);
    }
    const memScenario = {
      _id: `scenario_${Date.now()}`,
      ...scenarioData,
      createdAt: new Date().toISOString(),
    };
    inMemoryScenarios.push(memScenario);
    res.status(201).json(memScenario);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create scenario', message: err.message });
  }
});

/**
 * GET /api/scenarios/playbooks
 */
router.get('/playbooks/list', async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbPbs = await Playbook.find().sort({ timesUsed: -1 });
      return res.json([...PRESET_PLAYBOOKS, ...dbPbs]);
    }
    res.json(inMemoryPlaybooks);
  } catch (err) {
    res.json(inMemoryPlaybooks);
  }
});

/**
 * POST /api/scenarios/playbooks
 */
router.post('/playbooks/create', async (req, res) => {
  const { name, description, category, interventions } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const pbData = {
    name,
    description: description || '',
    category: category || 'general',
    interventions: interventions || [],
    timesUsed: 1,
    avgStabilityGain: 15.0,
  };

  try {
    if (isDbConnected()) {
      const created = await Playbook.create(pbData);
      return res.status(201).json(created);
    }
    const memPb = {
      _id: `pb_${Date.now()}`,
      ...pbData,
      createdAt: new Date().toISOString(),
    };
    inMemoryPlaybooks.push(memPb);
    res.status(201).json(memPb);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create playbook', message: err.message });
  }
});

module.exports = router;
