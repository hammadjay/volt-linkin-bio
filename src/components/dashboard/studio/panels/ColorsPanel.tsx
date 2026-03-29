"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useStudio } from "../studio-context";
import { cn } from "@/lib/utils";

const SMART_PALETTES = [
  { name: "Electric Purple", accent: "#7C3AED", cardBg: "rgba(20,5,40,0.9)", text: "#ffffff" },
  { name: "Hot Pink", accent: "#EC4899", cardBg: "rgba(30,5,20,0.9)", text: "#ffffff" },
  { name: "Neon Cyan", accent: "#06B6D4", cardBg: "rgba(2,20,25,0.9)", text: "#e0f9ff" },
  { name: "Electric Yellow", accent: "#FACC15", cardBg: "rgba(15,12,3,0.9)", text: "#ffffff" },
  { name: "Emerald", accent: "#10B981", cardBg: "rgba(2,20,15,0.9)", text: "#ecfdf5" },
  { name: "Coral", accent: "#F97316", cardBg: "rgba(20,8,2,0.9)", text: "#fff8f3" },
  { name: "Rose Gold", accent: "#FDA4AF", cardBg: "rgba(25,5,8,0.9)", text: "#ffe4e6" },
  { name: "Silver Chrome", accent: "#CBD5E1", cardBg: "rgba(10,15,25,0.9)", text: "#f1f5f9" },
  { name: "Pure White", accent: "#FFFFFF", cardBg: "rgba(15,15,15,0.9)", text: "#ffffff" },
  { name: "Brand Red", accent: "#EF4444", cardBg: "rgba(12,2,2,0.9)", text: "#ffffff" },
  { name: "Indigo", accent: "#5E6AD2", cardBg: "rgba(8,8,20,0.9)", text: "#e0e0ff" },
  { name: "Amber", accent: "#D97706", cardBg: "rgba(20,12,0,0.9)", text: "#fff8e8" },
];

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isHex = value.startsWith("#");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-white/50 uppercase tracking-wider">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={isHex ? value : "#8b5cf6"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. #8b5cf6 or rgba(139,92,246,0.8)"
          className="flex-1 h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-xs font-mono"
        />
      </div>
    </div>
  );
}

export function ColorsPanel() {
  const { state, update } = useStudio();

  function applyPalette(p: typeof SMART_PALETTES[0]) {
    update({
      accent_color: p.accent,
      card_bg_override: p.cardBg,
      card_text_override: p.text,
    });
  }

  return (
    <div className="space-y-6">
      {/* Smart Palettes */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Smart Palettes</Label>
        <p className="text-[10px] text-white/30">Harmonious accent + card + text combos</p>
        <div className="grid grid-cols-3 gap-2.5">
          {SMART_PALETTES.map((p) => {
            const isActive = state.accent_color === p.accent;
            return (
              <button
                key={p.name}
                onClick={() => applyPalette(p)}
                className={cn(
                  "relative rounded-xl p-3 text-left transition-all border",
                  isActive ? "border-violet-500 ring-1 ring-violet-500/30" : "border-white/[0.07] hover:border-white/20"
                )}
                style={{ background: p.cardBg }}
              >
                <div className="flex gap-1 mb-1.5">
                  <div className="h-3 w-3 rounded-full border-2 border-white/20" style={{ backgroundColor: p.accent }} />
                  <div className="h-3 w-8 rounded-sm opacity-60" style={{ backgroundColor: p.accent }} />
                </div>
                <p className="text-[10px] font-medium leading-tight" style={{ color: p.text, opacity: 0.7 }}>
                  {p.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual color pickers */}
      <div className="space-y-4 pt-3 border-t border-white/[0.06]">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Manual Override</Label>
        <ColorRow
          label="Accent Color"
          value={state.accent_color}
          onChange={(v) => update({ accent_color: v })}
        />
        <ColorRow
          label="Card / Button Background"
          value={state.card_bg_override}
          onChange={(v) => update({ card_bg_override: v })}
        />
        <ColorRow
          label="Card / Button Text"
          value={state.card_text_override}
          onChange={(v) => update({ card_text_override: v })}
        />
      </div>

      {/* Theme selector */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Preset Themes</Label>
        <ThemeSelector />
      </div>
    </div>
  );
}

function ThemeSelector() {
  const { themes, state, update } = useStudio();
  if (!themes.length) return <p className="text-xs text-white/30">No themes found.</p>;
  return (
    <div className="grid grid-cols-2 gap-2">
      {themes.map((theme) => {
        const isSelected = state.theme_id === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => update({ theme_id: theme.id })}
            className={cn(
              "relative rounded-xl p-3 text-left border transition-all",
              isSelected ? "border-violet-500 ring-1 ring-violet-500/30" : "border-white/[0.07] hover:border-white/20"
            )}
            style={{ background: theme.background_value }}
          >
            {isSelected && (
              <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            )}
            <p className="text-xs font-medium" style={{ color: theme.text_color }}>{theme.name}</p>
            <div className="mt-1.5 flex gap-1">
              <div className="h-1.5 w-8 rounded-full" style={{ backgroundColor: theme.accent_color }} />
              <div className="h-1.5 w-5 rounded-full" style={{ backgroundColor: theme.card_bg }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
