import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function createAdmin() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        crypto_payout_address TEXT,
        two_factor_enabled BOOLEAN DEFAULT false,
        is_admin BOOLEAN DEFAULT false,
        is_blocked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const email = "admin@stratenergy.com";
    const password = "Admin123!";
    const name = "Admin User";

    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      console.log("Admin user already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await client.query(
      "INSERT INTO users (email, password_hash, name, is_admin) VALUES ($1, $2, $3, $4)",
      [email, passwordHash, name, true]
    );

    console.log("Admin user created successfully:");
    console.log("Email:", email);
    console.log("Password:", password);
  } finally {
    client.release();
    await pool.end();
  }
}

createAdmin().catch(console.error);
