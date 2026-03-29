"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useStudio } from "../studio-context";
import { GradientBuilder } from "../GradientBuilder";
import { cn } from "@/lib/utils";

const BG_TYPES = ["theme", "solid", "gradient", "image", "video"] as const;
type BgType = (typeof BG_TYPES)[number];

export function BackgroundPanel() {
  const { state, update, profileId } = useStudio();
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  const bgType: BgType = (() => {
    if (state.bg_image_url) return "image";
    if (state.video_background_url) return "video";
    if (state.background_override.includes("gradient")) return "gradient";
    if (state.background_override) return "solid";
    return "theme";
  })();

  function setBgType(t: BgType) {
    if (t === "theme") {
      update({ background_override: "", bg_image_url: "", video_background_url: "" });
    } else if (t === "solid") {
      update({ background_override: "#0f0f23", bg_image_url: "", video_background_url: "" });
    } else if (t === "gradient") {
      update({ background_override: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", bg_image_url: "", video_background_url: "" });
    } else if (t === "image") {
      update({ bg_image_url: "", video_background_url: "", background_override: "" });
    } else {
      update({ video_background_url: "", bg_image_url: "", background_override: "" });
    }
  }

  async function uploadFile(file: File, type: "image" | "video") {
    const maxMb = type === "image" ? 5 : 10;
    if (file.size > maxMb * 1024 * 1024) { toast.error(`File must be under ${maxMb}MB`); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const bucket = type === "image" ? "bg-images" : "videos";
    const path = type === "image" ? `${profileId}/page-bg.${ext}` : `${profileId}/bg.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) { toast.error(`Failed to upload`); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    if (type === "image") update({ bg_image_url: publicUrl });
    else update({ video_background_url: publicUrl });
    setUploading(false);
  }

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div className="space-y-2">
        <Label className="text-xs text-white/50 uppercase tracking-wider">Background Type</Label>
        <div className="grid grid-cols-5 gap-1.5">
          {BG_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setBgType(t)}
              className={cn(
                "py-2 text-xs font-medium rounded-lg border transition-all capitalize",
                bgType === t
                  ? "border-violet-500 bg-violet-500/15 text-white"
                  : "border-white/[0.07] text-white/40 hover:border-white/20 hover:text-white/70"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Solid color */}
      {bgType === "solid" && (
        <div className="space-y-2">
          <Label className="text-xs text-white/50 uppercase tracking-wider">Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={state.background_override || "#0f0f23"}
              onChange={(e) => update({ background_override: e.target.value })}
              className="h-9 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
            />
            <Input
              value={state.background_override}
              onChange={(e) => update({ background_override: e.target.value })}
              placeholder="#0f0f23"
              className="flex-1 h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-sm font-mono"
            />
          </div>
        </div>
      )}

      {/* Gradient builder */}
      {bgType === "gradient" && (
        <div className="space-y-2">
          <Label className="text-xs text-white/50 uppercase tracking-wider">Gradient</Label>
          <GradientBuilder
            value={state.background_override}
            onChange={(css) => update({ background_override: css })}
          />
        </div>
      )}

      {/* Image upload */}
      {bgType === "image" && (
        <div className="space-y-3">
          <Label className="text-xs text-white/50 uppercase tracking-wider">Background Image</Label>
          <Input
            value={state.bg_image_url}
            onChange={(e) => update({ bg_image_url: e.target.value })}
            placeholder="https://example.com/bg.jpg"
            className="h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-sm"
          />
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60 hover:bg-white/[0.07] transition-colors">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading…" : "Upload image"}
              </div>
              <input type="file" accept="image/*" className="hidden" disabled={uploading}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "image"); }} />
            </label>
            {state.bg_image_url && (
              <Button variant="ghost" size="sm" onClick={() => update({ bg_image_url: "" })} className="h-9 text-white/40 hover:text-red-400">
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {state.bg_image_url && (
            <img src={state.bg_image_url} alt="" className="w-full h-20 object-cover rounded-lg border border-white/10" />
          )}
        </div>
      )}

      {/* Video upload */}
      {bgType === "video" && (
        <div className="space-y-3">
          <Label className="text-xs text-white/50 uppercase tracking-wider">Background Video</Label>
          <Input
            value={state.video_background_url}
            onChange={(e) => update({ video_background_url: e.target.value })}
            placeholder="https://example.com/video.mp4"
            className="h-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 text-sm"
          />
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60 hover:bg-white/[0.07] transition-colors">
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Uploading…" : "Upload video (MP4, max 10MB)"}
            </div>
            <input type="file" accept="video/mp4,video/webm" className="hidden" disabled={uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "video"); }} />
          </label>
        </div>
      )}

      {/* Overlay (for image + video) */}
      {(bgType === "image" || bgType === "video") && (
        <div className="space-y-3 pt-3 border-t border-white/[0.06]">
          <Label className="text-xs text-white/50 uppercase tracking-wider">Overlay</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={state.bg_overlay_color}
              onChange={(e) => update({ bg_overlay_color: e.target.value })}
              className="h-8 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
            />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs text-white/40">
                <span>Opacity</span>
                <span>{state.bg_overlay_opacity}%</span>
              </div>
              <input
                type="range" min={0} max={80} value={state.bg_overlay_opacity}
                onChange={(e) => update({ bg_overlay_opacity: parseInt(e.target.value) })}
                className="w-full accent-violet-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
