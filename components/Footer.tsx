import Link from "next/link";
import { Droplet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-petrol-line/60 bg-petrol">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink-high">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass/60 text-brass">
                <Droplet size={16} strokeWidth={2.5} />
              </span>
              Stratum
            </div>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-ink-muted">
              Structured access to real oil, gas, and energy infrastructure investments. Variable
              returns, transparent risk, no guarantees.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-medium uppercase tracking-wider text-ink-muted">
              Company
            </h4>
            <ul className="mt-4 space-y-3 font-body text-sm text-ink-muted">
              <li><Link href="/about" className="hover:text-ink-high">About us</Link></li>
              <li><Link href="/services" className="hover:text-ink-high">Services</Link></li>
              <li><Link href="/oil-gas-investing" className="hover:text-ink-high">How oil & gas investing works</Link></li>
              <li><Link href="/crypto-investing" className="hover:text-ink-high">Crypto investing</Link></li>
              <li><Link href="/portfolio" className="hover:text-ink-high">Portfolio</Link></li>
              <li><Link href="/contact" className="hover:text-ink-high">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-medium uppercase tracking-wider text-ink-muted">
              Account
            </h4>
            <ul className="mt-4 space-y-3 font-body text-sm text-ink-muted">
              <li><Link href="/login" className="hover:text-ink-high">Log in</Link></li>
              <li><Link href="/signup" className="hover:text-ink-high">Open an account</Link></li>
              <li><Link href="/faq" className="hover:text-ink-high">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-medium uppercase tracking-wider text-ink-muted">
              Legal
            </h4>
            <p className="mt-4 font-body text-sm leading-relaxed text-ink-muted">
              Investing involves risk, including possible loss of principal. Historical performance
              figures are illustrative and not guarantees of future results. Not FDIC insured. Not a
              deposit account.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-petrol-line/60 pt-8 font-body text-xs text-ink-soft md:flex-row">
          <span>© {new Date().getFullYear()} Stratum Energy Partners. All rights reserved.</span>
          <span>Registered office: Allendale Square, Perth, Australia</span>
        </div>
      </div>
    </footer>
  );
}
