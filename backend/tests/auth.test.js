const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/index');

test('GET /api/health returns 200 with service metadata', async (t) => {
  // Use http request on app
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
  assert.strictEqual(data.service, 'citysync-backend');
});

test('POST /api/auth/demo-login returns valid JWT and user payload', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.token, 'Token should be present');
  assert.strictEqual(data.user.email, 'operator@citysync.gov');
  assert.strictEqual(data.user.role, 'admin');

  // Verify /api/auth/me with Bearer token
  const meRes = await fetch(`http://localhost:${port}/api/auth/me`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  assert.strictEqual(meRes.status, 200);
  const meData = await meRes.json();
  assert.strictEqual(meData.user.email, 'operator@citysync.gov');
});

test('POST /api/auth/exchange fails with invalid code', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/auth/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'non_existent_code_123' }),
  });
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.error, 'InvalidCode');
});
