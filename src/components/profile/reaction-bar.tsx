"use client";

import { useState, useCallback } from "react";
import type { ProfileReaction } from "@/types/database";

const EMOJIS = ["🔥", "❤️", "⚡", "🎯", "💯", "🙌", "✨", "🫶"];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

export function ReactionBar({
  profileId,
  initialReactions,
  textColor,
}: {
  profileId: string;
  initialReactions: ProfileReaction[];
  textColor: string;
}) {
  const [reactions, setReactions] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const r of initialReactions) {
      map[r.emoji] = r.count;
    }
    return map;
  });
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [nextId, setNextId] = useState(0);

  const isRateLimited = useCallback((emoji: string) => {
    if (typeof window === "undefined") return false;
    const key = `volt_reaction_${profileId}_${emoji}`;
    const last = localStorage.getItem(key);
    if (!last) return false;
    const elapsed = Date.now() - parseInt(last, 10);
    return elapsed < 24 * 60 * 60 * 1000;
  }, [profileId]);

  const setRateLimit = useCallback((emoji: string) => {
    if (typeof window === "undefined") return;
    const key = `volt_reaction_${profileId}_${emoji}`;
    localStorage.setItem(key, Date.now().toString());
  }, [profileId]);

  async function handleReact(emoji: string) {
    if (isRateLimited(emoji)) return;

    // Optimistic update
    setReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    setRateLimit(emoji);

    // Floating animation
    const id = nextId;
    setNextId((n) => n + 1);
    const x = Math.random() * 40 - 20;
    setFloatingEmojis((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((f) => f.id !== id));
    }, 1000);

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profileId, emoji }),
      });
      if (res.ok) {
        const { count } = await res.json();
        setReactions((prev) => ({ ...prev, [emoji]: count }));
      }
    } catch {
      // Silent fail — optimistic update already applied
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap justify-center gap-2">
        {EMOJIS.map((emoji) => {
          const count = reactions[emoji] || 0;
          const limited = isRateLimited(emoji);
          return (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              disabled={limited}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              style={{
                backgroundColor: `${textColor}10`,
                border: `1px solid ${textColor}20`,
              }}
            >
              <span className="text-base">{emoji}</span>
              {count > 0 && (
                <span className="text-xs font-medium" style={{ color: textColor, opacity: 0.7 }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating emojis */}
      {floatingEmojis.map((f) => (
        <span
          key={f.id}
          className="absolute pointer-events-none text-2xl"
          style={{
            left: `calc(50% + ${f.x}px)`,
            bottom: "100%",
            animation: "emoji-float 1s ease-out forwards",
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
