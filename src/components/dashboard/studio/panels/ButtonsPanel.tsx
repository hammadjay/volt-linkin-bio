"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { useStudio } from "../studio-context";
import { cn } from "@/lib/utils";

const SHAPES = [
  { id: "rounded", label: "Rounded", radius: "12px", preview: "rounded-xl" },
  { id: "pill", label: "Pill", radius: "9999px", preview: "rounded-full" },
  { id: "sharp", label: "Sharp", radius: "0", preview: "rounded-none" },
  { id: "squircle", label: "Squircle", radius: "30%", preview: "rounded-2xl" },
  { id: "tag", label: "Tag", radius: "4px", preview: "" },
  { id: "underline", label: "Underline", radius: "0", preview: "" },
  { id: "chip", label: "Chip", radius: "6px", preview: "rounded-md" },
  { id: "shadow-lift", label: "Lifted", radius: "10px", preview: "rounded-xl" },
] as const;

const HOVER_FX = [
  { id: "scale", label: "Scale", desc: "Slight zoom in" },
  { id: "glow", label: "Glow", desc: "Accent color glow" },
  { id: "shimmer", label: "Shimmer", desc: "Light sweep" },
  { id: "fill", label: "Fill", desc: "BG fills left→right" },
  { id: "lift", label: "Lift", desc: "Translates up + shadow" },
  { id: "jelly", label: "Jelly", desc: "Spring bounce" },
  { id: "shake", label: "Shake", desc: "Horizontal wiggle" },
  { id: "none", label: "None", desc: "No hover effect" },
] as const;

export function ButtonsPanel() {
  const { state, update } = useStudio();
  const accent = state.accent_color || "#8b5cf6";
  const cardBg = state.card_bg_override || "rgba(255,255,255,0.08)";

  return (
    <div className="space-y-6">
      {/* Shape */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Button Shape</Label>
        <div className="grid grid-cols-2 gap-3">
          {SHAPES.map((shape) => {
            const isActive = state.button_shape === shape.id;
            return (
              <button
                key={shape.id}
                onClick={() => update({ button_shape: shape.id, button_style: (["rounded", "pill", "sharp"].includes(shape.id) ? shape.id as "rounded" | "pill" | "sharp" : "rounded") })}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all space-y-2",
                  isActive ? "border-violet-500 bg-violet-500/10" : "border-white/[0.07] hover:border-white/20"
                )}
              >
                <div
                  className="w-full py-1.5 text-center text-[10px] font-medium"
                  style={{
                    borderRadius: shape.radius,
                    backgroundColor: isActive ? `${accent}30` : "rgba(255,255,255,0.07)",
                    color: isActive ? accent : "rgba(255,255,255,0.5)",
                    ...(shape.id === "underline" ? {
                      backgroundColor: "transparent",
                      borderBottom: `2px solid ${isActive ? accent : "rgba(255,255,255,0.3)"}`,
                      borderRadius: 0,
                    } : {}),
                    ...(shape.id === "tag" ? {
                      borderLeft: `3px solid ${isActive ? accent : "rgba(255,255,255,0.3)"}`,
                      borderRadius: "4px",
                      textAlign: "left" as const,
                      paddingLeft: "8px",
                    } : {}),
                    ...(shape.id === "shadow-lift" ? {
                      boxShadow: `0 4px 12px ${accent}40`,
                    } : {}),
                  }}
                >
                  Aa
                </div>
                <p className="text-[10px] text-white/40">{shape.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hover effect */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Hover Effect</Label>
        <div className="space-y-1.5">
          {HOVER_FX.map((fx) => {
            const isActive = state.button_hover_effect === fx.id;
            return (
              <button
                key={fx.id}
                onClick={() => update({ button_hover_effect: fx.id })}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all",
                  isActive ? "border-violet-500 bg-violet-500/10" : "border-white/[0.07] hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn("text-xs font-medium", isActive ? "text-white" : "text-white/60")}>{fx.label}</p>
                  <p className="text-[10px] text-white/30">{fx.desc}</p>
                </div>
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-violet-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
