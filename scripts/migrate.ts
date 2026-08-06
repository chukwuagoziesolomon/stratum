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

    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS referral_code TEXT
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_idx ON users(referral_code)
    `);

    const usersWithoutReferral = await client.query("SELECT id FROM users WHERE referral_code IS NULL OR referral_code = ''");
    for (const row of usersWithoutReferral.rows) {
      let referralCode = `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      let attempts = 0;
      while (attempts < 10) {
        const existing = await client.query("SELECT id FROM users WHERE referral_code = $1", [referralCode]);
        if (existing.rows.length === 0) break;
        referralCode = `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        attempts += 1;
      }
      await client.query("UPDATE users SET referral_code = $1 WHERE id = $2", [referralCode, row.id]);
    }

    console.log("Migration complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
