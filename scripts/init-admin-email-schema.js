const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_emails (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES users(id),
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        recipients TEXT[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Admin email history table initialized.');
  } catch (error) {
    console.error('Error initializing admin email schema:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
