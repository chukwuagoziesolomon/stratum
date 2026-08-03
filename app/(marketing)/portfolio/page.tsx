import Reveal from "@/components/Reveal";
import type { Project } from "@/lib/data";
import { projects } from "@/lib/data";

export default function Portfolio() {
  const projectsLocal: Project[] = projects;
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">Portfolio</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-high">
          What's currently in the ground.
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-ink-muted">
          A representative sample of underlying projects across our active funds. Individual investor
          allocations vary by fund and vintage.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projectsLocal.map((p: { title: string; category: string; location: string; status: string; summary: string }, i: number) => (
          <Reveal key={p.title} delay={i * 0.08} className="rounded-md border border-petrol-line bg-petrol-panel p-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
              {p.category} · {p.location}
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink-high">{p.title}</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{p.summary}</p>
            <span
              className={`mt-5 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
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
  );
}
