"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; reasoning_details?: unknown };

const STARTER: Msg = {
  role: "assistant",
  content:
    "Hi, I'm the AeroneX support assistant. Ask me about funds, minimums, distributions, or your account — and I can connect you to a human advisor any time.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([STARTER]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.reply,
          reasoning_details: data.reasoningDetails,
        } as Msg,
      ]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again shortly, or reach a human advisor from the Contact page.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        aria-label="Open support chat"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brass text-petrol shadow-lg shadow-black/30"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-lg border border-petrol-line bg-petrol-panel shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-petrol-line bg-petrol px-4 py-3">
              <div>
                <p className="font-display text-sm font-medium text-ink-high">AeroneX Support</p>
                <p className="flex items-center gap-1.5 font-body text-xs text-flare">
                  <span className="h-1.5 w-1.5 rounded-full bg-flare" /> AI assistant · online
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-md px-3 py-2 font-body text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-brass text-petrol"
                      : "bg-petrol text-ink-high"
                  }`}
                >
                      {m.content}
                  {m.reasoning_details ? (
                    <div className="mt-2 rounded-2xl bg-ink-muted/10 px-2 py-1 text-[11px] text-ink-muted">
                      {typeof m.reasoning_details === "string"
                        ? m.reasoning_details
                        : JSON.stringify(m.reasoning_details)}
                    </div>
                  ) : null}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 font-body text-xs text-ink-muted">
                  <Loader2 size={14} className="animate-spin" /> thinking…
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-petrol-line p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about a fund, your account…"
                className="flex-1 rounded-sm bg-petrol px-3 py-2 font-body text-sm text-ink-high placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-brass"
              />
              <button
                onClick={send}
                disabled={loading}
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-brass text-petrol transition-opacity disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
