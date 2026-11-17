const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const env = require('../config/env');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
const ML_INTERNAL_API_KEY = process.env.ML_INTERNAL_API_KEY || 'citysync-ml-dev-key';

// Load cached snapshot for cold start fallback
const snapshotPath = path.join(__dirname, '..', 'data', 'evaluation_snapshot.json');
let cachedSnapshot = null;
if (fs.existsSync(snapshotPath)) {
  try {
    cachedSnapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  } catch (e) {
    console.warn('[CitySync Gateway] Warning: Could not parse evaluation_snapshot.json');
  }
}

// Simple fetch wrapper using native http/https
function proxyRequest({ method, endpoint, body = null, timeout = 2500 }) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(endpoint, ML_SERVICE_URL);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const headers = {
        'Content-Type': 'application/json',
        'X-Internal-API-Key': ML_INTERNAL_API_KEY,
      };

      const req = client.request(
        url,
        {
          method,
          headers,
          timeout,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              resolve({ statusCode: res.statusCode, data: parsed });
            } catch (err) {
              resolve({ statusCode: res.statusCode, data });
            }
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('ML service timeout'));
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * GET /api/ml/models
 * Returns model registry, hyperparameters, and test set performance
 */
router.get('/models', async (req, res) => {
  try {
    const mlRes = await proxyRequest({ method: 'GET', endpoint: '/models' });
    if (mlRes.statusCode === 200) {
      return res.json(mlRes.data);
    }
  } catch (err) {
    // Graceful fallback to precomputed snapshot
  }

  if (cachedSnapshot && cachedSnapshot.metadata) {
    return res.json({
      ...cachedSnapshot.metadata,
      _fallbackNotice: 'Serving pre-computed evaluation snapshot (FastAPI cold start mitigation)',
    });
  }

  res.status(503).json({ error: 'ML service currently unavailable and no cached snapshot found' });
});

/**
 * GET /api/ml/evaluation/:stream
 * Returns actual vs predicted test chart series
 */
router.get('/evaluation/:stream', async (req, res) => {
  const stream = req.params.stream;
  try {
    const mlRes = await proxyRequest({ method: 'GET', endpoint: `/evaluation/${stream}` });
    if (mlRes.statusCode === 200) {
      return res.json(mlRes.data);
    }
  } catch (err) {
    // Fallback to local snapshot
  }

  if (cachedSnapshot && cachedSnapshot.evaluations && cachedSnapshot.evaluations[stream]) {
    const meta = cachedSnapshot.metadata ? cachedSnapshot.metadata[stream] || {} : {};
    return res.json({
      stream,
      metadata: meta,
      evaluation: cachedSnapshot.evaluations[stream],
      badge: meta.badge || 'Trained ML',
      chip: meta.chip || 'Real Data',
      _fallbackNotice: 'Serving pre-computed evaluation snapshot (FastAPI cold start mitigation)',
    });
  }

  res.status(404).json({ error: `Evaluation data for stream '${stream}' not found` });
});

/**
 * POST /api/ml/predict/:stream
 * Invokes live inference
 */
router.post('/predict/:stream', async (req, res) => {
  const stream = req.params.stream;
  try {
    const mlRes = await proxyRequest({
      method: 'POST',
      endpoint: `/predict/${stream}`,
      body: req.body,
    });
    return res.status(mlRes.statusCode).json(mlRes.data);
  } catch (err) {
    // If FastAPI service is asleep/unreachable, return fallback estimation based on lag_1
    const lag1 = Number(req.body.lag_1 ?? 50);
    return res.json({
      stream,
      prediction: lag1,
      lower_bound: Math.max(0, Number((lag1 * 0.9).toFixed(1))),
      upper_bound: Math.min(100, Number((lag1 * 1.1).toFixed(1))),
      badge: 'Rule-based',
      chip: 'Fallback Estimator',
      _fallbackNotice: 'FastAPI service unreachable; calculated via persistence fallback',
    });
  }
});

/**
 * POST /api/ml/anomaly
 * Invokes isolation forest anomaly detector
 */
router.post('/anomaly', async (req, res) => {
  try {
    const mlRes = await proxyRequest({
      method: 'POST',
      endpoint: '/anomaly',
      body: req.body,
    });
    return res.status(mlRes.statusCode).json(mlRes.data);
  } catch (err) {
    return res.json({
      is_anomaly: false,
      anomaly_score: 0.0,
      badge: 'Rule-based',
      _fallbackNotice: 'FastAPI service unreachable',
    });
  }
});

module.exports = router;
