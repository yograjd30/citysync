const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/index');

test('[API Integration] GET /api/simulation/config returns 8 zones and system weights', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/simulation/config`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.zones.length, 8);
  assert.strictEqual(data.systems.length, 3);
  assert.strictEqual(data.badge, 'Rule-based');
});

test('[API Integration] GET /api/simulation/state returns step 144 snapshot', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/simulation/state?step=144&seed=42`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.step, 144);
  assert.strictEqual(data.timeFormatted, '12:00');
  assert.ok(data.stabilityIndex >= 0 && data.stabilityIndex <= 100);
  assert.strictEqual(data.zones.length, 8);
});

test('[API Integration] GET /api/simulation/forecast returns 24-step forecast', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/simulation/forecast?step=100&horizon=24`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.horizonSteps, 24);
  assert.strictEqual(data.horizonMinutes, 120);
  assert.strictEqual(data.forecast.length, 24);
});

test('[API Integration] GET /api/simulation/cascade-trace returns causes & forward links', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/simulation/cascade-trace?nodeId=downtown:traffic&step=110`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.nodeId, 'downtown:traffic');
  assert.ok(Array.isArray(data.causes));
  assert.ok(Array.isArray(data.forwardImpacts));
});

test('[API Integration] GET /api/recommendations/evaluate returns ranked candidate interventions', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/recommendations/evaluate?step=144`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.recommendations));
  assert.strictEqual(data.badge, 'Rule-based');
});

test('[API Integration] GET /api/scenarios returns built-in preset scenarios', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/scenarios`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.length >= 3);
  assert.strictEqual(data[0].isTemplate, true);
});

test('[API Integration] GET /api/ml/models falls back gracefully to evaluation snapshot', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/ml/models`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.traffic);
  assert.strictEqual(data.traffic.badge, 'Trained ML');
  assert.strictEqual(data.traffic.chip, 'Real Data');
});

test('[API Integration] GET /api/ml/evaluation/traffic returns actual vs predicted series', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/ml/evaluation/traffic`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.stream, 'traffic');
  assert.ok(data.evaluation.actuals.length > 0);
  assert.ok(data.evaluation.predictions.length > 0);
});
