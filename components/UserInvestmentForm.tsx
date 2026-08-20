"use client";

import { useState } from "react";

export default function InvestmentForm({ opportunityId, minimumInvestment }: { opportunityId: number; minimumInvestment: string }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const numericAmount = Number(amount.replace(/[^0-9.-]/g, ""));
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId, amount: numericAmount.toString() }),
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      const data = await res.json();
      setError(data.error || "Investment failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Amount (USD)</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Minimum ${minimumInvestment}`}
          className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol px-4 py-3 font-body text-sm text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
        />
        <p className="mt-1 font-mono text-xs text-ink-soft">Minimum investment: {minimumInvestment}</p>
      </div>
      {error && <p className="font-body text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-sm bg-brass px-5 py-2.5 font-display text-sm font-medium text-petrol transition-colors hover:bg-brass-light disabled:opacity-50"
      >
        {loading ? "Processing..." : "Invest now"}
      </button>
    </form>
  );
}
