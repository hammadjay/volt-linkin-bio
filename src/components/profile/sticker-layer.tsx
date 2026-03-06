"use client";

import type { ProfileSticker } from "@/types/database";

const STICKER_MAP: Record<string, string> = {
  star: "⭐",
  lightning: "⚡",
  fire: "🔥",
  heart: "❤️",
  sparkles: "✨",
  crown: "👑",
  diamond: "💎",
  music: "🎵",
  rocket: "🚀",
  rainbow: "🌈",
  flower: "🌸",
  butterfly: "🦋",
  moon: "🌙",
  sun: "☀️",
  cloud: "☁️",
  gift: "🎁",
  ghost: "👻",
  alien: "👽",
  skull: "💀",
  eyes: "👀",
};

export function StickerLayer({ stickers }: { stickers: ProfileSticker[] }) {
  if (stickers.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="absolute text-4xl select-none"
          style={{
            left: `${sticker.x_percent}%`,
            top: `${sticker.y_percent}%`,
            transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
          }}
        >
          {STICKER_MAP[sticker.sticker_key] || "⭐"}
        </div>
      ))}
    </div>
  );
}

export { STICKER_MAP };
