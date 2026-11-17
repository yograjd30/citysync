const test = require('node:test');
const assert = require('node:assert');
const { simulateStep, precomputeDayTimeline } = require('../src/engine/simulationEngine');
const { generateEarlyWarningForecast } = require('../src/engine/forecastBaseline');
const { rankInterventions } = require('../src/engine/interventions');
const { generate30DaySyntheticHistory } = require('../src/engine/syntheticGenerator');

test('Simulation Engine: Determinism & Reproducibility', () => {
  const run1 = simulateStep({ seed: 101, step: 100 });
  const run2 = simulateStep({ seed: 101, step: 100 });
  assert.deepStrictEqual(run1, run2, 'Identical seeds and steps must return identical state');
});

test('Simulation Engine: Stability Index is strictly bounded in [0, 100]', () => {
  // Test baseline
  const normal = simulateStep({ seed: 42, step: 50 });
  assert.ok(normal.stabilityIndex >= 0 && normal.stabilityIndex <= 100);

  // Test extreme catastrophe scenario
  const severeEvents = [
    { type: 'heatwave', zoneId: 'downtown', severity: 1.0, startStep: 0, durationSteps: 288 },
    { type: 'stadium_event', zoneId: 'stadium', severity: 1.0, startStep: 0, durationSteps: 288 },
    { type: 'substation_outage', zoneId: 'industrial', severity: 1.0, startStep: 0, durationSteps: 288 },
    { type: 'pipe_burst', zoneId: 'old_town', severity: 1.0, startStep: 0, durationSteps: 288 },
  ];
  const catastrophe = simulateStep({ seed: 42, step: 150, activeEvents: severeEvents });
  assert.ok(catastrophe.stabilityIndex >= 0, `Stability must not drop below 0: got ${catastrophe.stabilityIndex}`);
  assert.ok(catastrophe.stabilityIndex <= 100);
  assert.ok(catastrophe.nodesInCritical > 0, 'Severe events should produce critical nodes');
});

test('Simulation Engine: Diurnal patterns reflect rush hour traffic peaks', () => {
  const night = simulateStep({ seed: 42, step: 24 }); // 02:00 AM
  const morningRush = simulateStep({ seed: 42, step: 108 }); // 09:00 AM

  const nightDowntownTraffic = night.zones.find((z) => z.zoneId === 'downtown').traffic.demand;
  const rushDowntownTraffic = morningRush.zones.find((z) => z.zoneId === 'downtown').traffic.demand;

  assert.ok(rushDowntownTraffic > nightDowntownTraffic, 'Morning rush traffic must exceed night traffic');
});

test('Coupling Engine: Heatwave cascades to electricity strain and water pressure drop', () => {
  const baseline = simulateStep({ seed: 777, step: 144, activeEvents: [] });
  const heatwave = simulateStep({
    seed: 777,
    step: 144,
    activeEvents: [{ type: 'heatwave', zoneId: 'downtown', severity: 0.8, startStep: 120, durationSteps: 40 }],
  });

  const basePower = baseline.zones.find((z) => z.zoneId === 'downtown').electricity.demand;
  const heatPower = heatwave.zones.find((z) => z.zoneId === 'downtown').electricity.demand;
  assert.ok(heatPower > basePower, 'Heatwave must increase electrical demand');

  const baseWater = baseline.zones.find((z) => z.zoneId === 'downtown').water.pressure;
  const heatWater = heatwave.zones.find((z) => z.zoneId === 'downtown').water.pressure;
  assert.ok(heatWater < baseWater, 'Heatwave must decrease water pressure');
});

test('Early Warning: Forecast projects 2-hour trajectory and calculates time-to-breach', () => {
  const forecast = generateEarlyWarningForecast({
    seed: 42,
    currentStep: 100,
    horizonSteps: 24,
    activeEvents: [{ type: 'heatwave', zoneId: 'res_north', severity: 0.9, startStep: 102, durationSteps: 30 }],
  });

  assert.strictEqual(forecast.allForecasts.length, 24, 'Must forecast all 24 nodes');
  assert.strictEqual(forecast.horizonMinutes, 120, 'Horizon must be 120 minutes (2 hours)');
  assert.ok(Array.isArray(forecast.impendingBreaches), 'Impending breaches must be an array');
});

test('Intervention Evaluator: Ranks counter-measures and computes delta stability', () => {
  const severeEvents = [{ type: 'heatwave', zoneId: 'res_north', severity: 0.85, startStep: 100, durationSteps: 40 }];
  const recommendations = rankInterventions({ seed: 42, step: 110, activeEvents: severeEvents });

  assert.ok(recommendations.length > 0, 'Should find candidate interventions');
  assert.strictEqual(recommendations[0].rank, 1, 'Top recommendation should have rank 1');
  assert.ok(recommendations[0].deltaStability >= 0, 'Ranked recommendations must yield positive or zero delta');
  assert.ok(recommendations[0].residentsHelped >= 0, 'Residents helped must be non-negative');
});

test('Synthetic Generator: Produces full day history with 288 steps', () => {
  const dayTimeline = precomputeDayTimeline({ seed: 42, activeEvents: [] });
  assert.strictEqual(dayTimeline.length, 288, 'A full 24-hour day must have 288 discrete 5-min steps');
  assert.strictEqual(dayTimeline[0].step, 0);
  assert.strictEqual(dayTimeline[287].step, 287);
});
