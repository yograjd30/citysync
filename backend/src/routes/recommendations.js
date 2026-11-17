const express = require('express');
const router = express.Router();

const { rankInterventions, CANDIDATE_ACTIONS } = require('../engine/interventions');
const { simulateStep } = require('../engine/simulationEngine');

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
 * GET /api/recommendations/evaluate
 * Evaluates candidate interventions and ranks them by Stability Gain
 */
router.get('/evaluate', (req, res) => {
  const step = parseInt(req.query.step ?? '144', 10);
  const seed = parseInt(req.query.seed ?? '42', 10);
  const activeEvents = parseArrayParam(req.query.events);

  const ranked = rankInterventions({ seed, step, activeEvents });
  const baseline = simulateStep({ seed, step, activeEvents, interventions: [] });

  res.json({
    step,
    baselineStability: baseline.stabilityIndex,
    baselineNodesInCritical: baseline.nodesInCritical,
    availableInterventionsCount: ranked.length,
    recommendations: ranked,
    badge: 'Rule-based',
  });
});

/**
 * POST /api/recommendations/simulate-choice
 * Compares before and after for an arbitrary set of selected interventions
 */
router.post('/simulate-choice', (req, res) => {
  const step = parseInt(req.body.step ?? '144', 10);
  const seed = parseInt(req.body.seed ?? '42', 10);
  const activeEvents = req.body.activeEvents || [];
  const interventions = req.body.interventions || [];

  const before = simulateStep({ seed, step, activeEvents, interventions: [] });
  const after = simulateStep({ seed, step, activeEvents, interventions });

  const deltaStability = Number((after.stabilityIndex - before.stabilityIndex).toFixed(1));
  const criticalReduced = Math.max(0, before.nodesInCritical - after.nodesInCritical);

  res.json({
    before: {
      stabilityIndex: before.stabilityIndex,
      nodesInCritical: before.nodesInCritical,
      nodesInWarning: before.nodesInWarning,
    },
    after: {
      stabilityIndex: after.stabilityIndex,
      nodesInCritical: after.nodesInCritical,
      nodesInWarning: after.nodesInWarning,
    },
    deltaStability,
    criticalReduced,
    pctImprovement: before.stabilityIndex > 0 ? Number(((deltaStability / before.stabilityIndex) * 100).toFixed(1)) : 0,
    badge: 'Rule-based',
  });
});

module.exports = router;
