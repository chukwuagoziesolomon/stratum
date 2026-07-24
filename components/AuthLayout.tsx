import Link from "next/link";
import { Droplet, ShieldCheck, Fuel } from "lucide-react";
import { ReactNode } from "react";
import RigIllustration from "./RigIllustration";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center px-6 py-16 md:px-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold uppercase text-ink-high">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass/60 text-brass">
              <Droplet size={16} strokeWidth={2.5} />
            </span>
            Stratum
          </Link>
          <h1 className="mt-10 font-display text-2xl font-semibold text-ink-high">{title}</h1>
          <p className="mt-2 font-body text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Right: visual */}
      <div className="relative hidden overflow-hidden border-l border-petrol-line bg-petrol md:block">
        <div className="absolute inset-0">
          <RigIllustration />
        </div>
        <div className="grain-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-petrol via-transparent to-petrol/70" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-flare/40 bg-flare/10 px-4 py-1.5">
            <Fuel size={13} className="text-flare" />
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-flare">
              Oil &amp; Gas Investment Firm
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brass">
              <ShieldCheck size={14} /> 256-bit encryption · optional 2FA
            </div>
            <p className="mt-4 max-w-sm font-display text-2xl font-medium leading-snug text-ink-high">
              "The reporting is unusually detailed — I get production updates, not just a number
              going up."
            </p>
            <p className="mt-3 font-body text-sm text-ink-muted">Sophia Mensah, Private Investor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
