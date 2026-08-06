"use client";

import { useState } from "react";

export default function InvestmentApprovalActions({ id }: { id: number }) {
  const [status, setStatus] = useState<"pending" | "approved" | "failed">("pending");
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);
    const res = await fetch(`/api/admin/investments/${id}/approve`, { method: "POST" });
    setLoading(false);

    if (res.ok) {
      setStatus("approved");
      return;
    }

    setStatus("failed");
    const data = await res.json();
    alert(data?.error || "Unable to approve investment. Please try again.");
  }

  if (status === "approved") {
    return <span className="rounded-sm bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white">Approved</span>;
  }

  if (status === "failed") {
    return <span className="rounded-sm bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">Approval failed</span>;
  }

  return (
    <button
      onClick={approve}
      disabled={loading}
      className="rounded-sm bg-brass px-3 py-1.5 text-xs font-semibold text-petrol hover:bg-brass-light disabled:opacity-50"
    >
      {loading ? "..." : "Approve"}
    </button>
  );
}
