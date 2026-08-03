import Reveal from "@/components/Reveal";
import Link from "next/link";
import type { SectorLayer, WaysToInvest, SectorRisk, GlossaryEntry } from "@/lib/data";
import { Layers, HandCoins, Users2, AlertTriangle, BookOpen, ArrowRight } from "lucide-react";
import { sectorLayers, waysToInvest, sectorRisks, glossary } from "@/lib/data";

export default function OilGasInvesting() {
  const sectorLayersLocal: SectorLayer[] = sectorLayers;
  const waysToInvestLocal: WaysToInvest[] = waysToInvest;
  const sectorRisksLocal: SectorRisk[] = sectorRisks;
  const glossaryLocal: GlossaryEntry[] = glossary;
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-flare">Investor education</p>
        <h1 className="mt-3 font-display text-4xl font-semibold uppercase text-ink-high md:text-5xl">
          How oil &amp; gas investing actually works.
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-ink-muted">
          This page exists so you have full details before you invest a dollar — where returns come
          from, the different ways to get exposure, the risks specific to this sector, and the terms
          you'll see in your fund documents.
        </p>
      </Reveal>

      {/* Sector layers */}
      <div className="mt-20">
        <Reveal className="flex items-center gap-2">
          <Layers size={16} className="text-flare" />
          <h2 className="font-display text-2xl font-semibold text-ink-high">Where returns come from</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {sectorLayersLocal.map((l: { tier: string; title: string; body: string; risk: string }, i: number) => (
            <Reveal key={l.tier} delay={i * 0.08} className="rounded-md border border-petrol-line bg-petrol-panel p-7">
              <p className="font-mono text-[11px] uppercase tracking-wider text-brass">{l.tier}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink-high">{l.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{l.body}</p>
              <p className="mt-4 border-t border-petrol-line/60 pt-4 font-body text-xs leading-relaxed text-ink-soft">
                <span className="text-flare">Risk profile:</span> {l.risk}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Ways to invest */}
      <div className="mt-20">
        <Reveal className="flex items-center gap-2">
          <HandCoins size={16} className="text-flare" />
          <h2 className="font-display text-2xl font-semibold text-ink-high">Ways to get exposure</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {waysToInvestLocal.map((w: { title: string; body: string }, i: number) => (
            <Reveal key={w.title} delay={i * 0.08} className="rounded-md border border-petrol-line bg-petrol-panel p-7">
              <h3 className="font-display text-lg font-semibold text-ink-high">{w.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{w.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-6 rounded-md border border-brass/30 bg-brass/5 p-6">
          <p className="font-body text-sm leading-relaxed text-ink-muted">
            <span className="font-display font-semibold text-brass">Where Stratum fits in: </span>
            each Stratum fund is a pooled vehicle holding a diversified mix of royalty and working
            interests across upstream, midstream, or downstream projects, so you get professional
            diligence and diversification without buying a single well interest directly.
          </p>
        </Reveal>
      </div>

      {/* Risks */}
      <div className="mt-20">
        <Reveal className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-flare" />
          <h2 className="font-display text-2xl font-semibold text-ink-high">Risks specific to this sector</h2>
        </Reveal>
        <div className="mt-8 divide-y divide-petrol-line rounded-md border border-petrol-line bg-petrol-panel">
          {sectorRisksLocal.map((r: { title: string; body: string }, i: number) => (
            <Reveal key={r.title} delay={i * 0.05} className="p-6">
              <h3 className="font-display text-sm font-semibold text-ink-high">{r.title}</h3>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-muted">{r.body}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 font-body text-xs text-ink-soft">
          This is not an exhaustive list. Full risk factors for each fund are disclosed in that
          fund's offering memorandum, available from your dashboard once you open an account.
        </p>
      </div>

      {/* Glossary */}
      <div className="mt-20">
        <Reveal className="flex items-center gap-2">
          <BookOpen size={16} className="text-flare" />
          <h2 className="font-display text-2xl font-semibold text-ink-high">Glossary</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {glossaryLocal.map((g: { term: string; def: string }, i: number) => (
            <Reveal key={g.term} delay={i * 0.04} className="border-b border-petrol-line/60 pb-4">
              <p className="font-display text-sm font-semibold text-brass">{g.term}</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-ink-muted">{g.def}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Reveal className="mt-20 flex flex-col items-center rounded-md border border-flare/30 bg-flare/5 px-6 py-14 text-center">
        <Users2 size={22} className="text-flare" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink-high">
          Still have questions before you commit capital?
        </h2>
        <p className="mt-2 max-w-lg font-body text-sm text-ink-muted">
          Talk to a licensed advisor, or explore the funds themselves with real historical ranges
          and risk bands.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="rounded-sm border border-ink-muted/30 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-high hover:border-brass/60">
            Talk to an advisor
          </Link>
          <Link href="/services" className="flex items-center justify-center gap-2 rounded-sm bg-flare px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-petrol hover:bg-flare-light">
            View the funds <ArrowRight size={15} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
