"use client";

import { useState } from "react";

export default function DepositActions({ id }: { id: number }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "declined">("pending");

  async function approve() {
    setLoading(true);
    const res = await fetch(`/api/admin/deposits/${id}/approve`, { method: "POST" });
    setLoading(false);

    if (res.ok) {
      setStatus("approved");
      return;
    }

    alert("Unable to approve deposit. Please try again.");
  }

  async function decline() {
    if (!reason.trim()) {
      alert("Please provide a reason for declining.");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/admin/deposits/${id}/decline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setLoading(false);

    if (res.ok) {
      setStatus("declined");
      return;
    }

    alert("Unable to decline deposit. Please try again.");
  }

  if (status === "approved") {
    return <span className="rounded-sm bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white">Approved</span>;
  }

  if (status === "declined") {
    return <span className="rounded-sm bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">Declined</span>;
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
