"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Fuel } from "lucide-react";
import RigIllustration from "./RigIllustration";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-petrol-line">
      <div className="absolute inset-0">
        <RigIllustration />
      </div>
      <div className="grain-overlay absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/55 to-petrol/10" />

      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-40 text-center md:pb-28 md:pt-52">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-flare/40 bg-flare/10 px-4 py-1.5"
        >
          <Fuel size={14} className="text-flare" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-flare">
            Oil &amp; Gas Investment Firm
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance mt-7 font-display text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-ink-high md:text-7xl"
        >
          Capital in the field.
          <br />
          <span className="text-brass">Not just on a screen.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-ink-muted"
        >
          Stratum Energy Partners gives investors direct, transparent access to real upstream
          drilling, midstream pipelines, and downstream refining projects — with published well
          data, variable returns, and no promises we can't keep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-sm bg-flare px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-petrol shadow-[0_0_30px_-8px_rgba(255,107,53,0.7)] transition-colors hover:bg-flare-light"
          >
            Open an account
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/portfolio"
            className="rounded-sm border border-ink-muted/30 px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-ink-high transition-colors hover:border-brass/60"
          >
            See current wells &amp; projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
