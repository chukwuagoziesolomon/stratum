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

    const opportunities = [
      {
        title: "Delta Ridge Well Cluster",
        description: "12-well pad in the Permian Basin with 3 years of continuous production history. Public well-log data available. Expected to generate steady royalty distributions.",
        category: "Upstream",
        location: "Permian Basin, Texas",
        minimum_investment: "$5,000",
        expected_return: "8-12% annually",
        duration: "18-24 months",
        risk_level: "Low",
      },
      {
        title: "Harborline Storage Terminal",
        description: "Expansion of an existing storage facility under long-term throughput agreement. Midstream infrastructure with contracted cash flow.",
        category: "Midstream",
        location: "Gulf Coast, Louisiana",
        minimum_investment: "$10,000",
        expected_return: "6-9% annually",
        duration: "24-36 months",
        risk_level: "Low",
      },
      {
        title: "Northfield Modular Refinery",
        description: "Early-stage modular refinery venture pending environmental review. Higher potential upside with active management involvement.",
        category: "Downstream",
        location: "Alberta, Canada",
        minimum_investment: "$25,000",
        expected_return: "15-25% annually",
        duration: "36-48 months",
        risk_level: "High",
      },
      {
        title: "Cape Verdant Pipeline Tie-In",
        description: "Connector pipeline linking two producing fields to regional export infrastructure. Strategic midstream position with established offtake agreements.",
        category: "Midstream",
        location: "Coastal Nigeria",
        minimum_investment: "$15,000",
        expected_return: "10-14% annually",
        duration: "24-36 months",
        risk_level: "Medium",
      },
    ];

    for (const opp of opportunities) {
      await client.query(
        `INSERT INTO opportunities (title, description, category, location, minimum_investment, expected_return, duration, risk_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
        [opp.title, opp.description, opp.category, opp.location, opp.minimum_investment, opp.expected_return, opp.duration, opp.risk_level]
      );
    }

    console.log("Opportunities table created and seeded.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
