const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function cleanup() {
  const client = await pool.connect();
  try {
    const tables = [
      'stats',
      'holdings',
      'transactions',
      'documents',
      'nav_history',
    ];
    for (const table of tables) {
      await client.query(`DELETE FROM ${table}`);
      const res = await client.query(`SELECT COUNT(*) AS cnt FROM ${table}`);
      console.log(`${table}: ${res.rows[0].cnt}`);
    }
    console.log('Seeded dashboard data removed successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup().catch((err) => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
