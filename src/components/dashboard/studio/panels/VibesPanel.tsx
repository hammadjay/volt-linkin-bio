"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useStudio } from "../studio-context";
import { VIBES, VIBE_CATEGORIES } from "../vibes";
import { cn } from "@/lib/utils";

export function VibesPanel() {
  const { state, applyVibe } = useStudio();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? VIBES
    : VIBES.filter((v) => v.category === activeCategory);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-white/40 mb-1">Pick a vibe to instantly apply a full aesthetic — you can customize anything after.</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {VIBE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all",
              activeCategory === cat.id
                ? "bg-violet-600 text-white"
                : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white/80"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Vibe grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filtered.map((vibe, i) => {
          const isActive = state.vibe_id === vibe.id;
          return (
            <motion.button
              key={vibe.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              onClick={() => applyVibe(vibe)}
              className={cn(
                "relative overflow-hidden rounded-xl border text-left transition-all group",
                isActive ? "border-violet-500 ring-1 ring-violet-500/30" : "border-white/[0.07] hover:border-white/20"
              )}
            >
              {/* Preview background */}
              <div
                className="h-16 w-full relative"
                style={{ background: vibe.previewBg }}
              >
                {/* Mini links */}
                <div className="absolute inset-x-4 bottom-2 space-y-1">
                  {[0, 1].map((j) => (
                    <div
                      key={j}
                      className="h-2 rounded-sm opacity-60"
                      style={{ backgroundColor: vibe.previewAccent, width: j === 0 ? "80%" : "60%" }}
                    />
                  ))}
                </div>
                {/* Active badge */}
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
              {/* Name */}
              <div className="px-2.5 py-1.5 bg-white/[0.03]">
                <span className="text-[11px] font-medium text-white/70 group-hover:text-white transition-colors">
                  {vibe.emoji} {vibe.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
