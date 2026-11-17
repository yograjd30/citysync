const { simulateStep } = require('./simulationEngine');

/**
 * Generates 2-hour statistical trend & early warning forecast across all 24 nodes.
 * @param {Object} params
 * @param {number} params.currentStep - Current simulation step
 * @param {number} [params.horizonSteps=24] - 2 hours (24 x 5-minute ticks)
 * @param {Array} [params.activeEvents=[]] - Injected events
 * @param {Array} [params.interventions=[]] - Active interventions
 * @returns {Array} Forecast series, breach warnings, and time to breach in minutes
 */
function generateEarlyWarningForecast({
  seed = 42,
  currentStep = 144,
  horizonSteps = 24,
  activeEvents = [],
  interventions = [],
}) {
  const futureStates = [];
  for (let offset = 1; offset <= horizonSteps; offset++) {
    const targetStep = (currentStep + offset) % 288;
    futureStates.push(simulateStep({ seed, step: targetStep, activeEvents, interventions }));
  }

  const nodeForecasts = [];

  // Evaluate each of the 24 nodes
  const currentState = simulateStep({ seed, step: currentStep, activeEvents, interventions });

  currentState.zones.forEach((zone) => {
    ['traffic', 'electricity', 'water'].forEach((system) => {
      const currentStress = zone[system].stress;
      const trajectory = futureStates.map((fs) => {
        const fz = fs.zones.find((z) => z.zoneId === zone.zoneId);
        return fz ? fz[system].stress : currentStress;
      });

      // Find first future tick where stress >= 70 (Critical Breach)
      let timeToBreachMinutes = null;
      for (let i = 0; i < trajectory.length; i++) {
        if (trajectory[i] >= 70) {
          timeToBreachMinutes = (i + 1) * 5;
          break;
        }
      }

      const isImpendingBreach = timeToBreachMinutes !== null && currentStress < 70;

      nodeForecasts.push({
        nodeId: `${zone.zoneId}:${system}`,
        zoneId: zone.zoneId,
        zoneName: zone.name,
        system,
        currentStress,
        trajectory,
        timeToBreachMinutes,
        isImpendingBreach,
        confidenceLevel: 'High (Deterministic Coupling)',
        badge: 'Rule-based',
      });
    });
  });

  return {
    currentStep,
    horizonMinutes: horizonSteps * 5,
    impendingBreaches: nodeForecasts
      .filter((n) => n.isImpendingBreach)
      .sort((a, b) => (a.timeToBreachMinutes || 999) - (b.timeToBreachMinutes || 999)),
    allForecasts: nodeForecasts,
  };
}

module.exports = {
  generateEarlyWarningForecast,
};
