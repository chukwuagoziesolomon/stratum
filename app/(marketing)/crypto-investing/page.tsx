import Reveal from "@/components/Reveal";
import Link from "next/link";
import { cryptoAssets, cryptoRisks } from "@/lib/data";
import { AlertTriangle, Lock, Layers3, ArrowRight, Bitcoin } from "lucide-react";

export default function CryptoInvesting() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">A separate offering</p>
        <h1 className="mt-3 font-display text-4xl font-semibold uppercase text-ink-high md:text-5xl">
          Crypto investing, kept apart from our oil &amp; gas funds.
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-ink-muted">
          Some Stratum clients want digital-asset exposure alongside their energy holdings. We offer
          it — but as its own distinct, optional fund with its own risk profile, minimum, and
          disclosures. It is not blended into any oil &amp; gas fund's NAV or returns.
        </p>
      </Reveal>

      {/* Upfront risk banner */}
      <Reveal delay={0.1} className="mt-10 flex gap-4 rounded-md border border-red-400/30 bg-red-400/5 p-6">
        <AlertTriangle size={22} className="mt-0.5 shrink-0 text-red-400" />
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-red-400">
            Read this before anything else on this page
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">
            Cryptocurrency is highly volatile and speculative. Prices can move sharply in either
            direction within days or hours. This fund is not appropriate for money you cannot afford
            to lose, and it carries meaningfully more risk than our energy funds.
          </p>
        </div>
      </Reveal>

      {/* What's in the fund */}
      <div className="mt-16">
        <Reveal className="flex items-center gap-2">
          <Layers3 size={16} className="text-brass" />
          <h2 className="font-display text-2xl font-semibold text-ink-high">What's in the Digital Asset Fund</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cryptoAssets.map((a, i) => (
            <Reveal key={a.symbol} delay={i * 0.08} className="rounded-md border border-petrol-line bg-petrol-panel p-7">
              <div className="flex items-center gap-2">
                <Bitcoin size={16} className="text-brass" />
                <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">{a.symbol}</p>
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink-high">{a.name}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{a.role}</p>
              <p className="mt-4 border-t border-petrol-line/60 pt-4 font-mono text-xs text-brass">
                Target allocation: {a.allocationRange}
              </p>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 font-body text-xs text-ink-soft">
          Target allocations are guidelines, not guarantees, and are rebalanced periodically at the
          manager's discretion.
        </p>
      </div>

      {/* Custody & security */}
      <Reveal delay={0.1} className="mt-16 rounded-md border border-petrol-line bg-petrol-panel p-8">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-brass" />
          <h2 className="font-display text-xl font-semibold text-ink-high">Custody &amp; security</h2>
        </div>
        <ul className="mt-4 space-y-2 font-body text-sm leading-relaxed text-ink-muted">
          <li>• The large majority of assets are held in offline, multi-signature cold storage with a regulated custodian.</li>
          <li>• A small operating balance is kept in hot wallets solely to process redemptions.</li>
          <li>• Independent proof-of-reserves attestations are published quarterly alongside the fund statement.</li>
        </ul>
      </Reveal>

      {/* Fund terms */}
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { label: "Minimum investment", value: "$2,500" },
          { label: "Redemption window", value: "Weekly, with 5-day notice" },
          { label: "Historical range (trailing 3yr)", value: "-42% to +91% annualized" },
        ].map((t) => (
          <Reveal key={t.label} className="rounded-md border border-petrol-line bg-petrol-panel p-6 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">{t.label}</p>
            <p className="mt-2 font-display text-lg font-semibold text-ink-high">{t.value}</p>
          </Reveal>
        ))}
      </div>

      {/* Risk list */}
      <div className="mt-16">
        <Reveal className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <h2 className="font-display text-2xl font-semibold text-ink-high">Full risk disclosure</h2>
        </Reveal>
        <ul className="mt-6 space-y-3">
          {cryptoRisks.map((r, i) => (
            <Reveal key={i} delay={i * 0.05} className="flex gap-3 rounded-sm border border-petrol-line/60 bg-petrol-panel/60 p-4">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
              <p className="font-body text-sm leading-relaxed text-ink-muted">{r}</p>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <Reveal className="mt-16 flex flex-col items-center rounded-md border border-brass/30 bg-brass/5 px-6 py-14 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink-high">
          Want the Digital Asset Fund alongside an energy fund?
        </h2>
        <p className="mt-2 max-w-lg font-body text-sm text-ink-muted">
          You can add it as a separate allocation from your dashboard after opening a standard
          account — it requires its own risk acknowledgment first.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="rounded-sm border border-ink-muted/30 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-high hover:border-brass/60">
            Ask an advisor first
          </Link>
          <Link href="/signup" className="flex items-center justify-center gap-2 rounded-sm bg-brass px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-petrol hover:bg-brass-light">
            Open an account <ArrowRight size={15} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
