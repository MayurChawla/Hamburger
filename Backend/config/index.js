require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  database: {
    type: process.env.DB_TYPE || 'sqlite',
    path: process.env.DB_PATH || './data/database.sqlite',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate required configuration
if (config.env === 'production' && config.jwt.secret === 'your-secret-key-change-in-production') {
  console.warn('⚠️  WARNING: Using default JWT secret in production!');
}

module.exports = config;

