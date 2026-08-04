import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  const t = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'transactions' ORDER BY ordinal_position");
  console.log("transactions:", JSON.stringify(t.rows, null, 2));
  const h = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'holdings' ORDER BY ordinal_position");
  console.log("holdings:", JSON.stringify(h.rows, null, 2));
  await pool.end();
}

check().catch(console.error);
