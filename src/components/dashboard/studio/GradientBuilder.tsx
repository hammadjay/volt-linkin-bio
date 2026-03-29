"use client";

import { useState, useRef, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Stop {
  id: string;
  color: string;
  position: number; // 0–100
}

interface GradientBuilderProps {
  value: string; // current CSS gradient string
  onChange: (css: string) => void;
}

const PRESETS = [
  { name: "Void", value: "linear-gradient(180deg, #0a0a0f 0%, #1a0533 100%)" },
  { name: "Neon Tokyo", value: "linear-gradient(180deg, #020216 0%, #0a0428 100%)" },
  { name: "Sunset", value: "linear-gradient(135deg, #c44b4b 0%, #e8875a 50%, #f4c842 100%)" },
  { name: "Aurora", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Violet Dream", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Dreamy", value: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)" },
  { name: "Synthwave", value: "linear-gradient(180deg, #0d0221 0%, #1a0533 50%, #2d1b69 100%)" },
  { name: "Midnight", value: "linear-gradient(180deg, #0a0a14 0%, #141428 100%)" },
  { name: "Fire", value: "linear-gradient(135deg, #1a0500 0%, #eb3349 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #002400 0%, #005500 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #000d1a 0%, #004e92 100%)" },
  { name: "Rose Gold", value: "linear-gradient(135deg, #1a0008 0%, #8b2252 100%)" },
  { name: "Cotton Candy", value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Y2K", value: "linear-gradient(135deg, #f953c6 0%, #b91d73 50%, #7c3aed 100%)" },
  { name: "Vaporwave", value: "linear-gradient(180deg, #0d0221 0%, #1a0a3d 50%, #2d1069 100%)" },
];

function parseGradient(css: string): { type: "linear" | "radial"; angle: number; stops: Stop[] } {
  const isRadial = css.startsWith("radial");
  const type = isRadial ? "radial" : "linear";

  // Extract angle
  let angle = 135;
  const angleMatch = css.match(/(\d+)deg/);
  if (angleMatch) angle = parseInt(angleMatch[1]);

  // Extract stops
  const colorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s+(\d+(?:\.\d+)?)%/g;
  const stops: Stop[] = [];
  let match;
  while ((match = colorRegex.exec(css)) !== null) {
    stops.push({ id: Math.random().toString(36).slice(2), color: match[1], position: parseFloat(match[2]) });
  }
  if (stops.length < 2) {
    stops.splice(0, stops.length,
      { id: "a", color: "#667eea", position: 0 },
      { id: "b", color: "#764ba2", position: 100 }
    );
  }
  return { type, angle, stops };
}

function buildGradientCss(type: "linear" | "radial", angle: number, stops: Stop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
  if (type === "radial") return `radial-gradient(ellipse at center, ${stopStr})`;
  return `linear-gradient(${angle}deg, ${stopStr})`;
}

export function GradientBuilder({ value, onChange }: GradientBuilderProps) {
  const parsed = parseGradient(value || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
  const [type, setType] = useState<"linear" | "radial">(parsed.type);
  const [angle, setAngle] = useState(parsed.angle);
  const [stops, setStops] = useState<Stop[]>(parsed.stops);
  const [selectedStop, setSelectedStop] = useState<string | null>(stops[0]?.id ?? null);
  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<string | null>(null);

  const css = buildGradientCss(type, angle, stops);

  function emit(t: typeof type, a: typeof angle, s: typeof stops) {
    onChange(buildGradientCss(t, a, s));
  }

  function handleStopDrag(id: string, e: React.MouseEvent) {
    e.preventDefault();
    dragging.current = id;
    const bar = barRef.current;
    if (!bar) return;
    const move = (me: MouseEvent) => {
      const rect = bar.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, Math.round(((me.clientX - rect.left) / rect.width) * 100)));
      setStops((prev) => {
        const next = prev.map((s) => s.id === id ? { ...s, position: pct } : s);
        emit(type, angle, next);
        return next;
      });
    };
    const up = () => {
      dragging.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  function addStop(e: React.MouseEvent<HTMLDivElement>) {
    if (dragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    // Pick color between neighbors
    let color = "#ffffff";
    for (let i = 0; i < sorted.length - 1; i++) {
      if (pct > sorted[i].position && pct < sorted[i + 1].position) {
        color = sorted[i].color;
        break;
      }
    }
    const newStop: Stop = { id: Math.random().toString(36).slice(2), color, position: pct };
    const next = [...stops, newStop];
    setStops(next);
    setSelectedStop(newStop.id);
    emit(type, angle, next);
  }

  function updateColor(id: string, color: string) {
    const next = stops.map((s) => s.id === id ? { ...s, color } : s);
    setStops(next);
    emit(type, angle, next);
  }

  function removeStop(id: string) {
    if (stops.length <= 2) return;
    const next = stops.filter((s) => s.id !== id);
    setStops(next);
    if (selectedStop === id) setSelectedStop(next[0]?.id ?? null);
    emit(type, angle, next);
  }

  const selected = stops.find((s) => s.id === selectedStop);

  return (
    <div className="space-y-4">
      {/* Preview bar */}
      <div
        ref={barRef}
        className="relative h-8 rounded-lg cursor-crosshair select-none border border-white/10"
        style={{ background: css }}
        onClick={addStop}
      >
        {stops.map((stop) => (
          <div
            key={stop.id}
            onMouseDown={(e) => { e.stopPropagation(); setSelectedStop(stop.id); handleStopDrag(stop.id, e); }}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-3 rounded-sm border-2 cursor-grab active:cursor-grabbing transition-shadow",
              selectedStop === stop.id ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.4)]" : "border-white/60"
            )}
            style={{ left: `${stop.position}%`, backgroundColor: stop.color }}
          />
        ))}
      </div>

      {/* Selected stop controls */}
      {selected && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative">
              <input
                type="color"
                value={selected.color.startsWith("#") ? selected.color : "#ffffff"}
                onChange={(e) => updateColor(selected.id, e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-white/20 bg-transparent"
              />
            </div>
            <span className="text-xs font-mono text-white/50">{selected.color}</span>
            <span className="ml-auto text-xs text-white/40">{selected.position}%</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeStop(selected.id)}
            disabled={stops.length <= 2}
            className="h-7 w-7 p-0 text-white/40 hover:text-red-400"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Type + Angle */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {(["linear", "radial"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); emit(t, angle, stops); }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                type === t ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {type === "linear" && (
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-white/40 shrink-0">Angle</span>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => { const a = parseInt(e.target.value); setAngle(a); emit(type, a, stops); }}
              className="flex-1 accent-violet-500"
            />
            <span className="text-xs text-white/50 font-mono w-8">{angle}°</span>
          </div>
        )}
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs text-white/40 mb-2">Presets</p>
        <div className="grid grid-cols-5 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              title={p.name}
              onClick={() => {
                const parsed = parseGradient(p.value);
                setType(parsed.type);
                setAngle(parsed.angle);
                setStops(parsed.stops);
                setSelectedStop(parsed.stops[0]?.id ?? null);
                onChange(p.value);
              }}
              className="h-8 rounded-md border border-white/10 hover:border-white/30 transition-all hover:scale-105"
              style={{ background: p.value }}
            />
          ))}
        </div>
      </div>

      {/* Add stop hint */}
      <p className="text-[10px] text-white/25 text-center">Click the bar to add a stop · Drag to reposition</p>
    </div>
  );
}
