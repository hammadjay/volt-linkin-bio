"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useStudio } from "../studio-context";
import { cn } from "@/lib/utils";

const CARD_STYLES = [
  { id: "none", label: "None", desc: "Floats on background" },
  { id: "glass", label: "Glass", desc: "Frosted blur" },
  { id: "solid", label: "Solid", desc: "Opaque card" },
  { id: "outlined", label: "Outlined", desc: "Border only" },
  { id: "image", label: "Image", desc: "Custom background" },
] as const;

const WIDTHS = ["sm", "md", "lg", "full"] as const;
const PADDINGS = ["sm", "md", "lg"] as const;

export function CardPanel() {
  const { state, update, profileId } = useStudio();
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function uploadCardImage(file: File) {
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const { error } = await supabase.storage.from("bg-images").upload(`${profileId}/card-bg.${ext}`, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("bg-images").getPublicUrl(`${profileId}/card-bg.${ext}`);
    update({ card_bg_image_url: publicUrl });
    setUploading(false);
  }

  return (
    <div className="space-y-5">
      {/* Style */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Card Style</Label>
        <div className="space-y-1.5">
          {CARD_STYLES.map((s) => {
            const isActive = state.card_style === s.id;
            return (
              <button
                key={s.id}
                onClick={() => update({ card_style: s.id as typeof state.card_style })}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all",
                  isActive ? "border-violet-500 bg-violet-500/10" : "border-white/[0.07] hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn("text-xs font-medium", isActive ? "text-white" : "text-white/60")}>{s.label}</p>
                  <p className="text-[10px] text-white/30">{s.desc}</p>
                </div>
                {isActive && <div className="h-2 w-2 rounded-full bg-violet-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {state.card_style !== "none" && (
        <>
          {/* Glass blur */}
          {state.card_style === "glass" && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white/40">
                <Label className="text-xs text-white/50 uppercase tracking-wider">Blur</Label>
                <span>{state.card_blur}px</span>
              </div>
              <input type="range" min={4} max={40} value={state.card_blur}
                onChange={(e) => update({ card_blur: parseInt(e.target.value) })} className="w-full accent-violet-500" />
            </div>
          )}

          {/* Solid bg opacity */}
          {(state.card_style === "solid" || state.card_style === "glass") && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <Label className="text-xs text-white/50 uppercase tracking-wider">Opacity</Label>
                <span className="text-white/40">{state.card_bg_opacity}%</span>
              </div>
              <input type="range" min={10} max={100} value={state.card_bg_opacity}
                onChange={(e) => update({ card_bg_opacity: parseInt(e.target.value) })} className="w-full accent-violet-500" />
            </div>
          )}

          {/* Image upload */}
          {state.card_style === "image" && (
            <div className="space-y-2">
              <Label className="text-xs text-white/50 uppercase tracking-wider">Card Image</Label>
              <label className="cursor-pointer block">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60 hover:bg-white/[0.07] transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  {uploading ? "Uploading…" : "Upload card image"}
                </div>
                <input type="file" accept="image/*" className="hidden" disabled={uploading}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCardImage(f); }} />
              </label>
              {state.card_bg_image_url && (
                <div className="relative">
                  <img src={state.card_bg_image_url} alt="" className="w-full h-16 object-cover rounded-lg border border-white/10" />
                  <button onClick={() => update({ card_bg_image_url: "" })} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center">
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Border color */}
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50 uppercase tracking-wider">Border Color</Label>
            <div className="flex gap-2">
              <input type="color" value={state.card_border_color?.startsWith("#") ? state.card_border_color : "#ffffff"}
                onChange={(e) => update({ card_border_color: e.target.value })}
                className="h-9 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
              <Input value={state.card_border_color} onChange={(e) => update({ card_border_color: e.target.value })}
                placeholder="rgba(255,255,255,0.15)"
                className="flex-1 h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-xs font-mono" />
            </div>
          </div>

          {/* Border radius */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <Label className="text-xs text-white/50 uppercase tracking-wider">Corner Radius</Label>
              <span className="text-white/40">{state.card_border_radius}px</span>
            </div>
            <input type="range" min={0} max={48} value={state.card_border_radius}
              onChange={(e) => update({ card_border_radius: parseInt(e.target.value) })} className="w-full accent-violet-500" />
          </div>

          {/* Width */}
          <div className="space-y-2">
            <Label className="text-xs text-white/50 uppercase tracking-wider">Max Width</Label>
            <div className="grid grid-cols-4 gap-2">
              {WIDTHS.map((w) => (
                <button key={w} onClick={() => update({ card_max_width: w })}
                  className={cn("py-2 text-xs font-medium rounded-lg border uppercase transition-all",
                    state.card_max_width === w ? "border-violet-500 bg-violet-500/10 text-white" : "border-white/[0.07] text-white/40 hover:border-white/20")}>
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Padding */}
          <div className="space-y-2">
            <Label className="text-xs text-white/50 uppercase tracking-wider">Padding</Label>
            <div className="grid grid-cols-3 gap-2">
              {PADDINGS.map((p) => (
                <button key={p} onClick={() => update({ card_padding: p })}
                  className={cn("py-2 text-xs font-medium rounded-lg border uppercase transition-all",
                    state.card_padding === p ? "border-violet-500 bg-violet-500/10 text-white" : "border-white/[0.07] text-white/40 hover:border-white/20")}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Shadow */}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-white/50 uppercase tracking-wider">Drop Shadow</Label>
            <Switch checked={state.card_shadow} onCheckedChange={(v) => update({ card_shadow: v })} />
          </div>
        </>
      )}
    </div>
  );
}
