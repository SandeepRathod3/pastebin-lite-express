# Pastebin-Lite Backend

Node.js/Express API backend for Pastebin-Lite.

## Features
- RESTful API endpoints
- PostgreSQL database with automatic cleanup
- Rate limiting and security headers
- Test mode support for deterministic expiry

## API Endpoints
- `POST /api/pastes` - Create paste
- `GET /api/pastes/:id` - Get paste (JSON)
- `GET /api/healthz` - Health check

## Setup
1. Install dependencies: `npm install`
2. Configure `.env` file
3. Initialize database: `npm run db:init`
4. Start server: `npm run dev`