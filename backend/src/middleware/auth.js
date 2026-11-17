const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token required in Authorization header (Bearer <token>).',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'TokenExpired',
        message: 'Your session has expired. Please sign in again.',
      });
    }
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid authentication token.',
    });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required for this action.',
    });
  }
  return next();
}

module.exports = { authenticateJWT, requireAdmin };
