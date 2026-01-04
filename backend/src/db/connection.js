import pg from 'pg';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

export class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: config.database.url,
      ssl: config.database.ssl,
      max: config.database.pool.max,
      min: config.database.pool.min,
      idleTimeoutMillis: config.database.pool.idleTimeoutMillis,
      connectionTimeoutMillis: config.database.pool.acquireTimeoutMillis,
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.pool.on('connect', () => {
      logger.debug('Database client connected');
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected database error', { error: err.message });
    });
  }

  async connect() {
    try {
      const client = await this.pool.connect();
      logger.info('✅ Database connected successfully');
      client.release();
    } catch (error) {
      logger.error('❌ Database connection failed', { error: error.message });
      throw error;
    }
  }

  async query(text, params, options = {}) {
    const start = Date.now();
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      
      if (options.log !== false) {
        logger.debug('Query executed', {
          query: text.substring(0, 100),
          duration: `${duration}ms`,
          rows: result.rowCount,
        });
      }
      
      return result;
    } catch (error) {
      logger.error('Query error', {
        query: text,
        params,
        error: error.message,
      });
      throw error;
    } finally {
      client.release();
    }
  }

  async transaction(callback) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async initDatabase() {
    try {
      await this.query(`
        CREATE TABLE IF NOT EXISTS pastes (
          id VARCHAR(10) PRIMARY KEY,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP WITH TIME ZONE,
          max_views INTEGER,
          view_count INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE
        )
      `);

      await this.query(`
        CREATE INDEX IF NOT EXISTS idx_pastes_expires_at 
        ON pastes(expires_at) WHERE expires_at IS NOT NULL
      `);

      logger.info('✅ Database schema initialized');
    } catch (error) {
      logger.error('Database initialization failed', { error: error.message });
      throw error;
    }
  }

  async close() {
    await this.pool.end();
    logger.info('Database connection closed');
  }
}

// Export singleton instance
export const db = new Database();