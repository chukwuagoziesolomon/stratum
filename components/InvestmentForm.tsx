"use client";

import { useState } from "react";

export default function InvestmentForm({ id, current, target }: { id: number; current: number; target: number }) {
  const [percentage, setPercentage] = useState(current);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ investmentId: id, percentage: Number(percentage) }),
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        value={percentage}
        onChange={(e) => setPercentage(Number(e.target.value))}
        min={current}
        max={target}
        className="w-20 rounded-sm border border-petrol-line bg-petrol px-2 py-1 font-mono text-xs text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-sm bg-brass px-3 py-1 font-display text-xs font-medium text-petrol hover:bg-brass-light disabled:opacity-50"
      >
        {loading ? "..." : "Update"}
      </button>
    </form>
  );
}
