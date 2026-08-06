const dotenv = require("dotenv");
const path = require("path");
const { Pool } = require("pg");

const envPath = path.resolve(__dirname, "../.env.local");
dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Please check .env.local.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function randomReferralCode() {
  return `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function generateUniqueReferralCode(client) {
  let code = randomReferralCode();
  let tries = 0;
  while (tries < 10) {
    const { rowCount } = await client.query("SELECT 1 FROM users WHERE referral_code = $1", [code]);
    if (rowCount === 0) {
      return code;
    }
    code = randomReferralCode();
    tries += 1;
  }
  return `${code}-${Date.now().toString().slice(-4)}`;
}

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Running migration against:", process.env.DATABASE_URL);

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

    const result = await client.query("SELECT id FROM users WHERE referral_code IS NULL OR referral_code = ''");
    for (const row of result.rows) {
      const newCode = await generateUniqueReferralCode(client);
      await client.query("UPDATE users SET referral_code = $1 WHERE id = $2", [newCode, row.id]);
      console.log(`Assigned referral code ${newCode} to user ${row.id}`);
    }

    console.log("Migration complete.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
