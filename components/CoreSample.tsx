"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Program } from "@/lib/data";

const riskColor: Record<Program["riskLabel"], string> = {
  Conservative: "#6E93A0",
  Balanced: "#4A7C74",
  Growth: "#D99A3D",
  Aggressive: "#FF6B35",
};

export default function CoreSample({ programs }: { programs: Program[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      {programs.map((p, i) => (
        <motion.div
          key={p.code}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          {/* the core tube */}
          <div className="relative mx-auto h-56 w-16 overflow-hidden rounded-full border border-petrol-line bg-petrol-panel">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${20 + p.strata * 15}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0"
              style={{
                background: `repeating-linear-gradient(0deg, ${riskColor[p.riskLabel]}55 0px, ${riskColor[p.riskLabel]}55 6px, ${riskColor[p.riskLabel]}22 6px, ${riskColor[p.riskLabel]}22 12px)`,
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ background: riskColor[p.riskLabel] }}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">{p.code}</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-ink-high">{p.name}</h3>
            <p
              className="mt-1 font-display text-xs font-medium uppercase tracking-wider"
              style={{ color: riskColor[p.riskLabel] }}
            >
              {p.riskLabel}
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-ink-muted">{p.description}</p>

            <dl className="mt-5 space-y-1.5 text-left font-mono text-xs text-ink-muted">
              <div className="flex justify-between border-b border-petrol-line/60 py-1.5">
                <dt>Minimum</dt><dd className="text-ink-high">{p.minInvestment}</dd>
              </div>
              <div className="flex justify-between border-b border-petrol-line/60 py-1.5">
                <dt>Horizon</dt><dd className="text-ink-high">{p.horizon}</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt>Historical</dt><dd className="text-right text-ink-high">{p.historicalRange}</dd>
              </div>
            </dl>

            <Link
              href="/signup"
              className="mt-5 inline-block w-full rounded-sm border border-brass/50 py-2 text-center font-display text-sm text-brass transition-colors hover:bg-brass hover:text-petrol"
            >
              View fund details
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
