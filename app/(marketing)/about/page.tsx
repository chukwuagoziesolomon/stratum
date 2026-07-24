import Reveal from "@/components/Reveal";
import { ShieldCheck, Users, Building2, Target } from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Transparency over persuasion", body: "We publish downside scenarios alongside upside ones. If a fund is having a rough quarter, your statement says so." },
  { icon: Target, title: "Real assets, not promises", body: "Every fund traces back to a specific well, pipeline segment, or facility — not a pooled black box." },
  { icon: Users, title: "Advisors, not closers", body: "Our team is compensated on client retention and satisfaction, not on how much capital they bring in this month." },
  { icon: Building2, title: "Regulated where it matters", body: "Offerings are structured to comply with applicable securities regulations in each investor's jurisdiction." },
];

const timeline = [
  { year: "2014", event: "Founded in Perth by a group of petroleum engineers and finance professionals frustrated with opaque energy investment vehicles." },
  { year: "2017", event: "Launched the Bedrock Income Fund, our first royalty-backed vehicle, after three years of due-diligence tooling." },
  { year: "2020", event: "Expanded into midstream infrastructure with the Midstream Access Fund, weathering the 2020 price collapse transparently." },
  { year: "2023", event: "Crossed $300M in cumulative capital deployed across four active funds and 40+ underlying projects." },
];

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">About us</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-high">
          Built by engineers who got tired of glossy brochures.
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-ink-muted">
          Stratum Energy Partners exists because too much of the energy investment world is sold on
          feeling, not data. We built the firm we wished existed when we were evaluating our own first
          well interests.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.08} className="rounded-md border border-petrol-line bg-petrol-panel p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/50 text-brass">
              <v.icon size={18} />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-ink-high">{v.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{v.body}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Timeline</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-high">A decade, honestly told.</h2>
        </Reveal>

        <div className="mt-12 space-y-10 border-l border-petrol-line pl-8">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.08} className="relative">
              <span className="absolute -left-[2.55rem] top-1 h-3 w-3 rounded-full border-2 border-brass bg-petrol" />
              <p className="font-mono text-sm text-brass">{t.year}</p>
              <p className="mt-1 font-body text-ink-muted">{t.event}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
