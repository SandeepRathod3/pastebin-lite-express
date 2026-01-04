import 'dotenv/config';

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  
  // Database
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : false,
    pool: {
      max: 10,
      min: 2,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
  },
  
  // URLs
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Security
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  
  // Features
  testMode: process.env.TEST_MODE === '1',
};

// Validate required environment variables
if (!config.database.url) {
  throw new Error('DATABASE_URL environment variable is required');
}