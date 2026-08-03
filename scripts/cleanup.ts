import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function cleanup() {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM withdrawals");
    await client.query("DELETE FROM investments");
    await client.query("DELETE FROM transactions");
    await client.query("DELETE FROM documents");
    await client.query("DELETE FROM stats");
    await client.query("DELETE FROM holdings");
    await client.query("DELETE FROM nav_history");
    await client.query("DELETE FROM faqs");
    await client.query("DELETE FROM crypto_risks");
    await client.query("DELETE FROM crypto_assets");
    await client.query("DELETE FROM glossary");
    await client.query("DELETE FROM sector_risks");
    await client.query("DELETE FROM ways_to_invest");
    await client.query("DELETE FROM sector_layers");
    await client.query("DELETE FROM testimonials");
    await client.query("DELETE FROM projects");
    await client.query("DELETE FROM programs");
    await client.query("DELETE FROM users");
    
    console.log("All data cleared.");
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup().catch(console.error);
