"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useStudio } from "../studio-context";
import { cn } from "@/lib/utils";

const ANIMATION_TYPES = [
  { id: "none", label: "None", desc: "Static background" },
  { id: "gradient", label: "Gradient Shift", desc: "Animated gradient flow" },
  { id: "particles", label: "Particles", desc: "Floating orbs" },
  { id: "float", label: "Float", desc: "Avatar + links bob gently" },
] as const;

const CURSOR_EFFECTS = [
  { id: "default", label: "Default", desc: "Standard cursor" },
  { id: "sparkle", label: "Sparkle", desc: "Glitter trail" },
  { id: "glow", label: "Glow", desc: "Soft light halo" },
  { id: "ring", label: "Ring", desc: "Circle follows cursor" },
  { id: "emoji_trail", label: "Emoji Trail", desc: "Emoji scatter" },
] as const;

const AVATAR_SHAPES = [
  { id: "circle", label: "Circle" },
  { id: "rounded-square", label: "Square" },
  { id: "squircle", label: "Squircle" },
  { id: "hexagon", label: "Hexagon" },
  { id: "diamond", label: "Diamond" },
] as const;

const AVATAR_RING_STYLES = [
  { id: "none", label: "None" },
  { id: "solid", label: "Solid" },
  { id: "dashed", label: "Dashed" },
  { id: "glow", label: "Glow" },
  { id: "gradient", label: "Gradient" },
  { id: "rotating", label: "Rotating" },
] as const;

const AVATAR_EFFECTS = [
  { id: "none", label: "None" },
  { id: "float", label: "Float" },
  { id: "pulse", label: "Pulse" },
  { id: "glow", label: "Glow" },
  { id: "shimmer", label: "Shimmer" },
] as const;

const TEXTURE_TYPES = [
  { id: "none", label: "None" },
  { id: "grain", label: "Grain" },
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "diagonal", label: "Lines" },
  { id: "scanlines", label: "Scanlines" },
] as const;

export function EffectsPanel() {
  const { state, update } = useStudio();

  return (
    <div className="space-y-6">
      {/* Animation Type */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Page Animation</Label>
        <div className="space-y-1.5">
          {ANIMATION_TYPES.map((a) => {
            const isActive = state.animation_type === a.id;
            return (
              <button
                key={a.id}
                onClick={() => update({ animation_type: a.id })}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all",
                  isActive ? "border-violet-500 bg-violet-500/10" : "border-white/[0.07] hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn("text-xs font-medium", isActive ? "text-white" : "text-white/60")}>{a.label}</p>
                  <p className="text-[10px] text-white/30">{a.desc}</p>
                </div>
                {isActive && <div className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Avatar Shape */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Avatar Shape</Label>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_SHAPES.map((s) => (
            <button
              key={s.id}
              onClick={() => update({ avatar_shape: s.id })}
              className={cn(
                "py-2 text-[10px] font-medium rounded-lg border transition-all",
                state.avatar_shape === s.id
                  ? "border-violet-500 bg-violet-500/10 text-white"
                  : "border-white/[0.07] text-white/40 hover:border-white/20"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Avatar Ring */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Avatar Ring</Label>
        <div className="grid grid-cols-3 gap-2">
          {AVATAR_RING_STYLES.map((r) => (
            <button
              key={r.id}
              onClick={() => update({ avatar_ring_style: r.id })}
              className={cn(
                "py-1.5 text-[10px] font-medium rounded-lg border transition-all",
                state.avatar_ring_style === r.id
                  ? "border-violet-500 bg-violet-500/10 text-white"
                  : "border-white/[0.07] text-white/40 hover:border-white/20"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        {state.avatar_ring_style !== "none" && (
          <div className="flex gap-2 mt-2">
            <input
              type="color"
              value={state.avatar_ring_color?.startsWith("#") ? state.avatar_ring_color : "#8b5cf6"}
              onChange={(e) => update({ avatar_ring_color: e.target.value })}
              className="h-9 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
            />
            <Input
              value={state.avatar_ring_color}
              onChange={(e) => update({ avatar_ring_color: e.target.value })}
              placeholder="#8b5cf6"
              className="flex-1 h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-xs font-mono"
            />
          </div>
        )}
      </div>

      {/* Avatar Effect */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Avatar Effect</Label>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_EFFECTS.map((e) => (
            <button
              key={e.id}
              onClick={() => update({ avatar_effect: e.id })}
              className={cn(
                "py-1.5 text-[10px] font-medium rounded-lg border transition-all",
                state.avatar_effect === e.id
                  ? "border-violet-500 bg-violet-500/10 text-white"
                  : "border-white/[0.07] text-white/40 hover:border-white/20"
              )}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cursor Effect */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Cursor Effect</Label>
        <div className="space-y-1.5">
          {CURSOR_EFFECTS.map((c) => {
            const isActive = state.cursor_effect === c.id;
            return (
              <button
                key={c.id}
                onClick={() => update({ cursor_effect: c.id })}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all",
                  isActive ? "border-violet-500 bg-violet-500/10" : "border-white/[0.07] hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn("text-xs font-medium", isActive ? "text-white" : "text-white/60")}>{c.label}</p>
                  <p className="text-[10px] text-white/30">{c.desc}</p>
                </div>
                {isActive && <div className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Texture Overlay */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Texture Overlay</Label>
        <div className="grid grid-cols-3 gap-2">
          {TEXTURE_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ texture_type: t.id })}
              className={cn(
                "py-1.5 text-[10px] font-medium rounded-lg border transition-all",
                state.texture_type === t.id
                  ? "border-violet-500 bg-violet-500/10 text-white"
                  : "border-white/[0.07] text-white/40 hover:border-white/20"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {state.texture_type !== "none" && (
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-xs">
              <Label className="text-xs text-white/50 uppercase tracking-wider">Intensity</Label>
              <span className="text-white/40">{state.texture_opacity}%</span>
            </div>
            <input
              type="range" min={5} max={60} value={state.texture_opacity}
              onChange={(e) => update({ texture_opacity: parseInt(e.target.value) })}
              className="w-full accent-violet-500"
            />
          </div>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Status</Label>
        <div className="flex gap-2">
          <Input
            value={state.status_emoji}
            onChange={(e) => update({ status_emoji: e.target.value })}
            placeholder="😊"
            className="w-16 h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-center text-base"
            maxLength={2}
          />
          <Input
            value={state.status_text}
            onChange={(e) => update({ status_text: e.target.value })}
            placeholder="Currently vibing..."
            className="flex-1 h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-xs"
            maxLength={40}
          />
        </div>
      </div>

      {/* Spotlight */}
      <div className="space-y-3 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs text-white/50 uppercase tracking-wider">Spotlight Effect</Label>
            <p className="text-[10px] text-white/30 mt-0.5">Mouse-tracking light cone</p>
          </div>
          <Switch
            checked={state.spotlight_enabled}
            onCheckedChange={(v) => update({ spotlight_enabled: v })}
          />
        </div>
        {state.spotlight_enabled && (
          <div className="flex gap-2">
            <input
              type="color"
              value={state.spotlight_color?.startsWith("#") ? state.spotlight_color : "#ffffff"}
              onChange={(e) => update({ spotlight_color: e.target.value })}
              className="h-9 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
            />
            <Input
              value={state.spotlight_color}
              onChange={(e) => update({ spotlight_color: e.target.value })}
              placeholder="#ffffff"
              className="flex-1 h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-xs font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}
