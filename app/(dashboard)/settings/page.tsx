"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  Bell,
  Landmark,
  AlertTriangle,
  Check,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payout", label: "Payout accounts", icon: Landmark },
  { id: "danger", label: "Danger zone", icon: AlertTriangle },
];

function Toggle({ defaultOn = false, onToggle, on }: { defaultOn?: boolean; onToggle?: (value: boolean) => void; on?: boolean }) {
  const [internalOn, setInternalOn] = useState(defaultOn);

  useEffect(() => {
    if (typeof on === "boolean") {
      setInternalOn(on);
    }
  }, [on]);

  function handleToggle() {
    setInternalOn((current) => {
      const next = !current;
      onToggle?.(next);
      return next;
    });
  }

  return (
    <button
      onClick={handleToggle}
      className={`relative h-6 w-11 rounded-full transition-colors ${internalOn ? "bg-brass" : "bg-petrol-line"}`}
      aria-pressed={internalOn}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 h-4 w-4 rounded-full bg-ink-high"
        style={{ left: internalOn ? "calc(100% - 20px)" : "4px" }}
      />
    </button>
  );
}

function Field({ label, value, type = "text", onChange }: { label: string; value: string; type?: string; onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="font-display text-xs uppercase tracking-wider text-ink-muted">{label}</label>
      <input
        type={type}
        value={onChange ? value : undefined}
        defaultValue={onChange ? undefined : value}
        onChange={onChange}
        className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol px-4 py-3 font-body text-sm text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
      />
    </div>
  );
}

export default function Settings() {
    const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; crypto_payout_address?: string; two_factor_enabled?: boolean } | null>(null);
  const [payoutAddress, setPayoutAddress] = useState("");
  const [depositWalletAddress, setDepositWalletAddress] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setPayoutAddress(data.user.crypto_payout_address || "");
          setTwoFactorEnabled(Boolean(data.user.two_factor_enabled));
        }
      })
      .catch(() => {});

    fetch("/api/crypto/deposit-wallet")
      .then(r => r.json())
      .then(data => setDepositWalletAddress(data.depositWalletAddress || null))
      .catch(() => setDepositWalletAddress(null));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);

    if (tab === "security") {
      try {
        const res = await fetch("/api/auth/security", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ twoFactorEnabled }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Unable to update security settings.");
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
      } catch (error: any) {
        setSaveError(error.message);
      }
      return;
    }

    if (tab === "payout") {
      try {
        const res = await fetch("/api/auth/payout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cryptoPayoutAddress: payoutAddress }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Unable to save payout wallet address.");
        }

        setUser((prev) => (prev ? { ...prev, crypto_payout_address: payoutAddress } : prev));
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
      } catch (error: any) {
        setSaveError(error.message);
      }
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Settings</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
        Manage your account.
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[14rem_1fr]">
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-sm px-3 py-2.5 text-left font-display text-sm transition-colors ${
                tab === t.id ? "bg-brass/15 text-brass" : "text-ink-muted hover:bg-petrol-panel hover:text-ink-high"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-md border border-petrol-line bg-petrol-panel p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "profile" && (
                <form onSubmit={handleSave} className="space-y-5">
                  <h2 className="font-display text-lg font-semibold text-ink-high">Profile</h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full name" value={user?.name || ""} />
                    <Field label="Email" value={user?.email || ""} type="email" />
                    <Field label="Phone" value="+61 400 555 123" />
                    <Field label="Country" value="Australia" />
                  </div>
                  <SaveButton saved={saved} />
                </form>
              )}

              {tab === "security" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h2 className="font-display text-lg font-semibold text-ink-high">Security</h2>

                  <div className="flex items-center justify-between rounded-md border border-petrol-line p-4">
                    <div>
                      <p className="font-display text-sm font-medium text-ink-high">Two-factor authentication</p>
                      <p className="mt-1 font-body text-sm text-ink-muted">Require a code from your phone when logging in.</p>
                    </div>
                      <Toggle on={twoFactorEnabled} onToggle={setTwoFactorEnabled} />
                  </div>

                  <div>
                    <p className="font-display text-sm font-medium text-ink-high">Active sessions</p>
                    <div className="mt-3 space-y-3">
                      {[
                        { device: "Chrome on macOS — Perth, AU", current: true },
                        { device: "AeroneX iOS App — Perth, AU", current: false },
                      ].map((s) => (
                        <div key={s.device} className="flex items-center justify-between rounded-sm border border-petrol-line/60 px-4 py-3">
                          <div>
                            <p className="font-body text-sm text-ink-high">{s.device}</p>
                            {s.current && <p className="font-mono text-xs text-flare">This device</p>}
                          </div>
                          {!s.current && (
                            <button type="button" className="font-display text-xs text-red-400 hover:text-red-300">
                              Sign out
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <SaveButton saved={saved} />
                </form>
              )}

              {tab === "notifications" && (
                <form onSubmit={handleSave} className="space-y-5">
                  <h2 className="font-display text-lg font-semibold text-ink-high">Notifications</h2>
                  {[
                    { label: "Distribution received", body: "Email me when a fund pays a distribution.", on: true },
                    { label: "Statement ready", body: "Email me when a new statement is available.", on: true },
                    { label: "Fund performance updates", body: "Monthly summary of fund NAV changes.", on: false },
                    { label: "Product announcements", body: "New funds, feature updates, and events.", on: false },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between rounded-md border border-petrol-line p-4">
                      <div>
                        <p className="font-display text-sm font-medium text-ink-high">{n.label}</p>
                        <p className="mt-1 font-body text-sm text-ink-muted">{n.body}</p>
                      </div>
                      <Toggle defaultOn={n.on} />
                    </div>
                  ))}
                  <SaveButton saved={saved} />
                </form>
              )}

              {tab === "payout" && (
                <form onSubmit={handleSave} className="space-y-5">
                  <h2 className="font-display text-lg font-semibold text-ink-high">Payout accounts</h2>
                  <div className="space-y-4">
                    <div className="rounded-md border border-petrol-line p-4">
                      <p className="font-display text-sm font-medium text-ink-high">Deposit wallet address</p>
                      <p className="mt-2 font-mono text-sm text-ink-soft">
                        Send all crypto deposits to the platform wallet configured by the administrator.
                      </p>
                      <div className="mt-3 rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 font-mono text-sm text-ink-high">
                        {depositWalletAddress || "Not configured yet"}
                      </div>
                    </div>

                    <Field
                      label="Your crypto payout wallet address"
                      value={payoutAddress}
                      onChange={(e) => setPayoutAddress(e.target.value)}
                    />
                    <p className="text-sm text-ink-soft">
                      This wallet will receive your profit withdrawals and distributions.
                    </p>
                    {saveError && <p className="text-sm text-red-400">{saveError}</p>}
                    <SaveButton saved={saved} label="Save payout wallet" />
                  </div>
                </form>
              )}

              {tab === "danger" && (
                <div className="space-y-5">
                  <h2 className="font-display text-lg font-semibold text-ink-high">Danger zone</h2>
                  <div className="rounded-md border border-red-400/30 bg-red-400/5 p-5">
                    <p className="font-display text-sm font-medium text-ink-high">Close account</p>
                    <p className="mt-1 font-body text-sm text-ink-muted">
                      You must withdraw all fund balances before closing your account. This cannot be undone.
                    </p>
                    <button className="mt-4 rounded-sm border border-red-400/50 px-4 py-2 font-display text-sm text-red-400 hover:bg-red-400/10">
                      Request account closure
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SaveButton({ saved, label = "Save changes" }: { saved: boolean; label?: string }) {
  return (
    <button
      type="submit"
      className="flex items-center gap-2 rounded-sm bg-brass px-5 py-2.5 font-display text-sm font-medium text-petrol transition-colors hover:bg-brass-light"
    >
      {saved && <Check size={15} />}
      {saved ? "Saved" : label}
    </button>
  );
}
