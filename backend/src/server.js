import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config.js';
import { db } from './db/connection.js';
import { logger } from './utils/logger.js';
import pasteRoutes from './routes/pastes.js';
import { PasteController } from './controllers/pasteController.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  },
}));

app.use(cors(config.cors));
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Routes
app.get('/api/healthz', PasteController.healthCheck);
app.get('/api/metrics', PasteController.getMetrics);
app.use('/api/pastes', pasteRoutes);


// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    ...(config.nodeEnv === 'development' && { details: err.message }),
  });
});

// Start server
async function startServer() {
  try {
    await db.connect();
    await db.initDatabase();

    app.listen(config.port, () => {
      logger.info(`🚀 Server running on http://localhost:${config.port}`);
      logger.info(`📊 Health check: http://localhost:${config.port}/api/healthz`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


export default app;