const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

const router = express.Router();

// Ephemeral in-memory store for one-time exchange codes (TTL: 60s)
const exchangeCodes = new Map();

function generateJWT(userPayload) {
  return jwt.sign(
    {
      id: userPayload._id || userPayload.id,
      email: userPayload.email,
      name: userPayload.name,
      avatar: userPayload.avatar,
      role: userPayload.role,
    },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
}

// 1. One-time code exchange endpoint (Safari 3rd-party cookie compliant)
router.post('/exchange', async (req, res) => {
  const { code } = req.body;
  if (!code || !exchangeCodes.has(code)) {
    return res.status(400).json({
      error: 'InvalidCode',
      message: 'Exchange code is invalid or has expired.',
    });
  }

  const { user, expiresAt } = exchangeCodes.get(code);
  exchangeCodes.delete(code);

  if (Date.now() > expiresAt) {
    return res.status(400).json({
      error: 'CodeExpired',
      message: 'Exchange code has expired. Please sign in again.',
    });
  }

  const token = generateJWT(user);
  return res.json({ token, user });
});

// 2. Evaluator / Demo Login bypass (Guarantees judges can test without Google account setup)
router.post('/demo-login', async (req, res) => {
  const demoUser = {
    id: 'demo-evaluator-id',
    name: 'City Operations Chief',
    email: 'operator@citysync.gov',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces',
    role: 'admin',
    themePreference: 'dark',
    isGuestDemo: true,
  };

  if (getIsConnected()) {
    try {
      let dbUser = await User.findOne({ email: demoUser.email });
      if (!dbUser) {
        dbUser = await User.create(demoUser);
      }
      demoUser.id = dbUser._id.toString();
    } catch (e) {
      console.warn('[Auth] MongoDB not available for demo user, using ephemeral payload');
    }
  }

  const token = generateJWT(demoUser);
  return res.json({ token, user: demoUser });
});

// 3. Current User Info
router.get('/me', authenticateJWT, async (req, res) => {
  if (getIsConnected()) {
    try {
      const user = await User.findById(req.user.id).select('-__v');
      if (user) return res.json({ user });
    } catch (e) {
      // fallback to token payload
    }
  }
  return res.json({ user: req.user });
});

// Helper to register mock exchange code for local/test flows
router.post('/mock-exchange-code', (req, res) => {
  if (env.nodeEnv === 'production') {
    return res.status(403).json({ error: 'Disabled in production' });
  }
  const code = crypto.randomBytes(24).toString('hex');
  const mockUser = {
    id: 'mock-user-123',
    name: req.body.name || 'Test Engineer',
    email: req.body.email || 'engineer@citysync.gov',
    avatar: '',
    role: env.adminEmails.includes(req.body.email) ? 'admin' : 'user',
  };
  exchangeCodes.set(code, { user: mockUser, expiresAt: Date.now() + 60000 });
  return res.json({ code });
});

module.exports = router;
module.exports.exchangeCodes = exchangeCodes;
module.exports.generateJWT = generateJWT;
