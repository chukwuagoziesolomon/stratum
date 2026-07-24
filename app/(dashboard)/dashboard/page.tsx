import { ArrowUpRight, ArrowDownRight, Wallet, Percent, CalendarClock, PiggyBank } from "lucide-react";
import Link from "next/link";
import NavChart from "@/components/NavChart";

const stats = [
  { label: "Total balance", value: "$48,210.32", change: "+2.4%", up: true, icon: Wallet },
  { label: "YTD return", value: "8.7%", change: "vs 6.1% last year", up: true, icon: Percent },
  { label: "Total distributions", value: "$3,940.18", change: "since inception", up: true, icon: PiggyBank },
  { label: "Next distribution", value: "Sep 30", change: "Bedrock & Midstream funds", up: null, icon: CalendarClock },
];

const holdings = [
  { name: "Bedrock Income Fund", code: "BRK", value: "$14,020.00", weight: "29%", ytd: "+5.1%" },
  { name: "Midstream Access Fund", code: "MSA", value: "$18,640.00", weight: "39%", ytd: "+9.8%" },
  { name: "Upstream Development Fund", code: "UDF", value: "$12,300.00", weight: "25%", ytd: "+14.2%" },
  { name: "Frontier Exploration Fund", code: "FEF", value: "$3,250.32", weight: "7%", ytd: "-3.6%" },
];

const activity = [
  { label: "Distribution received — Midstream Access Fund", date: "Jul 1, 2026", amount: "+$412.60" },
  { label: "Deposit via bank transfer", date: "Jun 18, 2026", amount: "+$5,000.00" },
  { label: "Distribution received — Bedrock Income Fund", date: "Apr 1, 2026", amount: "+$198.10" },
  { label: "Allocation — Upstream Development Fund", date: "Mar 22, 2026", amount: "-$4,000.00" },
];

export default function DashboardOverview() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Overview</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
            Welcome back, Jordan.
          </h1>
        </div>
        <Link
          href="/dashboard/transactions"
          className="rounded-sm border border-petrol-line px-4 py-2 font-display text-sm text-ink-high hover:border-brass/60"
        >
          Add funds
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-petrol-line bg-petrol-panel p-5">
            <div className="flex items-center justify-between">
              <p className="font-body text-sm text-ink-muted">{s.label}</p>
              <s.icon size={16} className="text-brass" />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold text-ink-high">{s.value}</p>
            <p className={`mt-1 flex items-center gap-1 font-mono text-xs ${s.up === true ? "text-emerald-400" : s.up === false ? "text-red-400" : "text-ink-muted"}`}>
              {s.up === true && <ArrowUpRight size={12} />}
              {s.up === false && <ArrowDownRight size={12} />}
              {s.change}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-md border border-petrol-line bg-petrol-panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink-high">Portfolio value over time</h2>
            <span className="font-mono text-xs text-ink-soft">Illustrative, last 12 months</span>
          </div>
          <div className="mt-4 h-72">
            <NavChart />
          </div>
        </div>

        <div className="rounded-md border border-petrol-line bg-petrol-panel p-6">
          <h2 className="font-display text-base font-semibold text-ink-high">Recent activity</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((a) => (
              <li key={a.label} className="flex items-start justify-between gap-3 border-b border-petrol-line/60 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-body text-sm text-ink-high">{a.label}</p>
                  <p className="font-mono text-xs text-ink-soft">{a.date}</p>
                </div>
                <span className={`shrink-0 font-mono text-sm ${a.amount.startsWith("+") ? "text-emerald-400" : "text-ink-muted"}`}>
                  {a.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-md border border-petrol-line bg-petrol-panel">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="font-display text-base font-semibold text-ink-high">Holdings</h2>
          <Link href="/dashboard/holdings" className="font-display text-sm text-brass hover:text-brass-light">
            View all
          </Link>
        </div>
        <table className="mt-4 w-full text-left">
          <thead>
            <tr className="border-t border-petrol-line font-mono text-xs uppercase tracking-wider text-ink-soft">
              <th className="px-6 py-3 font-medium">Fund</th>
              <th className="px-6 py-3 font-medium">Value</th>
              <th className="px-6 py-3 font-medium">Weight</th>
              <th className="px-6 py-3 font-medium">YTD</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm">
            {holdings.map((h) => (
              <tr key={h.code} className="border-t border-petrol-line/60">
                <td className="px-6 py-4">
                  <p className="text-ink-high">{h.name}</p>
                  <p className="font-mono text-xs text-ink-soft">{h.code}</p>
                </td>
                <td className="px-6 py-4 font-mono text-ink-high">{h.value}</td>
                <td className="px-6 py-4 font-mono text-ink-muted">{h.weight}</td>
                <td className={`px-6 py-4 font-mono ${h.ytd.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>{h.ytd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 font-body text-xs text-ink-soft">
        Figures shown are for demonstration purposes on this preview account. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
