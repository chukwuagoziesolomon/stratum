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
    name: "Bedrock Income Fund",
    code: "BRK",
    minInvestment: "$1,000",
    maxInvestment: "$25,000",
    horizon: "12–24 months",
    historicalRange: "4.1%–6.8% annualized (trailing 3yr)",
    strata: 1,
    riskLabel: "Conservative",
    description:
      "Royalty interests in producing wells with long operating histories. Priority is capital preservation and steady distributions.",
  },
  {
    name: "Midstream Access Fund",
    code: "MSA",
    minInvestment: "$5,000",
    maxInvestment: "$100,000",
    horizon: "2–4 years",
    historicalRange: "6.5%–11.2% annualized (trailing 3yr)",
    strata: 2,
    riskLabel: "Balanced",
    description:
      "Pipeline, storage, and processing infrastructure positions. Cash flows tied to throughput contracts rather than commodity price swings.",
  },
  {
    name: "Upstream Development Fund",
    code: "UDF",
    minInvestment: "$10,000",
    maxInvestment: "$250,000",
    horizon: "3–5 years",
    historicalRange: "9.0%–18.4% annualized (trailing 3yr)",
    strata: 3,
    riskLabel: "Growth",
    description:
      "Participation in operated drilling and completion programs across vetted basins. Returns track production results and commodity pricing.",
  },
  {
    name: "Frontier Exploration Fund",
    code: "FEF",
    minInvestment: "$25,000",
    maxInvestment: "$1,000,000",
    horizon: "5–7 years",
    historicalRange: "-8.0%–29.6% annualized (trailing 3yr, high variance)",
    strata: 5,
    riskLabel: "Aggressive",
    description:
      "Early-stage exploration and modular refinery ventures. Higher potential upside carries real risk of loss, including partial loss of principal.",
  },
];

export type Project = {
  title: string;
  category: string;
  location: string;
  status: "Producing" | "In Development" | "Under Evaluation";
  summary: string;
};

export const projects: Project[] = [
  {
    title: "Delta Ridge Well Cluster",
    category: "Upstream",
    location: "Permian Basin, TX",
    status: "Producing",
    summary: "12-well pad with three years of continuous production history and public well-log data.",
  },
  {
    title: "Harborline Storage Terminal",
    category: "Midstream",
    location: "Gulf Coast, LA",
    status: "In Development",
    summary: "Expansion of an existing storage facility under a long-term throughput agreement.",
  },
  {
    title: "Northfield Modular Refinery",
    category: "Downstream",
    location: "Alberta, CA",
    status: "Under Evaluation",
    summary: "Feasibility and permitting stage modular refinery, pending environmental review.",
  },
  {
    title: "Cape Verdant Pipeline Tie-In",
    category: "Midstream",
    location: "Coastal Nigeria",
    status: "In Development",
    summary: "Connector pipeline linking two producing fields to regional export infrastructure.",
  },
];

export const testimonials = [
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

export const faqs = [
  {
    q: "What does Stratum Energy Partners actually do?",
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
    q: "Who can I talk to if I have questions?",
    a: "Our AI support assistant is available 24/7 from the chat icon in the corner of every page, and can escalate to a licensed human advisor for account-specific or regulated advice.",
  },
];
