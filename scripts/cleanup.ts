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
    await client.query("DELETE FROM stats");
    await client.query("DELETE FROM holdings");
    await client.query("DELETE FROM transactions");
    await client.query("DELETE FROM documents");
    await client.query("DELETE FROM nav_history");
    
    await client.query("CREATE UNIQUE INDEX IF NOT EXISTS stats_label_unique ON stats(label)");
    await client.query("CREATE UNIQUE INDEX IF NOT EXISTS holdings_code_unique ON holdings(code)");
    await client.query("CREATE UNIQUE INDEX IF NOT EXISTS transactions_unique ON transactions(label, date, amount)");
    await client.query("CREATE UNIQUE INDEX IF NOT EXISTS documents_name_unique ON documents(name)");
    await client.query("CREATE UNIQUE INDEX IF NOT EXISTS nav_history_month_unique ON nav_history(month)");
    
    console.log("Cleanup complete. Unique constraints added.");
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup().catch(console.error);
