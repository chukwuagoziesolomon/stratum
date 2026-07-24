import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Reveal from "@/components/Reveal";
import CoreSample from "@/components/CoreSample";
import Link from "next/link";
import { programs, projects, testimonials } from "@/lib/data";
import { ShieldCheck, Gauge, Flame, Factory, Fuel, ArrowRight } from "lucide-react";

const stats = [
  { value: "$340M+", label: "Capital deployed to date" },
  { value: "48", label: "Vetted projects funded" },
  { value: "11 yrs", label: "Operating track record" },
  { value: "24/7", label: "AI + human support" },
];

const steps = [
  { icon: Gauge, title: "Review real project data", body: "Every fund links to well logs, permits, or throughput contracts — not marketing copy." },
  { icon: Fuel, title: "Fund your account", body: "Link a bank account or wire funds. Minimums start at $1,000." },
  { icon: Flame, title: "Track performance honestly", body: "Your dashboard shows NAV, distributions, and drawdowns — including the down periods." },
  { icon: ShieldCheck, title: "Withdraw on schedule", body: "Redemptions follow each fund's published lock-up and notice period, no surprises." },
];

const services = [
  { icon: Flame, title: "Upstream Exploration & Drilling", body: "Vetted access to operated drilling programs, with production data published quarterly." },
  { icon: Factory, title: "Midstream Infrastructure", body: "Pipeline, storage, and terminal positions with contracted, throughput-based cash flow." },
  { icon: Gauge, title: "Modular Refinery Projects", body: "Early-stage refinery ventures assessed for permitting risk, offtake agreements, and unit economics." },
  { icon: ShieldCheck, title: "Portfolio Reporting & Tax Docs", body: "Consolidated statements, K-1 preparation support, and full transaction history export." },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <div className="pipe-seam" />

      {/* Stats */}
      <section className="border-b border-petrol-line bg-petrol-panel">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-3xl font-semibold text-brass md:text-4xl">{s.value}</p>
              <p className="mt-2 font-body text-sm text-ink-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-brass">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-high md:text-4xl">
            Four steps. No hidden mechanics.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/50 text-brass">
                <s.icon size={18} />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-ink-high">{s.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Programs / Core Sample signature visual */}
      <section className="border-y border-petrol-line bg-petrol-panel/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-brass">Investment funds</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-high md:text-4xl">
              Depth of risk, shown honestly.
            </h2>
            <p className="mt-4 font-body text-ink-muted">
              Each fund's core sample reflects its duration and risk band — deeper strata, longer
              horizon, wider possible outcomes. Historical ranges are trailing performance, not
              forecasts.
            </p>
          </Reveal>

          <div className="mt-16">
            <CoreSample programs={programs} />
          </div>
        </div>
      </section>

      {/* Learn before you invest */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-flare">Before you invest</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-high md:text-4xl">
            Two things worth reading first.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal className="group rounded-md border border-petrol-line bg-petrol-panel p-8 transition-colors hover:border-flare/50">
            <p className="font-mono text-[11px] uppercase tracking-wider text-flare">Investor education</p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink-high">
              How oil &amp; gas investing actually works
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
              Where returns come from, the different ways to get exposure, sector-specific risks, and
              a glossary of the terms you'll see in your fund documents.
            </p>
            <Link href="/oil-gas-investing" className="mt-5 flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wide text-flare">
              Read the guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="group rounded-md border border-petrol-line bg-petrol-panel p-8 transition-colors hover:border-brass/50">
            <p className="font-mono text-[11px] uppercase tracking-wider text-brass">A separate offering</p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink-high">
              Crypto investing, kept apart from our energy funds
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
              BTC, ETH, and a small tokenized-royalty pilot sleeve — its own fund, own minimum, own
              risk disclosure, never blended into an energy fund's NAV.
            </p>
            <Link href="/crypto-investing" className="mt-5 flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wide text-brass">
              See the details <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Services</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-high md:text-4xl">
            Where your capital actually goes.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-petrol-line bg-petrol-line md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className="bg-petrol p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-flare/40 bg-flare/10 text-flare">
                <s.icon size={18} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink-high">{s.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="border-t border-petrol-line bg-petrol-panel/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-widest text-brass">Current projects</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink-high md:text-4xl">
                A sample of what's in the ground right now.
              </h2>
            </div>
            <Link href="/portfolio" className="flex items-center gap-1.5 font-display text-sm text-brass hover:text-brass-light">
              View full portfolio <ArrowRight size={14} />
            </Link>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.07} className="rounded-md border border-petrol-line bg-petrol p-6">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">{p.category} · {p.location}</p>
                <h3 className="mt-3 font-display text-base font-semibold text-ink-high">{p.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{p.summary}</p>
                <span
                  className={`mt-4 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
                    p.status === "Producing"
                      ? "bg-flare/15 text-flare"
                      : p.status === "In Development"
                      ? "bg-brass/15 text-brass"
                      : "bg-ink-soft/15 text-ink-muted"
                  }`}
                >
                  {p.status}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Investor voices</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-high md:text-4xl">
            What people say once the reports start arriving.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="rounded-md border border-petrol-line bg-petrol-panel p-7">
              <p className="font-body text-sm italic leading-relaxed text-ink-high">"{t.quote}"</p>
              <p className="mt-5 font-display text-sm font-medium text-ink-high">{t.name}</p>
              <p className="font-body text-xs text-ink-muted">{t.role}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-petrol-line">
        <div className="contour-bg absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-ink-high md:text-4xl">
              Start with one fund. See the data yourself.
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-ink-muted">
              Open an account in a few minutes. No obligation until you choose to fund it.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-brass px-7 py-3 font-display text-sm font-medium text-petrol transition-colors hover:bg-brass-light"
            >
              Open an account <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
