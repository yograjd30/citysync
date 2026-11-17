const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');

const app = express();

// Trust Render proxy
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: [env.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TooManyRequests', message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TooManyRequests', message: 'Too many authentication attempts.' },
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// Mount Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'NotFound', message: `Route ${req.method} ${req.path} not found.` });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server if run directly
if (require.main === module) {
  connectDB().finally(() => {
    app.listen(env.port, () => {
      console.log(`[CitySync API] Server listening on port ${env.port} (${env.nodeEnv})`);
      console.log(`[CitySync API] Frontend URL allowed: ${env.frontendUrl}`);
    });
  });
}

module.exports = app;
