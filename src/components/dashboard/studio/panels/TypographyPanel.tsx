"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useStudio } from "../studio-context";
import { FONTS, FONT_CATEGORY_LABELS, loadGoogleFont } from "../studio-fonts";
import { cn } from "@/lib/utils";

function FontPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  useEffect(() => { loadGoogleFont(value); }, [value]);

  return (
    <div className="space-y-2">
      <Label className="text-xs text-white/50 uppercase tracking-wider">{label}</Label>
      <div className="grid grid-cols-1 gap-1">
        {Object.entries(
          FONTS.reduce<Record<string, typeof FONTS>>((acc, f) => {
            (acc[f.category] ??= []).push(f);
            return acc;
          }, {})
        ).map(([category, fonts]) => (
          <div key={category} className="space-y-1">
            <p className="text-[10px] text-white/25 uppercase tracking-widest pt-2 first:pt-0">
              {FONT_CATEGORY_LABELS[category as keyof typeof FONT_CATEGORY_LABELS]}
            </p>
            {fonts.map((font) => (
              <button
                key={font.name}
                onClick={() => { loadGoogleFont(font.name); onChange(font.name); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all",
                  value === font.name
                    ? "bg-violet-600/20 border border-violet-500/40 text-white"
                    : "bg-white/[0.03] border border-white/[0.05] text-white/50 hover:bg-white/[0.07] hover:text-white/80"
                )}
              >
                <span
                  className="text-sm"
                  style={{ fontFamily: font.googleFamily ? `"${font.name}", sans-serif` : undefined }}
                >
                  {font.label}
                </span>
                <span className="text-[10px] opacity-40">Aa</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TypographyPanel() {
  const { state, update } = useStudio();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
        <p
          className="text-lg font-bold text-white mb-1"
          style={{ fontFamily: state.font_heading !== "Inter" ? `"${state.font_heading}", sans-serif` : undefined }}
        >
          {state.font_heading}
        </p>
        <p
          className="text-xs text-white/40"
          style={{ fontFamily: state.font_body !== "Inter" ? `"${state.font_body}", sans-serif` : undefined }}
        >
          The quick brown fox jumps over the lazy dog
        </p>
        <div
          className="mt-2 text-xs text-white/50 border border-white/10 rounded-lg px-3 py-1.5"
          style={{ fontFamily: state.font_buttons !== "Inter" ? `"${state.font_buttons}", sans-serif` : undefined }}
        >
          Link Button Style
        </div>
      </div>

      <FontPicker label="Name / Heading Font" value={state.font_heading} onChange={(v) => update({ font_heading: v })} />
      <FontPicker label="Bio / Body Font" value={state.font_body} onChange={(v) => update({ font_body: v })} />
      <FontPicker label="Link Button Font" value={state.font_buttons} onChange={(v) => update({ font_buttons: v })} />
    </div>
  );
}
