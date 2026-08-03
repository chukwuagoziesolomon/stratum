"use client";

import { useState } from "react";

export default function WithdrawalActions({ id }: { id: number }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);
    await fetch(`/api/admin/withdrawals/${id}/approve`, { method: "POST" });
    setLoading(false);
    window.location.reload();
  }

  async function decline() {
    if (!reason.trim()) {
      alert("Please provide a reason for declining.");
      return;
    }
    setLoading(true);
    await fetch(`/api/admin/withdrawals/${id}/decline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={approve}
        disabled={loading}
        className="rounded-sm bg-emerald-500 px-3 py-1.5 font-display text-xs font-medium text-white hover:bg-emerald-400 disabled:opacity-50"
      >
        {loading ? "..." : "Approve"}
      </button>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Decline reason"
        className="w-36 rounded-sm border border-petrol-line bg-petrol px-2 py-1.5 font-body text-xs text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
      />
      <button
        onClick={decline}
        disabled={loading}
        className="rounded-sm border border-red-400/50 px-3 py-1.5 font-display text-xs text-red-400 hover:bg-red-400/10 disabled:opacity-50"
      >
        {loading ? "..." : "Decline"}
      </button>
    </div>
  );
}
