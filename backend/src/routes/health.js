const express = require('express');
const { getIsConnected } = require('../config/db');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'citysync-backend',
    uptimeSeconds: Math.floor(process.uptime()),
    database: getIsConnected() ? 'connected' : 'in-memory-fallback',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
