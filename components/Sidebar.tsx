"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Wallet,
  Receipt,
  FileText,
  Settings,
  LogOut,
  Droplet,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/holdings", label: "Holdings", icon: Wallet },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 px-6 py-6 font-display text-base font-semibold text-ink-high">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass/60 text-brass">
          <Droplet size={16} strokeWidth={2.5} />
        </span>
        Stratum
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 font-display text-sm transition-colors ${
                active
                  ? "bg-brass/15 text-brass"
                  : "text-ink-muted hover:bg-petrol-panel hover:text-ink-high"
              }`}
            >
              <l.icon size={17} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-petrol-line px-3 py-4">
        <div className="flex items-center gap-3 rounded-sm px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brass/20 font-display text-xs font-semibold text-brass">
            JB
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-display text-sm text-ink-high">Jordan Blake</p>
            <p className="truncate font-body text-xs text-ink-muted">jordan@email.com</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-2 flex items-center gap-3 rounded-sm px-3 py-2.5 font-display text-sm text-ink-muted hover:bg-petrol-panel hover:text-ink-high"
        >
          <LogOut size={17} /> Log out
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-petrol-line bg-petrol px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-display text-sm font-semibold text-ink-high">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brass/60 text-brass">
            <Droplet size={14} strokeWidth={2.5} />
          </span>
          Stratum
        </Link>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="text-ink-high">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-petrol-line bg-petrol md:hidden"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-petrol-line bg-petrol md:block">
        {content}
      </aside>
    </>
  );
}
