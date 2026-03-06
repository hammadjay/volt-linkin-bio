"use client";

import { useEffect, useRef } from "react";

const TRAIL_EMOJIS = ["✨", "⭐", "💫", "🌟", "💖", "🔥", "⚡"];

export function CursorEffects({
  effect,
  accentColor,
}: {
  effect: "sparkle" | "emoji_trail" | "glow" | "ring";
  accentColor: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const ringPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Respect reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    if (effect === "ring") {
      const ring = document.createElement("div");
      ring.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9999;
        width: 32px; height: 32px; border-radius: 50%;
        border: 2px solid ${accentColor}; opacity: 0.6;
        transform: translate(-50%, -50%);
        transition: width 0.1s, height 0.1s;
      `;
      document.body.appendChild(ring);
      ringRef.current = ring;
      ringPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      function animateRing() {
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
        if (ringRef.current) {
          ringRef.current.style.left = `${ringPos.current.x}px`;
          ringRef.current.style.top = `${ringPos.current.y}px`;
        }
        rafRef.current = requestAnimationFrame(animateRing);
      }
      rafRef.current = requestAnimationFrame(animateRing);
    }

    function handleMove(e: MouseEvent | TouchEvent) {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      mousePos.current = { x, y };

      if (effect === "sparkle") {
        createSparkle(x, y);
      } else if (effect === "emoji_trail") {
        if (Math.random() > 0.7) createEmojiTrail(x, y);
      } else if (effect === "glow") {
        updateGlow(x, y);
      }
    }

    function createSparkle(x: number, y: number) {
      const el = document.createElement("div");
      const size = 4 + Math.random() * 8;
      el.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9998;
        width: ${size}px; height: ${size}px; border-radius: 50%;
        background: ${accentColor}; left: ${x}px; top: ${y}px;
        transform: translate(-50%, -50%);
        animation: cursor-sparkle 0.6s ease-out forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 600);
    }

    function createEmojiTrail(x: number, y: number) {
      const el = document.createElement("span");
      el.textContent = TRAIL_EMOJIS[Math.floor(Math.random() * TRAIL_EMOJIS.length)];
      el.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9998;
        font-size: 16px; left: ${x}px; top: ${y}px;
        transform: translate(-50%, -50%);
        animation: emoji-float 1s ease-out forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }

    let glowEl: HTMLDivElement | null = null;
    function updateGlow(x: number, y: number) {
      if (!glowEl) {
        glowEl = document.createElement("div");
        glowEl.style.cssText = `
          position: fixed; pointer-events: none; z-index: 9997;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, ${accentColor}30 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: left 0.05s, top 0.05s;
        `;
        document.body.appendChild(glowEl);
      }
      glowEl.style.left = `${x}px`;
      glowEl.style.top = `${y}px`;
    }

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      if (ringRef.current) {
        ringRef.current.remove();
        ringRef.current = null;
      }
      if (glowEl) {
        glowEl.remove();
        glowEl = null;
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [effect, accentColor]);

  return <div ref={containerRef} className="hidden" />;
}
