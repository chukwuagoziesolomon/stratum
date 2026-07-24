"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Droplet } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/oil-gas-investing", label: "How It Works" },
  { href: "/crypto-investing", label: "Crypto" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-petrol-line/60 bg-petrol/90 backdrop-blur-md">
      <div className="border-b border-petrol-line/60 bg-flare/10 px-6 py-1 text-center">
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.25em] text-flare">
          Oil &amp; Gas Investment Firm — Upstream · Midstream · Downstream
        </span>
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold uppercase tracking-tight text-ink-high">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass/60 text-brass">
            <Droplet size={16} strokeWidth={2.5} />
          </span>
          Stratum Energy Partners
        </Link>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-sm text-ink-muted transition-colors hover:text-ink-high"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="font-display text-sm text-ink-muted transition-colors hover:text-ink-high"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-sm bg-brass px-4 py-2 font-display text-sm font-medium text-petrol transition-colors hover:bg-brass-light"
          >
            Open an account
          </Link>
        </div>

        <button
          className="text-ink-high lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-petrol-line/60 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2 font-display text-sm text-ink-muted hover:text-ink-high"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-petrol-line/60 pt-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="py-2 text-center font-display text-sm text-ink-muted hover:text-ink-high"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-sm bg-brass py-2 text-center font-display text-sm font-medium text-petrol"
                >
                  Open an account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
