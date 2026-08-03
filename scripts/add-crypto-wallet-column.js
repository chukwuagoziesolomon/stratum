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
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS crypto_payout_address TEXT");
    console.log('Added crypto_payout_address column to users table if it did not exist.');
  } catch (error) {
    console.error('Error updating users table:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
