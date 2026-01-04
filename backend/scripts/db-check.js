require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Please add it to backend/.env');
  process.exit(2);
}

(async () => {
  const pool = new Pool({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });
  try {
    const res = await pool.query('SELECT 1 as ok');
    console.log('Connection successful:', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message || err);
    process.exit(3);
  } finally {
    await pool.end();
  }
})();
