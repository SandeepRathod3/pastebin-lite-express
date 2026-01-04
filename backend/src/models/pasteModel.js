import { nanoid } from 'nanoid';
import { db } from '../db/connection.js';
import { logger } from '../utils/logger.js';

export class Paste {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.createdAt = data.created_at;
    this.expiresAt = data.expires_at;
    this.maxViews = data.max_views;
    this.viewCount = data.view_count;
    this.isActive = data.is_active;
  }

  static async create({ content, ttlSeconds = null, maxViews = null }) {
    const id = nanoid(8);
    const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null;
    
    try {
      await db.query(
        `INSERT INTO pastes (id, content, expires_at, max_views) 
         VALUES ($1, $2, $3, $4)`,
        [id, content, expiresAt, maxViews],
        { log: false }
      );
      
      logger.info('Paste created', { id });
      return new Paste({ id, content, expires_at: expiresAt, max_views: maxViews });
    } catch (error) {
      logger.error('Failed to create paste', { error: error.message });
      throw error;
    }
  }

  static async findById(id, testNowMs = null) {
    try {
      const now = testNowMs ? new Date(testNowMs) : new Date();
      const result = await db.query(
        `SELECT * FROM pastes WHERE id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) return null;
      
      const paste = new Paste(result.rows[0]);
      
      // Check if paste is available
      if (!paste.isAvailable(now)) {
        await paste.deactivate();
        return null;
      }
      
      return paste;
    } catch (error) {
      logger.error('Failed to find paste', { id, error: error.message });
      throw error;
    }
  }

  isAvailable(now = new Date()) {
    if (!this.isActive) return false;
    if (this.expiresAt && this.expiresAt < now) return false;
    if (this.maxViews && this.viewCount >= this.maxViews) return false;
    return true;
  }

  async incrementViewCount() {
    try {
      await db.query(
        'UPDATE pastes SET view_count = view_count + 1 WHERE id = $1',
        [this.id],
        { log: false }
      );
      this.viewCount += 1;
    } catch (error) {
      logger.error('Failed to increment view count', { id: this.id, error: error.message });
      throw error;
    }
  }

  async deactivate() {
    try {
      await db.query(
        'UPDATE pastes SET is_active = false WHERE id = $1',
        [this.id],
        { log: false }
      );
      this.isActive = false;
    } catch (error) {
      logger.error('Failed to deactivate paste', { id: this.id, error: error.message });
    }
  }

  toJSON() {
    const remainingViews = this.maxViews 
      ? Math.max(0, this.maxViews - this.viewCount - 1)
      : null;
    
    return {
      id: this.id,
      content: this.content,
      remaining_views: remainingViews,
      expires_at: this.expiresAt?.toISOString() || null,
      view_count: this.viewCount,
    };
  }
}