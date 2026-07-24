import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-brass">FAQ</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-high">
          Questions worth asking before you invest.
        </h1>
      </Reveal>
      <div className="mt-14">
        <FaqAccordion />
      </div>
    </div>
  );
}
