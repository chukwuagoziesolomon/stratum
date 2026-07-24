import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

const transactions = [
  { label: "Distribution — Midstream Access Fund", date: "Jul 1, 2026", type: "Distribution", amount: "+$412.60" },
  { label: "Deposit via bank transfer", date: "Jun 18, 2026", type: "Deposit", amount: "+$5,000.00" },
  { label: "Distribution — Bedrock Income Fund", date: "Apr 1, 2026", type: "Distribution", amount: "+$198.10" },
  { label: "Allocation — Upstream Development Fund", date: "Mar 22, 2026", type: "Allocation", amount: "-$4,000.00" },
  { label: "Withdrawal to linked bank", date: "Feb 4, 2026", type: "Withdrawal", amount: "-$1,200.00" },
  { label: "Deposit via wire", date: "Jan 15, 2026", type: "Deposit", amount: "+$10,000.00" },
];

export default function Transactions() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Transactions</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
        Move money in and out.
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button className="flex items-center justify-center gap-2 rounded-md border border-brass/50 bg-brass/10 py-4 font-display text-sm font-medium text-brass hover:bg-brass/15">
          <ArrowDownToLine size={16} /> Add funds
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md border border-petrol-line py-4 font-display text-sm font-medium text-ink-high hover:border-brass/50">
          <ArrowUpFromLine size={16} /> Withdraw
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-md border border-petrol-line bg-petrol-panel">
        <table className="w-full text-left">
          <thead>
            <tr className="font-mono text-xs uppercase tracking-wider text-ink-soft">
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm">
            {transactions.map((t, i) => (
              <tr key={i} className="border-t border-petrol-line/60">
                <td className="px-6 py-4 text-ink-high">{t.label}</td>
                <td className="px-6 py-4 text-ink-muted">{t.type}</td>
                <td className="px-6 py-4 font-mono text-xs text-ink-soft">{t.date}</td>
                <td className={`px-6 py-4 font-mono ${t.amount.startsWith("-") ? "text-ink-muted" : "text-emerald-400"}`}>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
