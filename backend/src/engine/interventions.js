const { ZONES } = require('./cityConfig');
const { simulateStep } = require('./simulationEngine');

const CANDIDATE_ACTIONS = [
  {
    actionId: 'reroute_traffic',
    name: 'Dynamic Corridor Rerouting',
    system: 'traffic',
    description: 'Enforce dynamic arterial bypass signage and divert egress flow around congested bottleneck.',
  },
  {
    actionId: 'retime_signals',
    name: 'Adaptive Signal Timing',
    system: 'traffic',
    description: 'Switch traffic signaling to green-wave priority on key feeder avenues.',
  },
  {
    actionId: 'shed_industrial_load',
    name: 'Industrial Load Curtailment',
    system: 'electricity',
    description: 'Shed non-essential heavy manufacturing power draw to relieve stressed primary substation.',
  },
  {
    actionId: 'start_backup_pump',
    name: 'Secondary Booster Activation',
    system: 'water',
    description: 'Engage municipal auxiliary reservoir pumps to stabilize failing distribution pressure.',
  },
];

/**
 * Evaluates candidate interventions for a developing scenario and ranks them by efficacy.
 * @param {Object} params
 * @param {number} params.seed
 * @param {number} params.step
 * @param {Array} params.activeEvents
 * @returns {Array} Ranked recommendations with before/after delta metrics and residents helped
 */
function rankInterventions({ seed = 42, step = 144, activeEvents = [] }) {
  // Baseline run without interventions
  const baseline = simulateStep({ seed, step, activeEvents, interventions: [] });

  const evaluated = [];

  // Generate candidates for critical or warning zones
  ZONES.forEach((zone) => {
    CANDIDATE_ACTIONS.forEach((action) => {
      const candidateIntervention = [{ actionId: action.actionId, targetZone: zone.id }];

      const testRun = simulateStep({
        seed,
        step,
        activeEvents,
        interventions: candidateIntervention,
      });

      const deltaStability = Number((testRun.stabilityIndex - baseline.stabilityIndex).toFixed(1));
      const nodesSaved = Math.max(0, baseline.nodesInCritical - testRun.nodesInCritical);

      // Only include interventions that offer positive relief
      if (deltaStability > 0 || nodesSaved > 0) {
        evaluated.push({
          actionId: action.actionId,
          title: `${action.name} (${zone.name})`,
          targetZone: zone.id,
          zoneName: zone.name,
          system: action.system,
          description: action.description,
          baselineStability: baseline.stabilityIndex,
          projectedStability: testRun.stabilityIndex,
          deltaStability,
          nodesSavedFromCritical: nodesSaved,
          residentsHelped: Math.round(zone.population * (deltaStability / 100)),
        });
      }
    });
  });

  // Sort by deltaStability descending, then nodesSaved
  const ranked = evaluated.sort((a, b) => b.deltaStability - a.deltaStability || b.nodesSavedFromCritical - a.nodesSavedFromCritical);

  return ranked.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

module.exports = {
  CANDIDATE_ACTIONS,
  rankInterventions,
};
