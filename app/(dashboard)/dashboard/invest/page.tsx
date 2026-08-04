import pool from "@/lib/db";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Invest() {
  const result = await pool.query("SELECT id, title, description, category, location, minimum_investment, expected_return, duration, risk_level FROM opportunities WHERE is_active = true ORDER BY id ASC");
  const opportunities = result.rows;

  const riskColors: Record<string, string> = {
    Low: "text-emerald-400",
    Medium: "text-brass",
    High: "text-red-400",
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Investment opportunities</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
        Choose an investment well
      </h1>
      <p className="mt-2 font-body text-sm text-ink-muted">
        Select an opportunity that matches your balance and risk preference. Each well has its own minimum, expected return, and duration.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opp: { id: number; title: string; description: string; category: string; location: string; minimum_investment: string; expected_return: string; duration: string; risk_level: string }) => (
          <div key={opp.id} className="rounded-md border border-petrol-line bg-petrol-panel p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">{opp.category}</span>
              <span className={`font-mono text-xs ${riskColors[opp.risk_level] || "text-ink-muted"}`}>{opp.risk_level} risk</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink-high">{opp.title}</h3>
            <p className="mt-2 font-body text-sm text-ink-muted flex-1">{opp.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs text-ink-soft">
              <div>
                <p className="text-ink-muted">Min investment</p>
                <p className="mt-1 text-ink-high">{opp.minimum_investment}</p>
              </div>
              <div>
                <p className="text-ink-muted">Expected return</p>
                <p className="mt-1 text-ink-high">{opp.expected_return}</p>
              </div>
              <div>
                <p className="text-ink-muted">Duration</p>
                <p className="mt-1 text-ink-high">{opp.duration}</p>
              </div>
              <div>
                <p className="text-ink-muted">Location</p>
                <p className="mt-1 text-ink-high">{opp.location}</p>
              </div>
            </div>
            <Link
              href={`/dashboard/invest/${opp.id}`}
              className="mt-5 flex items-center justify-between rounded-sm border border-petrol-line px-4 py-3 font-display text-sm text-ink-high hover:border-brass/60"
            >
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-brass" />
                Invest now
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
