const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/citysync',
  jwtSecret: process.env.JWT_SECRET || 'citysync_dev_jwt_secret_key_change_in_production_2026',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  },
  mlService: {
    url: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    apiKey: process.env.ML_INTERNAL_API_KEY || 'citysync_ml_internal_shared_secret_key_2026',
  },
  adminEmails: (process.env.ADMIN_EMAILS || 'admin@citysync.gov,yograj@citysync.gov')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean),
};
