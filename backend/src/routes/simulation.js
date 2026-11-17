const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { ZONES, SYSTEMS, SYSTEM_WEIGHTS, ZONE_ADJACENCY, TOTAL_WEIGHT_SUM, NODE_CAPACITIES } = require('../engine/cityConfig');
const { DEFAULT_COUPLING_RULES } = require('../engine/couplingModel');
const { simulateStep, precomputeDayTimeline } = require('../engine/simulationEngine');
const { generateEarlyWarningForecast } = require('../engine/forecastBaseline');
const { generateIncidentLibrary } = require('../engine/syntheticGenerator');

// Load or generate incident library
let incidentCache = null;
function getIncidents() {
  if (!incidentCache) {
    const incPath = path.join(__dirname, '..', 'data', 'incidentLibrary.json');
    if (fs.existsSync(incPath)) {
      try {
        incidentCache = JSON.parse(fs.readFileSync(incPath, 'utf8'));
      } catch (e) {
        incidentCache = generateIncidentLibrary();
      }
    } else {
      incidentCache = generateIncidentLibrary();
    }
  }
  return incidentCache;
}

// Parse helper for query or body JSON params
function parseArrayParam(param) {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  try {
    return JSON.parse(param);
  } catch (e) {
    return [];
  }
}

/**
 * GET /api/simulation/config
 * Returns static topology and metadata
 */
router.get('/config', (req, res) => {
  res.json({
    zones: ZONES,
    systems: SYSTEMS,
    systemWeights: SYSTEM_WEIGHTS,
    totalWeightSum: TOTAL_WEIGHT_SUM,
    adjacency: ZONE_ADJACENCY,
    capacities: NODE_CAPACITIES,
    couplingRules: DEFAULT_COUPLING_RULES,
    badge: 'Rule-based',
  });
});

/**
 * GET /api/simulation/state
 * Returns state at specific step and seed
 */
router.get('/state', (req, res) => {
  const step = parseInt(req.query.step ?? '100', 10);
  const seed = parseInt(req.query.seed ?? '42', 10);
  const activeEvents = parseArrayParam(req.query.events);
  const interventions = parseArrayParam(req.query.interventions);

  const state = simulateStep({ seed, step, activeEvents, interventions });
  res.json({
    ...state,
    badge: 'Simulated',
  });
});

/**
 * POST /api/simulation/timeline
 * Pre-computes full 288-step day for fluid scrubbing
 */
router.post('/timeline', (req, res) => {
  const seed = parseInt(req.body.seed ?? '42', 10);
  const activeEvents = req.body.activeEvents || [];
  const interventions = req.body.interventions || [];

  const timeline = precomputeDayTimeline({ seed, activeEvents, interventions });
  res.json({
    seed,
    stepsCount: timeline.length,
    timeline,
    badge: 'Simulated',
  });
});

/**
 * GET /api/simulation/forecast
 * 2-hour early warning trajectory and time-to-breach
 */
router.get('/forecast', (req, res) => {
  const currentStep = parseInt(req.query.step ?? '100', 10);
  const seed = parseInt(req.query.seed ?? '42', 10);
  const horizonSteps = parseInt(req.query.horizon ?? '24', 10);
  const activeEvents = parseArrayParam(req.query.events);
  const interventions = parseArrayParam(req.query.interventions);

  const forecastResult = generateEarlyWarningForecast({
    seed,
    currentStep,
    horizonSteps,
    activeEvents,
    interventions,
  });

  res.json({
    currentStep,
    horizonSteps,
    horizonMinutes: horizonSteps * 5,
    forecast: forecastResult.allForecasts,
    impendingBreaches: forecastResult.impendingBreaches,
    badge: 'Rule-based',
  });
});

/**
 * GET /api/simulation/cascade-trace
 * Returns cause chain and forward projected impacts for a specific node
 */
router.get('/cascade-trace', (req, res) => {
  const nodeId = req.query.nodeId; // format "downtown:traffic"
  const step = parseInt(req.query.step ?? '100', 10);
  const seed = parseInt(req.query.seed ?? '42', 10);

  if (!nodeId || !nodeId.includes(':')) {
    return res.status(400).json({ error: 'Invalid nodeId. Expected format "zoneId:system"' });
  }

  const [zoneId, system] = nodeId.split(':');
  const zone = ZONES.find((z) => z.id === zoneId);
  if (!zone) {
    return res.status(404).json({ error: `Zone ${zoneId} not found` });
  }

  // Current state
  const state = simulateStep({ seed, step, activeEvents: [], interventions: [] });
  const zoneData = state.zones.find((z) => z.zoneId === zoneId);
  const currentStress = zoneData ? zoneData[system]?.stress ?? 0 : 0;

  // Root cause determination
  const causes = [];
  if (system === 'traffic') {
    causes.push({
      cause: 'Peak hour commuting influx',
      sourceNode: `${zoneId}:diurnal`,
      lagMinutes: 0,
      linkStrength: 'High',
    });
    // Check if adjacent zones have high traffic
    const neighbors = ZONE_ADJACENCY[zoneId] || [];
    neighbors.forEach((nId) => {
      const nData = state.zones.find((z) => z.zoneId === nId);
      if (nData && nData.traffic.stress > 50) {
        causes.push({
          cause: `Traffic spillover from adjacent zone (${nData.name})`,
          sourceNode: `${nId}:traffic`,
          lagMinutes: 10,
          linkStrength: 'Medium',
        });
      }
    });
  } else if (system === 'electricity') {
    causes.push({
      cause: 'Substation diurnal demand + cooling surge',
      sourceNode: `${zoneId}:diurnal`,
      lagMinutes: 0,
      linkStrength: 'High',
    });
    if (zoneData && zoneData.traffic.stress > 60) {
      causes.push({
        cause: 'High traffic congestion elevating street-level commercial/signal load',
        sourceNode: `${zoneId}:traffic`,
        lagMinutes: 10,
        linkStrength: 'Moderate',
      });
    }
  } else if (system === 'water') {
    causes.push({
      cause: 'Municipal delivery draw',
      sourceNode: `${zoneId}:diurnal`,
      lagMinutes: 0,
      linkStrength: 'Normal',
    });
    if (zoneData && zoneData.electricity.stress > 70) {
      causes.push({
        cause: 'Substation load shedding reducing pump station output',
        sourceNode: `${zoneId}:electricity`,
        lagMinutes: 15,
        linkStrength: 'High',
      });
    }
  }

  // Forward impacts
  const forwardImpacts = [];
  if (system === 'traffic') {
    const neighbors = ZONE_ADJACENCY[zoneId] || [];
    neighbors.forEach((nId) => {
      forwardImpacts.push({
        targetNode: `${nId}:traffic`,
        description: `Spillover congestion into ${nId}`,
        lagMinutes: 10,
        estimatedStressDelta: '+15 to +25',
      });
    });
  } else if (system === 'electricity') {
    forwardImpacts.push(
      {
        targetNode: `${zoneId}:traffic`,
        description: 'Signal timing disruption & intersection delay',
        lagMinutes: 10,
        estimatedStressDelta: '+25',
      },
      {
        targetNode: `${zoneId}:water`,
        description: 'Main pump brownout causing line pressure collapse',
        lagMinutes: 15,
        estimatedStressDelta: '+35 (Pressure Drop)',
      }
    );
  } else if (system === 'water') {
    forwardImpacts.push({
      targetNode: `${zoneId}:electricity`,
      description: 'Auxiliary backup pumps kick in, increasing grid load',
      lagMinutes: 5,
      estimatedStressDelta: '+15',
    });
  }

  res.json({
    nodeId,
    zoneName: zone.name,
    system,
    currentStress,
    status: currentStress >= 70 ? 'critical' : currentStress >= 40 ? 'warning' : 'normal',
    causes,
    forwardImpacts,
    badge: 'Rule-based',
  });
});

/**
 * GET /api/simulation/incidents
 * Returns the 12 incident library patterns
 */
router.get('/incidents', (req, res) => {
  const incidents = getIncidents();
  res.json({
    count: incidents.length,
    incidents,
    badge: 'Simulated',
  });
});

/**
 * GET /api/simulation/weak-links
 * Stress tests all 24 nodes in turn to find the most dangerous single points of failure
 */
router.get('/weak-links', (req, res) => {
  const seed = parseInt(req.query.seed ?? '42', 10);
  const baseStep = 144; // midday peak
  const baseline = simulateStep({ seed, step: baseStep, activeEvents: [], interventions: [] });

  const results = [];

  ZONES.forEach((zone) => {
    SYSTEMS.forEach((system) => {
      const nodeId = `${zone.id}:${system}`;
      // Degrade this node to 100% stress via synthetic event
      const testEvent = [
        {
          type: system === 'traffic' ? 'road_closure' : system === 'electricity' ? 'substation_outage' : 'pipe_burst',
          zoneId: zone.id,
          severity: 100,
          startStep: baseStep,
          durationSteps: 6,
        },
      ];

      const run = simulateStep({ seed, step: baseStep + 2, activeEvents: testEvent, interventions: [] });
      const stabilityDrop = Math.max(0, Number((baseline.stabilityIndex - run.stabilityIndex).toFixed(1)));
      const criticalCount = run.nodesInCritical;
      const residentsAffected = zone.population;

      results.push({
        nodeId,
        zoneId: zone.id,
        zoneName: zone.name,
        system,
        stabilityDrop,
        nodesInCritical: criticalCount,
        residentsAffected,
        dangerRank: 0, // Assigned below
        betweennessCentrality: zone.id === 'downtown' ? 0.88 : zone.id === 'tech_park' ? 0.72 : 0.45,
      });
    });
  });

  // Rank by stability drop descending
  results.sort((a, b) => b.stabilityDrop - a.stabilityDrop);
  results.forEach((r, idx) => {
    r.dangerRank = idx + 1;
  });

  const cityResilienceScore = Math.max(
    30,
    Math.round(100 - results.slice(0, 5).reduce((acc, cur) => acc + cur.stabilityDrop, 0) / 3)
  );

  res.json({
    cityResilienceScore,
    baselineStability: baseline.stabilityIndex,
    rankedWeakLinks: results,
    badge: 'Rule-based',
  });
});

module.exports = router;
