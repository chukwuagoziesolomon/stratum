"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthLayout from "@/components/AuthLayout";
import { Loader2, Check } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
    } catch {
      setEmail("");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) {
      setError("No email found. Please return to signup.");
      return;
    }
    if (!code) {
      setError("Enter the verification code sent to your email.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the code sent to your inbox to complete signup.">
      <div className="space-y-6">
        <p className="font-body text-sm text-ink-muted">
          We emailed a verification code to <span className="font-semibold text-ink-high">{email || "your email"}</span>.
          If you didn't receive it, check spam or go back to signup to try again.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Verification code</label>
            <input
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="text"
              className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass"
              placeholder="123456"
            />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-sm text-red-400">
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-sm text-emerald-400">
              Email verified. Redirecting to dashboard...
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-brass py-3 font-display text-sm font-medium text-petrol transition-colors hover:bg-brass-light disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {loading ? "Verifying…" : "Verify email"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
