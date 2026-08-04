"use client";

import { useState } from "react";

export default function ChatAdmin({ chats }: { chats: { id: number; user_name: string; user_email: string; message: string; reply: string | null; is_from_admin: boolean; created_at: string }[] }) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReply(chatId: number) {
    if (!replyText.trim()) return;
    setLoading(true);
    await fetch(`/api/chat/messages/${chatId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText.trim() }),
    });
    setReplyText("");
    setReplyingTo(null);
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      {chats.length === 0 && (
        <p className="font-body text-sm text-ink-muted">No chat messages yet.</p>
      )}
      {chats.map((chat) => (
        <div key={chat.id} className="rounded-md border border-petrol-line bg-petrol p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-medium text-ink-high">
                {chat.user_name} <span className="font-body text-xs text-ink-soft">({chat.user_email})</span>
              </p>
              <p className="font-mono text-xs text-ink-soft">{new Date(chat.created_at).toLocaleString()}</p>
            </div>
            {!chat.is_from_admin && !chat.reply && (
              <button
                onClick={() => setReplyingTo(chat.id)}
                className="rounded-sm bg-brass px-3 py-1.5 font-display text-xs font-medium text-petrol hover:bg-brass-light"
              >
                Reply
              </button>
            )}
          </div>
          <div className="mt-3 space-y-2">
            <div className="rounded-sm bg-petrol-panel px-3 py-2">
              <p className="font-body text-sm text-ink-high">{chat.message}</p>
            </div>
            {chat.reply && (
              <div className="rounded-sm bg-brass/10 px-3 py-2">
                <p className="font-body text-sm text-ink-high">{chat.reply}</p>
                {chat.is_from_admin && (
                  <p className="mt-1 font-mono text-xs text-brass">Admin reply</p>
                )}
              </div>
            )}
          </div>
          {replyingTo === chat.id && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 rounded-sm border border-petrol-line bg-petrol px-3 py-2 font-body text-sm text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
              />
              <button
                onClick={() => handleReply(chat.id)}
                disabled={loading}
                className="rounded-sm bg-brass px-4 py-2 font-display text-xs font-medium text-petrol hover:bg-brass-light disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="rounded-sm border border-petrol-line px-3 py-2 font-display text-xs text-ink-muted hover:text-ink-high"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
