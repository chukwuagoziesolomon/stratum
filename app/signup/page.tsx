"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const colors = ["#6E6459", "#D99A3D", "#D99A3D", "#EDB35C", "#FF6B35"];

export default function Signup() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState("");
  const [agree, setAgree] = useState(false);
  const [riskAck, setRiskAck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const s = strength(pw);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");

    if (!name || !email || !pw) {
      setError("Fill in all fields to continue.");
      return;
    }
    if (!agree || !riskAck) {
      setError("Please accept the terms and the risk disclosure to open an account.");
      return;
    }
    setError("");
    setLoading(true);
    // Demo only: no backend is wired up yet. Replace with a real signup call.
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  }

  return (
    <AuthLayout title="Open your account" subtitle="Takes about three minutes. Funding is optional until you're ready.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Full name</label>
          <input
            name="name"
            type="text"
            className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass"
            placeholder="Jordan Blake"
          />
        </div>

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
          <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Password</label>
          <div className="relative mt-2">
            <input
              name="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              type={showPw ? "text" : "password"}
              className="w-full rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 pr-11 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass"
              placeholder="Create a password"
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
          {pw.length > 0 && (
            <div className="mt-2">
              <div className="flex h-1 gap-1 overflow-hidden rounded-full">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-full flex-1 rounded-full"
                    initial={{ backgroundColor: "#2E2620" }}
                    animate={{ backgroundColor: i < s ? colors[s] : "#2E2620" }}
                  />
                ))}
              </div>
              <p className="mt-1.5 font-mono text-[11px]" style={{ color: colors[s] }}>{labels[s]}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-2.5 font-body text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-petrol-line bg-petrol-panel accent-brass"
            />
            <span>
              I agree to the{" "}
              <Link href="/faq" className="text-brass hover:text-brass-light">Terms of Service</Link> and{" "}
              <Link href="/faq" className="text-brass hover:text-brass-light">Privacy Policy</Link>.
            </span>
          </label>
          <label className="flex items-start gap-2.5 font-body text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={riskAck}
              onChange={(e) => setRiskAck(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-petrol-line bg-petrol-panel accent-brass"
            />
            <span>
              I understand energy investments carry real risk, including possible loss of principal,
              and that returns are variable — not guaranteed.
            </span>
          </label>
        </div>

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
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center font-body text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brass hover:text-brass-light">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
