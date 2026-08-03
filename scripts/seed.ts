import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

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

    const programs = [
      { name: "Bedrock Income Fund", code: "BRK", minInvestment: "$1,000", maxInvestment: "$25,000", horizon: "12–24 months", historicalRange: "4.1%–6.8% annualized (trailing 3yr)", strata: 1, riskLabel: "Conservative", description: "Royalty interests in producing wells with long operating histories. Priority is capital preservation and steady distributions." },
      { name: "Midstream Access Fund", code: "MSA", minInvestment: "$5,000", maxInvestment: "$100,000", horizon: "2–4 years", historicalRange: "6.5%–11.2% annualized (trailing 3yr)", strata: 2, riskLabel: "Balanced", description: "Pipeline, storage, and processing infrastructure positions. Cash flows tied to throughput contracts rather than commodity price swings." },
      { name: "Upstream Development Fund", code: "UDF", minInvestment: "$10,000", maxInvestment: "$250,000", horizon: "3–5 years", historicalRange: "9.0%–18.4% annualized (trailing 3yr)", strata: 3, riskLabel: "Growth", description: "Participation in operated drilling and completion programs across vetted basins. Returns track production results and commodity pricing." },
      { name: "Frontier Exploration Fund", code: "FEF", minInvestment: "$25,000", maxInvestment: "$1,000,000", horizon: "5–7 years", historicalRange: "-8.0%–29.6% annualized (trailing 3yr, high variance)", strata: 5, riskLabel: "Aggressive", description: "Early-stage exploration and modular refinery ventures. Higher potential upside carries real risk of loss, including partial loss of principal." },
    ];

    for (const p of programs) {
      await client.query(
        `INSERT INTO programs (name, code, min_investment, max_investment, horizon, historical_range, strata, risk_label, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (code) DO UPDATE SET
           name = EXCLUDED.name,
           min_investment = EXCLUDED.min_investment,
           max_investment = EXCLUDED.max_investment,
           horizon = EXCLUDED.horizon,
           historical_range = EXCLUDED.historical_range,
           strata = EXCLUDED.strata,
           risk_label = EXCLUDED.risk_label,
           description = EXCLUDED.description`,
        [p.name, p.code, p.minInvestment, p.maxInvestment, p.horizon, p.historicalRange, p.strata, p.riskLabel, p.description]
      );
    }
    console.log("Programs seeded");

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

    const projects = [
      { title: "Delta Ridge Well Cluster", category: "Upstream", location: "Permian Basin, TX", status: "Producing", summary: "12-well pad with three years of continuous production history and public well-log data." },
      { title: "Harborline Storage Terminal", category: "Midstream", location: "Gulf Coast, LA", status: "In Development", summary: "Expansion of an existing storage facility under a long-term throughput agreement." },
      { title: "Northfield Modular Refinery", category: "Downstream", location: "Alberta, CA", status: "Under Evaluation", summary: "Feasibility and permitting stage modular refinery, pending environmental review." },
      { title: "Cape Verdant Pipeline Tie-In", category: "Midstream", location: "Coastal Nigeria", status: "In Development", summary: "Connector pipeline linking two producing fields to regional export infrastructure." },
    ];

    for (const p of projects) {
      await client.query(
        `INSERT INTO projects (title, category, location, status, summary) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
        [p.title, p.category, p.location, p.status, p.summary]
      );
    }
    console.log("Projects seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        quote TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);

    const testimonials = [
      { quote: "What I appreciated most was seeing the actual well data before committing capital. Nothing about the process felt like a sales pitch.", name: "Daniel Roberts", role: "Energy Analyst, WestBridge Capital" },
      { quote: "The reporting is unusually detailed. I get production updates, not just a number going up on a dashboard.", name: "Sophia Mensah", role: "Private Investor" },
      { quote: "Realistic expectations were set from day one — including the downside scenarios. That's rare in this sector.", name: "Hassan Abdullahi", role: "Petroleum Engineer" },
    ];

    for (const t of testimonials) {
      await client.query(`INSERT INTO testimonials (quote, name, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [t.quote, t.name, t.role]);
    }
    console.log("Testimonials seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS sector_layers (
        id SERIAL PRIMARY KEY,
        tier TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        risk TEXT NOT NULL
      )
    `);

    const sectorLayers = [
      { tier: "Upstream", title: "Exploration & Production", body: "Locating and drilling wells, then producing the oil or gas itself. Returns come from royalty or working interests in actual production, so cash flow moves with output volume and commodity price.", risk: "Highest sector-specific risk: dry holes, decline curves, and commodity price swings all hit here directly." },
      { tier: "Midstream", title: "Transport, Storage & Processing", body: "Pipelines, storage terminals, and processing plants that move product from the wellhead to market. Revenue is usually contracted on throughput volume rather than commodity price.", risk: "Lower price sensitivity, but exposed to counterparty and permitting/regulatory risk." },
      { tier: "Downstream", title: "Refining & Distribution", body: "Turning crude into usable fuels and products, then getting them to end customers. Margins depend on the spread between crude input cost and refined product prices ('crack spread').", risk: "Margin compression risk when crude prices rise faster than product prices." },
    ];

    for (const s of sectorLayers) {
      await client.query(`INSERT INTO sector_layers (tier, title, body, risk) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, [s.tier, s.title, s.body, s.risk]);
    }
    console.log("Sector layers seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS ways_to_invest (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL
      )
    `);

    const waysToInvest = [
      { title: "Royalty interests", body: "You own a percentage of the revenue a well produces, with no obligation to cover operating or drilling costs. Lower risk, lower ceiling on returns." },
      { title: "Working interests", body: "You share in both revenue and costs (drilling, operating, plugging). Higher potential return, but you can also be called on for additional capital." },
      { title: "Pooled fund vehicles", body: "Capital from many investors is combined into a single fund (like Stratum's) that holds a diversified basket of royalty or working interests, run by a manager. Lower minimums, professional diligence, less single-well concentration risk." },
    ];

    for (const w of waysToInvest) {
      await client.query(`INSERT INTO ways_to_invest (title, body) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [w.title, w.body]);
    }
    console.log("Ways to invest seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS sector_risks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL
      )
    `);

    const sectorRisks = [
      { title: "Commodity price volatility", body: "Oil and gas prices are set globally and can swing sharply on supply, geopolitics, or demand shocks — directly affecting upstream returns." },
      { title: "Geological & production risk", body: "Wells decline in output over time (decline curves), and exploration wells can simply come up dry." },
      { title: "Regulatory & environmental risk", body: "Permitting delays, changing environmental regulation, and local opposition can delay or halt a project." },
      { title: "Operator risk", body: "Returns depend heavily on the operating company actually running the well or facility competently and solvently." },
      { title: "Liquidity risk", body: "Most energy fund vehicles have lock-up periods; you generally cannot withdraw on demand the way you could from a savings account." },
    ];

    for (const r of sectorRisks) {
      await client.query(`INSERT INTO sector_risks (title, body) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [r.title, r.body]);
    }
    console.log("Sector risks seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS glossary (
        id SERIAL PRIMARY KEY,
        term TEXT NOT NULL,
        def TEXT NOT NULL
      )
    `);

    const glossary = [
      { term: "WTI / Brent", def: "The two most-quoted crude oil price benchmarks (US and international)." },
      { term: "Henry Hub", def: "The benchmark pricing point for US natural gas." },
      { term: "Working interest", def: "Ownership share that includes both revenue and cost/liability obligations." },
      { term: "Royalty interest", def: "Ownership share of revenue only, with no cost obligations." },
      { term: "Decline curve", def: "The expected drop-off in a well's production rate over its lifetime." },
      { term: "NAV", def: "Net Asset Value — the current per-unit value of a fund's holdings." },
      { term: "K-1", def: "The US tax form reporting your share of a partnership's income for royalty/working interest and fund investments." },
      { term: "Throughput contract", def: "A midstream agreement paying based on volume moved, not commodity price." },
    ];

    for (const g of glossary) {
      await client.query(`INSERT INTO glossary (term, def) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [g.term, g.def]);
    }
    console.log("Glossary seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS crypto_assets (
        id SERIAL PRIMARY KEY,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        allocation_range TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);

    const cryptoAssets = [
      { symbol: "BTC", name: "Bitcoin", allocationRange: "40%–60% of fund", role: "Core macro / store-of-value allocation." },
      { symbol: "ETH", name: "Ethereum", allocationRange: "25%–40% of fund", role: "Smart-contract and settlement-layer exposure." },
      { symbol: "TERT", name: "Tokenized Energy Royalty Pilots", allocationRange: "0%–20% of fund", role: "Experimental, small allocations to blockchain-issued fractional royalty tokens tied to real wells." },
    ];

    for (const c of cryptoAssets) {
      await client.query(`INSERT INTO crypto_assets (symbol, name, allocation_range, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, [c.symbol, c.name, c.allocationRange, c.role]);
    }
    console.log("Crypto assets seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS crypto_risks (
        id SERIAL PRIMARY KEY,
        risk TEXT NOT NULL
      )
    `);

    const cryptoRisks = [
      "Extremely high price volatility — larger and faster than equities or energy commodities.",
      "Regulatory treatment of digital assets is still evolving in most jurisdictions and can change.",
      "Custody and security depend on exchange/custodian solvency and operational security.",
      "The tokenized-royalty pilot sleeve is an early-stage, small, and illiquid allocation — treat it as venture-stage, not core.",
      "This fund can lose a substantial part of its value, including in short periods, and is not appropriate for money you cannot afford to lose.",
    ];

    for (const r of cryptoRisks) {
      await client.query(`INSERT INTO crypto_risks (risk) VALUES ($1) ON CONFLICT DO NOTHING`, [r]);
    }
    console.log("Crypto risks seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        q TEXT NOT NULL,
        a TEXT NOT NULL
      )
    `);

    const faqs = [
      { q: "What does Stratum Energy Partners actually do?", a: "We source, vet, and structure investment access to oil & gas and energy infrastructure projects — from producing royalty interests to midstream infrastructure and early-stage exploration. We are not a bank and do not guarantee returns." },
      { q: "Are returns guaranteed?", a: "No. Returns vary by fund and are tied to real project performance, commodity prices, and operating results. Historical ranges shown are past performance, which does not guarantee future results, and every fund carries the risk of loss." },
      { q: "What is the minimum investment?", a: "Minimums vary by fund, starting at $1,000 for the Bedrock Income Fund. Each fund's offering documents detail eligibility requirements." },
      { q: "How do withdrawals and distributions work?", a: "Distributions are paid on each fund's stated schedule (typically quarterly) directly to your linked bank account. Redemption terms depend on the fund's lock-up period, detailed in your account's Fund Documents." },
      { q: "Is my account secured?", a: "Yes — we support two-factor authentication, device/session management, and encrypted storage of personal and financial data. We recommend enabling 2FA from Settings > Security immediately after signup." },
      { q: "Is the crypto fund the same as the oil & gas funds?", a: "No — it's a separate, optional offering with its own risk profile, minimum, and redemption terms. See the Crypto Investing page for full details before opting in." },
      { q: "Who can I talk to if I have questions?", a: "Our AI support assistant is available 24/7 from the chat icon in the corner of every page, and can escalate to a licensed human advisor for account-specific or regulated advice." },
    ];

    for (const f of faqs) {
      await client.query(`INSERT INTO faqs (q, a) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [f.q, f.a]);
    }
    console.log("FAQs seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS holdings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        value TEXT NOT NULL,
        weight TEXT NOT NULL,
        ytd TEXT NOT NULL,
        units TEXT NOT NULL
      )
    `);

    const holdings = [
      { name: "Bedrock Income Fund", code: "BRK", value: "$14,020.00", weight: "29%", ytd: "+5.1%", units: "134.02" },
      { name: "Midstream Access Fund", code: "MSA", value: "$18,640.00", weight: "39%", ytd: "+9.8%", units: "165.31" },
      { name: "Upstream Development Fund", code: "UDF", value: "$12,300.00", weight: "25%", ytd: "+14.2%", units: "93.87" },
      { name: "Frontier Exploration Fund", code: "FEF", value: "$3,250.32", weight: "7%", ytd: "-3.6%", units: "28.15" },
    ];

    for (const h of holdings) {
      await client.query(`INSERT INTO holdings (name, code, value, weight, ytd, units) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`, [h.name, h.code, h.value, h.weight, h.ytd, h.units]);
    }
    console.log("Holdings seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        label TEXT NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        amount TEXT NOT NULL
      )
    `);

    const transactions = [
      { label: "Distribution — Midstream Access Fund", date: "Jul 1, 2026", type: "Distribution", amount: "+$412.60" },
      { label: "Deposit via bank transfer", date: "Jun 18, 2026", type: "Deposit", amount: "+$5,000.00" },
      { label: "Distribution — Bedrock Income Fund", date: "Apr 1, 2026", type: "Distribution", amount: "+$198.10" },
      { label: "Allocation — Upstream Development Fund", date: "Mar 22, 2026", type: "Allocation", amount: "-$4,000.00" },
      { label: "Withdrawal to linked bank", date: "Feb 4, 2026", type: "Withdrawal", amount: "-$1,200.00" },
      { label: "Deposit via wire", date: "Jan 15, 2026", type: "Deposit", amount: "+$10,000.00" },
    ];

    for (const t of transactions) {
      await client.query(`INSERT INTO transactions (label, date, type, amount) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, [t.label, t.date, t.type, t.amount]);
    }
    console.log("Transactions seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `);

    const documents = [
      { name: "Q2 2026 Portfolio Statement", type: "Statement", date: "Jul 5, 2026" },
      { name: "Bedrock Income Fund — Offering Memorandum", type: "Fund Document", date: "Updated Jan 2026" },
      { name: "2025 Schedule K-1", type: "Tax Document", date: "Mar 12, 2026" },
      { name: "Q1 2026 Portfolio Statement", type: "Statement", date: "Apr 4, 2026" },
      { name: "Midstream Access Fund — Annual Report", type: "Fund Document", date: "Feb 2026" },
    ];

    for (const d of documents) {
      await client.query(`INSERT INTO documents (name, type, date) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [d.name, d.type, d.date]);
    }
    console.log("Documents seeded");

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

    const stats = [
      { label: "Total balance", value: "$48,210.32", change: "+2.4%", up: "true", icon: "Wallet" },
      { label: "YTD return", value: "8.7%", change: "vs 6.1% last year", up: "true", icon: "Percent" },
      { label: "Total distributions", value: "$3,940.18", change: "since inception", up: "true", icon: "PiggyBank" },
      { label: "Next distribution", value: "Sep 30", change: "Bedrock & Midstream funds", up: "null", icon: "CalendarClock" },
    ];

    for (const s of stats) {
      await client.query(`INSERT INTO stats (label, value, change, up, icon) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, [s.label, s.value, s.change, s.up, s.icon]);
    }
    console.log("Stats seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS nav_history (
        id SERIAL PRIMARY KEY,
        month TEXT NOT NULL,
        value INTEGER NOT NULL
      )
    `);

    const navHistory = [
      { month: "Aug", value: 41200 },
      { month: "Sep", value: 42050 },
      { month: "Oct", value: 41800 },
      { month: "Nov", value: 43500 },
      { month: "Dec", value: 44100 },
      { month: "Jan", value: 43700 },
      { month: "Feb", value: 45200 },
      { month: "Mar", value: 46300 },
      { month: "Apr", value: 45900 },
      { month: "May", value: 47100 },
      { month: "Jun", value: 47800 },
      { month: "Jul", value: 48210 },
    ];

    for (const n of navHistory) {
      await client.query(`INSERT INTO nav_history (month, value) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [n.month, n.value]);
    }
    console.log("Nav history seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        crypto_payout_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created");

    console.log("All data seeded successfully");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
