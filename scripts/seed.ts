import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const DEFAULT_ADMIN_EMAIL = "silverann83@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";
const DEFAULT_ADMIN_NAME = "Admin User";

async function seed() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        min_investment TEXT NOT NULL,
        max_investment TEXT NOT NULL,
        horizon TEXT NOT NULL,
        historical_range TEXT NOT NULL,
        strata INTEGER NOT NULL,
        risk_label TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        summary TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        quote TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sector_layers (
        id SERIAL PRIMARY KEY,
        tier TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        risk TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ways_to_invest (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sector_risks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS glossary (
        id SERIAL PRIMARY KEY,
        term TEXT NOT NULL,
        def TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS crypto_assets (
        id SERIAL PRIMARY KEY,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        allocation_range TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS crypto_risks (
        id SERIAL PRIMARY KEY,
        risk TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        q TEXT NOT NULL,
        a TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS holdings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        value TEXT NOT NULL,
        weight TEXT NOT NULL,
        ytd TEXT NOT NULL,
        units TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        label TEXT NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        amount TEXT NOT NULL,
        status TEXT DEFAULT 'approved',
        wallet_coin TEXT,
        wallet_network TEXT,
        processed_at TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        change TEXT NOT NULL,
        up TEXT NOT NULL,
        icon TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS nav_history (
        id SERIAL PRIMARY KEY,
        month TEXT NOT NULL,
        value INTEGER NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        country TEXT,
        referral_id TEXT,
        referral_code TEXT UNIQUE,
        email_verified BOOLEAN DEFAULT false,
        verification_code TEXT,
        verification_code_expires_at TIMESTAMPTZ,
        crypto_payout_address TEXT,
        two_factor_enabled BOOLEAN DEFAULT false,
        is_admin BOOLEAN DEFAULT false,
        is_blocked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS investments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        program_code TEXT NOT NULL,
        amount TEXT NOT NULL,
        current_percentage INTEGER NOT NULL DEFAULT 0,
        target_percentage INTEGER NOT NULL,
        auto_increment_interval_hours INTEGER NOT NULL DEFAULT 24,
        last_increment_at TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        amount TEXT NOT NULL,
        wallet_address TEXT NOT NULL,
        wallet_coin TEXT,
        wallet_network TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP
      )
    `);

    const existingAdmin = await client.query("SELECT id FROM users WHERE is_admin = true LIMIT 1");
    if (existingAdmin.rows.length === 0) {
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
      await client.query(
        "INSERT INTO users (email, password_hash, name, is_admin, email_verified) VALUES ($1, $2, $3, $4, $5)",
        [DEFAULT_ADMIN_EMAIL, passwordHash, DEFAULT_ADMIN_NAME, true, true]
      );
      console.log(`Default admin created: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`);
    } else {
      console.log("Admin already exists. No default admin created.");
    }

    const existingPrograms = await client.query("SELECT COUNT(*) AS count FROM programs");
    if (Number(existingPrograms.rows[0].count) === 0) {
      const programRows = [
        ["Niger Delta Onshore Fund", "NDO", "$5,000", "$50,000", "2–4 years", "7.2%–13.5% annualized (trailing 3yr)", 2, "Balanced", "Working interests in producing onshore wells in the Niger Delta with verifiable production data and published operator reports."],
        ["Safaniyah Offshore Asset Fund", "SOA", "$10,000", "$200,000", "3–5 years", "9.5%–16.8% annualized (trailing 3yr)", 3, "Growth", "Offshore production sharing in Saudi Aramco-operated fields with long-term offtake agreements and transparent reservoir data."],
        ["Brazil Deepwater Access Fund", "BDA", "$15,000", "$300,000", "4–6 years", "11.0%–19.2% annualized (trailing 3yr)", 4, "Aggressive", "Deepwater subsalt participation with Petrobras-supplemental offtake agreements. Returns tied to verified reservoir performance and liftings."],
        ["Australia LNG Royalty Fund", "ALR", "$500", "$100,000", "2–4 years", "6.8%–10.4% annualized (trailing 3yr)", 2, "Balanced", "LNG-linked natural gas royalty interests in established Australian basins. Long-term contracts provide price visibility and contracted volumes."],
      ];

      for (const row of programRows) {
        await client.query(
          `INSERT INTO programs (name, code, min_investment, max_investment, horizon, historical_range, strata, risk_label, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          row
        );
      }
      console.log("Programs seeded.");
    } else {
      console.log("Programs already exist. No programs seeded.");
    }

    const existingOpportunities = await client.query("SELECT COUNT(*) AS count FROM opportunities");
    if (Number(existingOpportunities.rows[0].count) === 0) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS opportunities (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          location TEXT NOT NULL,
          minimum_investment TEXT NOT NULL,
          expected_return TEXT NOT NULL,
          duration TEXT NOT NULL,
          risk_level TEXT NOT NULL,
          image_url TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const opportunityRows = [
        ["Niger Delta Onshore Wells", "12-well onshore pad in the Niger Delta with three years of published production data and audited operator reports. Minimums designed for direct participation.", "Upstream", "Niger Delta, Nigeria", "$5,000", "8-12% annually", "18-24 months", "Low"],
        ["Safaniyah Offshore Assets", "Offshore production sharing in Saudi Aramco-operated fields. Long-term offtake agreements and transparent reservoir data.", "Offshore", "Saudi Arabia", "$10,000", "9-14% annually", "24-36 months", "Medium"],
        ["Brazil Deepwater Access", "Deepwater subsalt participation with Petrobras-supplemental offtake agreements. Returns tied to verified reservoir performance and liftings.", "Deepwater", "Brazil", "$15,000", "12-18% annually", "36-48 months", "High"],
        ["Australia LNG Royalties", "LNG-linked natural gas royalty interests in established Australian basins. Long-term contracts provide price visibility and contracted volumes.", "LNG", "Australia", "$500", "7-11% annually", "24-36 months", "Low"],
      ];

      for (const row of opportunityRows) {
        await client.query(
          `INSERT INTO opportunities (title, description, category, location, minimum_investment, expected_return, duration, risk_level) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          row
        );
      }
      console.log("Opportunities seeded.");
    } else {
      console.log("Opportunities already exist. No opportunities seeded.");
    }

    console.log("All tables created. No mock data inserted.");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
