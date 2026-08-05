export type Program = {
  name: string;
  code: string;
  minInvestment: string;
  maxInvestment: string;
  horizon: string;
  historicalRange: string;
  strata: number; // 1-5, controls the depth of the "core sample" visual
  riskLabel: "Conservative" | "Balanced" | "Growth" | "Aggressive";
  description: string;
};

export const programs: Program[] = [
  {
    name: "Niger Delta Onshore Fund",
    code: "NDO",
    minInvestment: "$2,000",
    maxInvestment: "$50,000",
    horizon: "2–4 years",
    historicalRange: "7.2%–13.5% annualized (trailing 3yr)",
    strata: 2,
    riskLabel: "Balanced",
    description:
      "Working interests in producing onshore wells in the Niger Delta with verifiable production data and published operator reports.",
  },
  {
    name: "Safaniyah Offshore Asset Fund",
    code: "SOA",
    minInvestment: "$10,000",
    maxInvestment: "$200,000",
    horizon: "3–5 years",
    historicalRange: "9.5%–16.8% annualized (trailing 3yr)",
    strata: 3,
    riskLabel: "Growth",
    description:
      "Offshore production sharing in Saudi Aramco-operated fields with long-term offtake agreements and transparent reservoir data.",
  },
  {
    name: "Brazil Deepwater Access Fund",
    code: "BDA",
    minInvestment: "$15,000",
    maxInvestment: "$300,000",
    horizon: "4–6 years",
    historicalRange: "11.0%–19.2% annualized (trailing 3yr)",
    strata: 4,
    riskLabel: "Aggressive",
    description:
      "Deepwater subsalt participation with Petrobras-supplemental offtake agreements. Returns tied to verified reservoir performance and liftings.",
  },
  {
    name: "Australia LNG Royalty Fund",
    code: "ALR",
    minInvestment: "$5,000",
    maxInvestment: "$100,000",
    horizon: "2–4 years",
    historicalRange: "6.8%–10.4% annualized (trailing 3yr)",
    strata: 2,
    riskLabel: "Balanced",
    description:
      "LNG-linked natural gas royalty interests in established Australian basins. Long-term contracts provide price visibility and contracted volumes.",
  },
];

export type Project = {
  title: string;
  category: string;
  location: string;
  status: "Producing" | "In Development" | "Under Evaluation";
  summary: string;
};

export type SectorLayer = {
  tier: string;
  title: string;
  body: string;
  risk: string;
};

export type WaysToInvest = {
  title: string;
  body: string;
};

export type SectorRisk = {
  title: string;
  body: string;
};

export type GlossaryEntry = {
  term: string;
  def: string;
};

export const projects: Project[] = [
  {
    title: "Etam-12 Well Cluster",
    category: "Upstream",
    location: "Niger Delta, Nigeria",
    status: "Producing",
    summary: "12-well onshore pad with three years of published production data and audited operator reports.",
  },
  {
    title: "Safaniyah Tie-In Expansion",
    category: "Offshore",
    location: "Saudi Arabia",
    status: "In Development",
    summary: "Expansion of an existing Safaniyah field tie-in under a long-term throughput agreement with Saudi Aramco.",
  },
  {
    title: "Tupi Field Access Block",
    category: "Deepwater",
    location: "Brazil",
    status: "Under Evaluation",
    summary: "Subsalt participation in the Tupi field pending regulatory approval and environmental review.",
  },
  {
    title: "Ichthys Venturer Link",
    category: "LNG / Midstream",
    location: "Australia",
    status: "Producing",
    summary: "Pipeline link connecting Ichthys field processing to the Darwin LNG facility with contracted offtake.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "What I appreciated most was seeing the actual well data before committing capital. Nothing about the process felt like a sales pitch.",
    name: "Daniel Roberts",
    role: "Energy Analyst, WestBridge Capital",
  },
  {
    quote:
      "The reporting is unusually detailed. I get production updates, not just a number going up on a dashboard.",
    name: "Sophia Mensah",
    role: "Private Investor",
  },
  {
    quote:
      "Realistic expectations were set from day one — including the downside scenarios. That's rare in this sector.",
    name: "Hassan Abdullahi",
    role: "Petroleum Engineer",
  },
];

export const sectorLayers = [
  {
    tier: "Upstream",
    title: "Exploration & Production",
    body: "Locating and drilling wells, then producing the oil or gas itself. Returns come from royalty or working interests in actual production, so cash flow moves with output volume and commodity price.",
    risk: "Highest sector-specific risk: dry holes, decline curves, and commodity price swings all hit here directly.",
  },
  {
    tier: "Midstream",
    title: "Transport, Storage & Processing",
    body: "Pipelines, storage terminals, and processing plants that move product from the wellhead to market. Revenue is usually contracted on throughput volume rather than commodity price.",
    risk: "Lower price sensitivity, but exposed to counterparty and permitting/regulatory risk.",
  },
  {
    tier: "Downstream",
    title: "Refining & Distribution",
    body: "Turning crude into usable fuels and products, then getting them to end customers. Margins depend on the spread between crude input cost and refined product prices ('crack spread').",
    risk: "Margin compression risk when crude prices rise faster than product prices.",
  },
];

export const waysToInvest = [
  {
    title: "Royalty interests",
    body: "You own a percentage of the revenue a well produces, with no obligation to cover operating or drilling costs. Lower risk, lower ceiling on returns.",
  },
  {
    title: "Working interests",
    body: "You share in both revenue and costs (drilling, operating, plugging). Higher potential return, but you can also be called on for additional capital.",
  },
  {
    title: "Pooled fund vehicles",
    body: "Capital from many investors is combined into a single fund (like AeroneX's) that holds a diversified basket of royalty or working interests, run by a manager. Lower minimums, professional diligence, less single-well concentration risk.",
  },
];

export const sectorRisks = [
  { title: "Commodity price volatility", body: "Oil and gas prices are set globally and can swing sharply on supply, geopolitics, or demand shocks — directly affecting upstream returns." },
  { title: "Geological & production risk", body: "Wells decline in output over time (decline curves), and exploration wells can simply come up dry." },
  { title: "Regulatory & environmental risk", body: "Permitting delays, changing environmental regulation, and local opposition can delay or halt a project." },
  { title: "Operator risk", body: "Returns depend heavily on the operating company actually running the well or facility competently and solvently." },
  { title: "Liquidity risk", body: "Most energy fund vehicles have lock-up periods; you generally cannot withdraw on demand the way you could from a savings account." },
];

export const glossary = [
  { term: "WTI / Brent", def: "The two most-quoted crude oil price benchmarks (US and international)." },
  { term: "Henry Hub", def: "The benchmark pricing point for US natural gas." },
  { term: "Working interest", def: "Ownership share that includes both revenue and cost/liability obligations." },
  { term: "Royalty interest", def: "Ownership share of revenue only, with no cost obligations." },
  { term: "Decline curve", def: "The expected drop-off in a well's production rate over its lifetime." },
  { term: "NAV", def: "Net Asset Value — the current per-unit value of a fund's holdings." },
  { term: "K-1", def: "The US tax form reporting your share of a partnership's income for royalty/working interest and fund investments." },
  { term: "Throughput contract", def: "A midstream agreement paying based on volume moved, not commodity price." },
];

export type CryptoAsset = {
  symbol: string;
  name: string;
  allocationRange: string;
  role: string;
};

export const cryptoAssets: CryptoAsset[] = [
  { symbol: "BTC", name: "Bitcoin", allocationRange: "40%–60% of fund", role: "Core macro / store-of-value allocation." },
  { symbol: "ETH", name: "Ethereum", allocationRange: "25%–40% of fund", role: "Smart-contract and settlement-layer exposure." },
  { symbol: "TERT", name: "Tokenized Energy Royalty Pilots", allocationRange: "0%–20% of fund", role: "Experimental, small allocations to blockchain-issued fractional royalty tokens tied to real wells." },
];

export const cryptoRisks = [
  "Extremely high price volatility — larger and faster than equities or energy commodities.",
  "Regulatory treatment of digital assets is still evolving in most jurisdictions and can change.",
  "Custody and security depend on exchange/custodian solvency and operational security.",
  "The tokenized-royalty pilot sleeve is an early-stage, small, and illiquid allocation — treat it as venture-stage, not core.",
  "This fund can lose a substantial part of its value, including in short periods, and is not appropriate for money you cannot afford to lose.",
];

export const faqs = [
  {
    q: "What does AeroneX Oil & Gas actually do?",
    a: "We source, vet, and structure investment access to oil & gas and adjacent energy infrastructure projects — from producing royalty interests to midstream infrastructure and early-stage exploration. We are not a bank and do not guarantee returns.",
  },
  {
    q: "Are returns guaranteed?",
    a: "No. Returns vary by fund and are tied to real project performance, commodity prices, and operating results. Historical ranges shown are past performance, which does not guarantee future results, and every fund carries the risk of loss.",
  },
  {
    q: "What is the minimum investment?",
    a: "Minimums vary by fund, starting at $1,000 for the Bedrock Income Fund. Each fund's offering documents detail eligibility requirements.",
  },
  {
    q: "How do withdrawals and distributions work?",
    a: "Distributions are paid on each fund's stated schedule (typically quarterly) directly to your linked bank account. Redemption terms depend on the fund's lock-up period, detailed in your account's Fund Documents.",
  },
  {
    q: "Is my account secured?",
    a: "Yes — we support two-factor authentication, device/session management, and encrypted storage of personal and financial data. We recommend enabling 2FA from Settings > Security immediately after signup.",
  },
  {
    q: "Is the crypto fund the same as the oil & gas funds?",
    a: "No — it's a separate, optional offering with its own risk profile, minimum, and redemption terms. See the Crypto Investing page for full details before opting in.",
  },
  {
    q: "Who can I talk to if I have questions?",
    a: "Our AI support assistant is available 24/7 from the chat icon in the corner of every page, and can escalate to a licensed human advisor for account-specific or regulated advice.",
  },
];

