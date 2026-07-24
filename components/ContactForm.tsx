"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-md border border-flare/30 bg-flare/5 p-12 text-center"
      >
        <CheckCircle2 size={36} className="text-flare" />
        <p className="mt-4 font-display text-lg font-semibold text-ink-high">Message sent</p>
        <p className="mt-1 font-body text-sm text-ink-muted">
          An advisor will reply within one business day.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Full name</label>
        <input required type="text" className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass" placeholder="Jordan Blake" />
      </div>
      <div>
        <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Email</label>
        <input required type="email" className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass" placeholder="jordan@email.com" />
      </div>
      <div>
        <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Message</label>
        <textarea required rows={5} className="mt-2 w-full resize-none rounded-sm border border-petrol-line bg-petrol-panel px-4 py-3 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass" placeholder="What would you like to know?" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-brass py-3 font-display text-sm font-medium text-petrol transition-colors hover:bg-brass-light disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
