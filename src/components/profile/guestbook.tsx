"use client";

import { useState } from "react";
import type { GuestbookEntry } from "@/types/database";

export function Guestbook({
  profileId,
  initialEntries,
  textColor,
  cardBg,
  cardTextColor,
  accentColor,
  btnRadius,
}: {
  profileId: string;
  initialEntries: GuestbookEntry[];
  textColor: string;
  cardBg: string;
  cardTextColor: string;
  accentColor: string;
  btnRadius: string;
}) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function isRateLimited() {
    if (typeof window === "undefined") return false;
    const key = `volt_guestbook_${profileId}`;
    const last = localStorage.getItem(key);
    if (!last) return false;
    return Date.now() - parseInt(last, 10) < 5 * 60 * 1000;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;
    if (isRateLimited()) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profileId,
          authorName: authorName.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        const { entry } = await res.json();
        setEntries((prev) => [entry, ...prev]);
        setAuthorName("");
        setMessage("");
        if (typeof window !== "undefined") {
          localStorage.setItem(`volt_guestbook_${profileId}`, Date.now().toString());
        }
      }
    } catch {
      // Silent fail
    }

    setSubmitting(false);
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-center uppercase tracking-wider" style={{ color: textColor, opacity: 0.6 }}>
        Guestbook
      </h3>

      {/* Post form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl p-4 space-y-3"
        style={{ backgroundColor: cardBg, borderRadius: btnRadius }}
      >
        <input
          type="text"
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={50}
          required
          className="w-full px-3 py-2 rounded-lg text-sm bg-black/20 border border-white/10 outline-none placeholder:opacity-50"
          style={{ color: cardTextColor }}
        />
        <textarea
          placeholder="Leave a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={280}
          required
          rows={2}
          className="w-full px-3 py-2 rounded-lg text-sm bg-black/20 border border-white/10 outline-none placeholder:opacity-50 resize-none"
          style={{ color: cardTextColor }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs opacity-50" style={{ color: cardTextColor }}>
            {message.length}/280
          </span>
          <button
            type="submit"
            disabled={submitting || isRateLimited()}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: accentColor, color: "#ffffff" }}
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {/* Entries */}
      {entries.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg p-3 space-y-1"
              style={{ backgroundColor: `${cardBg}`, borderRadius: btnRadius }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: cardTextColor }}>
                  {entry.author_name}
                </span>
                <span className="text-xs opacity-50" style={{ color: cardTextColor }}>
                  {timeAgo(entry.created_at)}
                </span>
              </div>
              <p className="text-sm opacity-80" style={{ color: cardTextColor }}>
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
