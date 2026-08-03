"use client";

import { useState } from "react";

export default function AdminClient({ user }: { user: { id: number; name: string; email: string; isBlocked: boolean } }) {
  const [blocked, setBlocked] = useState(user.isBlocked);
  const [loading, setLoading] = useState(false);

  async function toggleBlock() {
    setLoading(true);
    const action = blocked ? "unblock" : "block";
    const res = await fetch(`/api/admin/users/${user.id}/${action}`, { method: "POST" });
    if (res.ok) {
      setBlocked(!blocked);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggleBlock}
      disabled={loading}
      className={`rounded-sm px-3 py-1.5 font-display text-xs transition-colors ${
        blocked
          ? "border border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
          : "border border-red-400/50 text-red-400 hover:bg-red-400/10"
      }`}
    >
      {loading ? "..." : blocked ? "Unblock" : "Block"}
    </button>
  );
}
