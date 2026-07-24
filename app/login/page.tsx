"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Login() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError("");
    setLoading(true);
    // Demo only: no backend is wired up yet. Replace with a real auth call.
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to view your funds, statements, and distributions.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Email</label>
          <input
            name="email"
            type="email"
            className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Password</label>
            <Link href="/login" className="font-body text-xs text-brass hover:text-brass-light">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-2">
            <input
              name="password"
              type={showPw ? "text" : "password"}
              className="w-full rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 pr-11 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink-high"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-ink-muted">
          <input type="checkbox" className="h-4 w-4 rounded-sm border-petrol-line bg-petrol-panel accent-brass" />
          Keep me signed in on this device
        </label>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-sm text-red-400">
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-brass py-3 font-display text-sm font-medium text-petrol transition-colors hover:bg-brass-light disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-8 text-center font-body text-sm text-ink-muted">
        Don't have an account?{" "}
        <Link href="/signup" className="text-brass hover:text-brass-light">
          Open one
        </Link>
      </p>
    </AuthLayout>
  );
}
