import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE transactions
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS wallet_coin TEXT,
      ADD COLUMN IF NOT EXISTS wallet_network TEXT
    `);

    await client.query(`
      ALTER TABLE holdings
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)
    `);

    await client.query(`
      ALTER TABLE investments
      ADD COLUMN IF NOT EXISTS wallet_coin TEXT,
      ADD COLUMN IF NOT EXISTS wallet_network TEXT
    `);

    console.log("Migration complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
