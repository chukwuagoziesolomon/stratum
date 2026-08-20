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
        title: "Niger Delta Onshore Wells",
        description: "12-well onshore pad in the Niger Delta with three years of published production data and audited operator reports. Minimums designed for direct participation.",
        category: "Upstream",
        location: "Niger Delta, Nigeria",
        minimum_investment: "$5,000",
        expected_return: "8-12% annually",
        duration: "18-24 months",
        risk_level: "Low",
      },
      {
        title: "Safaniyah Offshore Assets",
        description: "Offshore production sharing in Saudi Aramco-operated fields. Long-term offtake agreements and transparent reservoir data.",
        category: "Offshore",
        location: "Saudi Arabia",
        minimum_investment: "$10,000",
        expected_return: "9-14% annually",
        duration: "24-36 months",
        risk_level: "Medium",
      },
      {
        title: "Brazil Deepwater Access",
        description: "Deepwater subsalt participation with Petrobras-supplemental offtake agreements. Returns tied to verified reservoir performance and liftings.",
        category: "Deepwater",
        location: "Brazil",
        minimum_investment: "$15,000",
        expected_return: "12-18% annually",
        duration: "36-48 months",
        risk_level: "High",
      },
      {
        title: "Australia LNG Royalties",
        description: "LNG-linked natural gas royalty interests in established Australian basins. Long-term contracts provide price visibility and contracted volumes.",
        category: "LNG",
        location: "Australia",
        minimum_investment: "$500",
        expected_return: "7-11% annually",
        duration: "24-36 months",
        risk_level: "Low",
      },
    ];

    await client.query(`TRUNCATE TABLE opportunities RESTART IDENTITY`);

    for (const opp of opportunities) {
      await client.query(
        `INSERT INTO opportunities (title, description, category, location, minimum_investment, expected_return, duration, risk_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
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
