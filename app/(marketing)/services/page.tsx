import Reveal from "@/components/Reveal";
import CoreSample from "@/components/CoreSample";
import { programs } from "@/lib/data";
import { FileText, Headphones, BarChart3, Landmark } from "lucide-react";

const extras = [
  { icon: FileText, title: "Fund documents & K-1 prep", body: "Offering memoranda, quarterly reports, and tax document support delivered from your dashboard." },
  { icon: BarChart3, title: "Independent performance audits", body: "Annual third-party audits of NAV calculations for every active fund." },
  { icon: Landmark, title: "Custody & compliance", body: "Assets held with a regulated custodian; AML/KYC checks on every account." },
  { icon: Headphones, title: "24/7 AI + human support", body: "Instant answers from our AI assistant, with escalation to a licensed advisor for anything account-specific." },
];

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">Services</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-high">
          Four funds, one standard of disclosure.
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-ink-muted">
          Choose by risk band and horizon, not by promised percentages. Every fund's historical range
          reflects real trailing performance — including losses.
        </p>
      </Reveal>

      <div className="mt-16">
        <CoreSample programs={programs} />
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Beyond the funds</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-high">What comes with every account.</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {extras.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.08}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/50 text-brass">
                <e.icon size={18} />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-ink-high">{e.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{e.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
