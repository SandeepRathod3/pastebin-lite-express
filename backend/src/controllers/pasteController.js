import { db } from '../db/connection.js';
import { logger } from '../utils/logger.js';
import { Paste } from '../models/pasteModel.js';

export class PasteController {
  static async createPaste(req, res) {
    try {
      const { content, ttl_seconds, max_views } = req.validatedBody;
      
      const paste = await Paste.create({
        content,
        ttlSeconds: ttl_seconds,
        maxViews: max_views,
      });
      
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      const url = `${process.env.FRONTEND_URL || baseUrl}/p/${paste.id}`;
      
      res.status(201).json({
        id: paste.id,
        url,
        expires_at: paste.expiresAt?.toISOString() || null,
      });
    } catch (error) {
      logger.error('Error creating paste:', error);
      res.status(500).json({ 
        error: 'Failed to create paste',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }

  static async getPaste(req, res) {
    try {
      const { id } = req.params;
      const { testNowMs } = req;
      
      const paste = await Paste.findById(id, testNowMs);
      
      if (!paste) {
        return res.status(404).json({ 
          error: 'Paste not found or unavailable' 
        });
      }
      
      // Increment view count for API calls
      await paste.incrementViewCount();
      
      res.json(paste.toJSON());
    } catch (error) {
      logger.error('Error fetching paste:', error);
      res.status(500).json({ 
        error: 'Failed to fetch paste',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }

  static async healthCheck(req, res) {
    try {
      await db.query('SELECT 1');
      
      res.json({
        ok: true,
        service: 'Pastebin-Lite API',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
      });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({ 
        ok: false, 
        error: 'Service unavailable',
        details: 'Database connection failed',
      });
    }
  }

  static async getMetrics(req, res) {
    try {
      const result = await db.query(`
        SELECT 
          COUNT(*) as total_pastes,
          COUNT(*) FILTER (WHERE is_active = true) as active_pastes,
          COALESCE(SUM(view_count), 0) as total_views
        FROM pastes
      `);
      
      res.json(result.rows[0]);
    } catch (error) {
      logger.error('Failed to get metrics:', error);
      res.status(500).json({ error: 'Failed to retrieve metrics' });
    }
  }
}