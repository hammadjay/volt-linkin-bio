"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { Profile, Theme, Link } from "@/types/database";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── helpers ───────────────────────────────────────────────
function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

// ─── preview ───────────────────────────────────────────────
function ProfilePreview({
  profile,
  theme,
  links,
  // background
  bgType,
  backgroundOverride,
  bgImageUrl,
  bgOverlayColor,
  bgOverlayOpacity,
  // card
  cardStyle,
  cardBgOpacity,
  cardBgImageUrl,
  cardBlur,
  cardBorderRadius,
  cardBorderColor,
  cardShadow,
  cardMaxWidth,
  cardPadding,
  // link buttons
  accentColor,
  cardBgOverride,
  cardTextOverride,
  buttonStyle,
  animationType,
}: {
  profile: Profile;
  theme: Theme | null;
  links: Link[];
  bgType: string;
  backgroundOverride: string;
  bgImageUrl: string;
  bgOverlayColor: string;
  bgOverlayOpacity: number;
  cardStyle: string;
  cardBgOpacity: number;
  cardBgImageUrl: string;
  cardBlur: number;
  cardBorderRadius: number;
  cardBorderColor: string;
  cardShadow: boolean;
  cardMaxWidth: string;
  cardPadding: string;
  accentColor: string;
  cardBgOverride: string;
  cardTextOverride: string;
  buttonStyle: string;
  animationType: string;
}) {
  const resolvedBg = backgroundOverride || theme?.background_value || "#0f0f23";
  const textColor = theme?.text_color || "#ffffff";
  const resolvedCardBg = cardBgOverride || theme?.card_bg || "rgba(255,255,255,0.08)";
  const resolvedCardText = cardTextOverride || theme?.card_text_color || "#ffffff";
  const resolvedAccent = accentColor || theme?.accent_color || "#8b5cf6";
  const isGradient = resolvedBg.includes("gradient");

  const borderRadiusMap: Record<string, string> = {
    rounded: "0.5rem", pill: "9999px", sharp: "0",
  };
  const paddingMap: Record<string, string> = { sm: "12px", md: "20px", lg: "32px" };
  const widthMap: Record<string, string> = { sm: "240px", md: "300px", lg: "360px", full: "100%" };

  const linkItems = links.length > 0
    ? links.slice(0, 3).map((l) => ({ key: l.id, label: l.title }))
    : [{ key: "w", label: "My Website" }, { key: "p", label: "Portfolio" }, { key: "c", label: "Contact" }];

  // bg container style
  const bgContainerStyle: React.CSSProperties = bgType === "image" && bgImageUrl
    ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : isGradient
      ? { backgroundImage: resolvedBg }
      : { backgroundColor: resolvedBg };

  // card wrapper style
  function getCardStyle(): React.CSSProperties {
    const base: React.CSSProperties = {
      borderRadius: `${cardBorderRadius}px`,
      padding: paddingMap[cardPadding] || "20px",
      width: "100%",
      maxWidth: widthMap[cardMaxWidth] || "300px",
      boxShadow: cardShadow ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
    };
    if (cardStyle === "glass") return {
      ...base,
      backgroundColor: `rgba(255,255,255,${(cardBgOpacity / 100) * 0.1})`,
      backdropFilter: `blur(${cardBlur}px)`,
      border: `1px solid ${cardBorderColor || "rgba(255,255,255,0.15)"}`,
    };
    if (cardStyle === "solid") return {
      ...base,
      backgroundColor: resolvedCardBg.startsWith("rgba")
        ? resolvedCardBg
        : hexToRgba(resolvedCardBg.startsWith("#") ? resolvedCardBg : "#1a1a2e", cardBgOpacity),
      border: `1px solid ${cardBorderColor || "transparent"}`,
    };
    if (cardStyle === "outlined") return {
      ...base,
      backgroundColor: "transparent",
      border: `1px solid ${cardBorderColor || "rgba(255,255,255,0.3)"}`,
    };
    if (cardStyle === "image" && cardBgImageUrl) return {
      ...base,
      backgroundImage: `url(${cardBgImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      border: `1px solid ${cardBorderColor || "transparent"}`,
    };
    return { ...base };
  }

  return (
    <div className="w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-border" style={{ minHeight: 400 }}>
      <div className="relative flex flex-col items-center overflow-hidden" style={{ ...bgContainerStyle, minHeight: 400 }}>
        {/* Overlay */}
        {bgOverlayOpacity > 0 && (
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundColor: bgOverlayColor || "#000",
            opacity: bgOverlayOpacity / 100,
          }} />
        )}

        {/* Particles */}
        {animationType === "particles" && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="absolute rounded-full" style={{
                backgroundColor: resolvedAccent,
                width: `${6 + (i % 3) * 4}px`, height: `${6 + (i % 3) * 4}px`,
                left: `${10 + (i * 12) % 80}%`, bottom: "-5%",
                filter: "blur(1px)", opacity: 0,
                animation: `profile-particle ${5 + (i % 3) * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.6}s`,
              }} />
            ))}
          </div>
        )}

        {/* Card wrapper or plain */}
        <div className="relative z-10 flex flex-col items-center w-full" style={cardStyle !== "none" ? getCardStyle() : { padding: "24px", width: "100%" }}>
          {/* Card image overlay for readability */}
          {cardStyle === "image" && cardBgImageUrl && (
            <div className="absolute inset-0 rounded-[inherit]" style={{
              backgroundColor: "#000",
              opacity: 1 - cardBgOpacity / 100,
            }} />
          )}
          <div className="relative z-10 flex flex-col items-center gap-3 w-full">
            <div className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: resolvedAccent }}>
              {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
            </div>
            <div className="text-center" style={{ color: textColor }}>
              <p className="font-bold text-sm">{profile.display_name || profile.username}</p>
              <p className="text-xs opacity-70">{profile.bio || "Your bio here"}</p>
            </div>
            <div className="w-full space-y-2 mt-1">
              {linkItems.map((item, i) => (
                <div key={item.key} className="w-full px-3 py-2 text-center text-xs font-medium"
                  style={{
                    backgroundColor: resolvedCardBg,
                    color: resolvedCardText,
                    borderRadius: borderRadiusMap[buttonStyle] || "0.5rem",
                    ...(animationType === "float" ? {
                      animation: "profile-link-float 3s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    } : {}),
                  }}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── upload helper ──────────────────────────────────────────
function ImageUpload({
  label,
  value,
  onChange,
  onClear,
  bucket,
  path,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onClear: () => void;
  bucket: string;
  path: string;
}) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  const inputId = `upload-${bucket}-${path.replace(/\//g, "-")}`;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
      />
      <div className="flex items-center gap-2">
        <Label htmlFor={inputId} className="cursor-pointer">
          <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent transition-colors">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload image"}
          </div>
        </Label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
              toast.error("Image must be under 5MB");
              return;
            }
            setUploading(true);
            const ext = file.name.split(".").pop();
            const filePath = `${path}.${ext}`;
            const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
            if (error) {
              toast.error("Failed to upload image");
              setUploading(false);
              return;
            }
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
            onChange(publicUrl);
            toast.success("Image uploaded");
            setUploading(false);
          }}
        />
        {value && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      {value && (
        <img src={value} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-border" />
      )}
    </div>
  );
}

// ─── main editor ───────────────────────────────────────────
export function AppearanceEditor({
  profile,
  themes,
  previewLinks,
}: {
  profile: Profile;
  themes: Theme[];
  previewLinks: Link[];
}) {
  // Theme
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(profile.theme_id);

  // Background
  const [bgType, setBgType] = useState<string>(() => {
    if (profile.bg_image_url) return "image";
    if (profile.video_background_url) return "video";
    if ((profile.background_override || "").includes("gradient")) return "gradient";
    if (profile.background_override) return "solid";
    return "theme";
  });
  const [backgroundOverride, setBackgroundOverride] = useState(profile.background_override || "");
  const [bgImageUrl, setBgImageUrl] = useState(profile.bg_image_url || "");
  const [videoBackgroundUrl, setVideoBackgroundUrl] = useState(profile.video_background_url || "");
  const [bgOverlayColor, setBgOverlayColor] = useState(profile.bg_overlay_color || "#000000");
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(profile.bg_overlay_opacity ?? 0);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Content card
  const [cardStyle, setCardStyle] = useState<string>(profile.card_style || "none");
  const [cardBgOpacity, setCardBgOpacity] = useState(profile.card_bg_opacity ?? 100);
  const [cardBgImageUrl, setCardBgImageUrl] = useState(profile.card_bg_image_url || "");
  const [cardBlur, setCardBlur] = useState(profile.card_blur ?? 20);
  const [cardBorderRadius, setCardBorderRadius] = useState(profile.card_border_radius ?? 24);
  const [cardBorderColor, setCardBorderColor] = useState(profile.card_border_color || "rgba(255,255,255,0.15)");
  const [cardShadow, setCardShadow] = useState(profile.card_shadow ?? false);
  const [cardMaxWidth, setCardMaxWidth] = useState<string>(profile.card_max_width || "md");
  const [cardPadding, setCardPadding] = useState<string>(profile.card_padding || "md");

  // Colors & typography
  const [accentColor, setAccentColor] = useState(profile.accent_color || "");
  const [cardBgOverride, setCardBgOverride] = useState(profile.card_bg_override || "");
  const [cardTextOverride, setCardTextOverride] = useState(profile.card_text_override || "");
  const [buttonStyle, setButtonStyle] = useState(profile.button_style || "rounded");
  const [animationType, setAnimationType] = useState<string>(profile.animation_type || "none");
  const [cursorEffect, setCursorEffect] = useState<string>(profile.cursor_effect || "default");

  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isFirstRender = useRef(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setIsDirty(true);
  }, [
    selectedThemeId, bgType, backgroundOverride, bgImageUrl, videoBackgroundUrl,
    bgOverlayColor, bgOverlayOpacity, cardStyle, cardBgOpacity, cardBgImageUrl,
    cardBlur, cardBorderRadius, cardBorderColor, cardShadow, cardMaxWidth, cardPadding,
    accentColor, cardBgOverride, cardTextOverride, buttonStyle, animationType, cursorEffect,
  ]);
  const selectedTheme = themes.find((t) => t.id === selectedThemeId) || null;

  async function handleSave() {
    setSaving(true);

    // Resolve background fields from bgType
    const bgFields: Record<string, string | null> = {
      background_override: null,
      bg_image_url: null,
      video_background_url: null,
    };
    if (bgType === "solid" || bgType === "gradient") bgFields.background_override = backgroundOverride || null;
    if (bgType === "image") bgFields.bg_image_url = bgImageUrl || null;
    if (bgType === "video") bgFields.video_background_url = videoBackgroundUrl || null;

    const { error } = await supabase
      .from("profiles")
      .update({
        theme_id: selectedThemeId,
        ...bgFields,
        bg_overlay_color: bgOverlayColor,
        bg_overlay_opacity: bgOverlayOpacity,
        card_style: cardStyle,
        card_bg_opacity: cardBgOpacity,
        card_bg_image_url: cardBgImageUrl || null,
        card_blur: cardBlur,
        card_border_radius: cardBorderRadius,
        card_border_color: cardBorderColor || null,
        card_shadow: cardShadow,
        card_max_width: cardMaxWidth,
        card_padding: cardPadding,
        accent_color: accentColor || null,
        card_bg_override: cardBgOverride || null,
        card_text_override: cardTextOverride || null,
        button_style: buttonStyle,
        animation_type: animationType,
        cursor_effect: cursorEffect,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to save appearance");
    } else {
      toast.success("Appearance updated");
      setIsDirty(false);
      fetch("/api/badges/check", { method: "POST" }).catch(() => {});
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">

        {/* ── THEME ── */}
        <Card>
          <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => {
                const isSelected = theme.id === selectedThemeId;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`relative rounded-xl p-4 text-left transition-all border-2 ${
                      isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/30"
                    }`}
                    style={{ background: theme.background_value }}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium" style={{ color: theme.text_color }}>{theme.name}</span>
                    <div className="mt-2 flex gap-1">
                      <div className="h-2 w-8 rounded-full" style={{ backgroundColor: theme.accent_color }} />
                      <div className="h-2 w-6 rounded-full" style={{ backgroundColor: theme.card_bg }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── BACKGROUND ── */}
        <Card>
          <CardHeader><CardTitle>Background</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {/* Type selector */}
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="grid grid-cols-5 gap-2">
                {(["theme", "solid", "gradient", "image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setBgType(t)}
                    className={`px-2 py-2 text-xs font-medium rounded-lg border-2 transition-colors capitalize ${
                      bgType === t ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Type-specific inputs */}
            {bgType === "solid" && (
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={backgroundOverride || "#0f0f23"}
                    onChange={(e) => setBackgroundOverride(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent" />
                  <Input value={backgroundOverride} onChange={(e) => setBackgroundOverride(e.target.value)} placeholder="#0f0f23" className="flex-1" />
                </div>
              </div>
            )}

            {bgType === "gradient" && (
              <div className="space-y-2">
                <Label>CSS Gradient</Label>
                <Input
                  value={backgroundOverride}
                  onChange={(e) => setBackgroundOverride(e.target.value)}
                  placeholder="linear-gradient(135deg, #667eea, #764ba2)"
                />
                {backgroundOverride && backgroundOverride.includes("gradient") && (
                  <div className="h-12 rounded-lg border border-border" style={{ backgroundImage: backgroundOverride }} />
                )}
              </div>
            )}

            {bgType === "image" && (
              <ImageUpload
                label="Background Image"
                value={bgImageUrl}
                onChange={setBgImageUrl}
                onClear={() => setBgImageUrl("")}
                bucket="bg-images"
                path={`${profile.id}/page-bg`}
              />
            )}

            {bgType === "video" && (
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input value={videoBackgroundUrl} onChange={(e) => setVideoBackgroundUrl(e.target.value)} placeholder="https://example.com/video.mp4" />
                <div className="flex items-center gap-2">
                  <Label htmlFor="video-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent transition-colors">
                      <Upload className="h-4 w-4" />
                      {uploadingVideo ? "Uploading..." : "Upload video"}
                    </div>
                  </Label>
                  <input id="video-upload" type="file" accept="video/mp4,video/webm" className="hidden" disabled={uploadingVideo}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
                      setUploadingVideo(true);
                      const ext = file.name.split(".").pop();
                      const { error } = await supabase.storage.from("videos").upload(`${profile.id}/bg.${ext}`, file, { upsert: true });
                      if (error) { toast.error("Failed to upload video"); setUploadingVideo(false); return; }
                      const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(`${profile.id}/bg.${ext}`);
                      setVideoBackgroundUrl(publicUrl);
                      toast.success("Video uploaded");
                      setUploadingVideo(false);
                    }}
                  />
                  {videoBackgroundUrl && <Button variant="ghost" size="sm" onClick={() => setVideoBackgroundUrl("")}><X className="h-4 w-4 mr-1" />Clear</Button>}
                </div>
                {videoBackgroundUrl && (
                  <video src={videoBackgroundUrl} autoPlay muted loop playsInline className="w-full rounded-lg max-h-28 object-cover" />
                )}
              </div>
            )}

            {/* Overlay — shown for image + video */}
            {(bgType === "image" || bgType === "video") && (
              <>
                <Separator />
                <div className="space-y-4">
                  <Label className="font-medium">Overlay</Label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={bgOverlayColor} onChange={(e) => setBgOverlayColor(e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent" />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Opacity</span>
                        <span>{bgOverlayOpacity}%</span>
                      </div>
                      <input type="range" min={0} max={80} value={bgOverlayOpacity}
                        onChange={(e) => setBgOverlayOpacity(parseInt(e.target.value))}
                        className="w-full" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── CONTENT CARD ── */}
        <Card>
          <CardHeader><CardTitle>Content Card</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {/* Style selector */}
            <div className="space-y-2">
              <Label>Style</Label>
              <div className="grid grid-cols-5 gap-2">
                {(["none", "glass", "solid", "outlined", "image"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setCardStyle(s)}
                    className={`px-2 py-2 text-xs font-medium rounded-lg border-2 transition-colors capitalize ${
                      cardStyle === s ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {cardStyle === "none" && "Content floats directly on the background."}
                {cardStyle === "glass" && "Frosted glass with backdrop blur."}
                {cardStyle === "solid" && "Opaque card with color + opacity control."}
                {cardStyle === "outlined" && "Transparent card with a visible border."}
                {cardStyle === "image" && "Card has its own image background."}
              </p>
            </div>

            {/* Glass: blur */}
            {cardStyle === "glass" && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <Label>Blur</Label>
                  <span className="text-muted-foreground">{cardBlur}px</span>
                </div>
                <input type="range" min={4} max={40} value={cardBlur}
                  onChange={(e) => setCardBlur(parseInt(e.target.value))} className="w-full" />
              </div>
            )}

            {/* Solid: bg color */}
            {cardStyle === "solid" && (
              <div className="space-y-2">
                <Label>Card Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={cardBgOverride || selectedTheme?.card_bg || "#1a1a2e"}
                    onChange={(e) => setCardBgOverride(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent" />
                  <Input value={cardBgOverride} onChange={(e) => setCardBgOverride(e.target.value)} placeholder="Theme default" className="flex-1" />
                </div>
              </div>
            )}

            {/* Solid/glass: opacity */}
            {(cardStyle === "solid" || cardStyle === "glass") && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <Label>Background Opacity</Label>
                  <span className="text-muted-foreground">{cardBgOpacity}%</span>
                </div>
                <input type="range" min={0} max={100} value={cardBgOpacity}
                  onChange={(e) => setCardBgOpacity(parseInt(e.target.value))} className="w-full" />
              </div>
            )}

            {/* Image: upload + opacity */}
            {cardStyle === "image" && (
              <>
                <ImageUpload
                  label="Card Background Image"
                  value={cardBgImageUrl}
                  onChange={setCardBgImageUrl}
                  onClear={() => setCardBgImageUrl("")}
                  bucket="bg-images"
                  path={`${profile.id}/card-bg`}
                />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label>Image Opacity</Label>
                    <span className="text-muted-foreground">{cardBgOpacity}%</span>
                  </div>
                  <input type="range" min={10} max={100} value={cardBgOpacity}
                    onChange={(e) => setCardBgOpacity(parseInt(e.target.value))} className="w-full" />
                </div>
              </>
            )}

            <Separator />

            {/* Border color */}
            {cardStyle !== "none" && (
              <div className="space-y-2">
                <Label>Border Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={cardBorderColor.startsWith("#") ? cardBorderColor : "#ffffff"}
                    onChange={(e) => setCardBorderColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent" />
                  <Input value={cardBorderColor} onChange={(e) => setCardBorderColor(e.target.value)}
                    placeholder="rgba(255,255,255,0.15)" className="flex-1" />
                </div>
              </div>
            )}

            {/* Corner radius */}
            {cardStyle !== "none" && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <Label>Corner Radius</Label>
                  <span className="text-muted-foreground">{cardBorderRadius}px</span>
                </div>
                <input type="range" min={0} max={48} value={cardBorderRadius}
                  onChange={(e) => setCardBorderRadius(parseInt(e.target.value))} className="w-full" />
              </div>
            )}

            {/* Width */}
            {cardStyle !== "none" && (
              <div className="space-y-2">
                <Label>Width</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(["sm", "md", "lg", "full"] as const).map((w) => (
                    <button key={w} onClick={() => setCardMaxWidth(w)}
                      className={`py-2 text-xs font-medium rounded-lg border-2 uppercase transition-colors ${
                        cardMaxWidth === w ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/30"
                      }`}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Padding */}
            {cardStyle !== "none" && (
              <div className="space-y-2">
                <Label>Padding</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["sm", "md", "lg"] as const).map((p) => (
                    <button key={p} onClick={() => setCardPadding(p)}
                      className={`py-2 text-xs font-medium rounded-lg border-2 uppercase transition-colors ${
                        cardPadding === p ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/30"
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shadow */}
            {cardStyle !== "none" && (
              <div className="flex items-center justify-between">
                <Label>Drop Shadow</Label>
                <Switch checked={cardShadow} onCheckedChange={setCardShadow} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── COLORS & TYPOGRAPHY ── */}
        <Card>
          <CardHeader><CardTitle>Colors &amp; Typography</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex gap-2">
                <input type="color" value={accentColor || selectedTheme?.accent_color || "#8b5cf6"}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent" />
                <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="Theme default" className="flex-1" />
                {accentColor && <Button variant="ghost" size="sm" onClick={() => setAccentColor("")}>Reset</Button>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link Card Background</Label>
              <div className="flex gap-2">
                <input type="color" value={cardBgOverride || selectedTheme?.card_bg || "#1a1a2e"}
                  onChange={(e) => setCardBgOverride(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent" />
                <Input value={cardBgOverride} onChange={(e) => setCardBgOverride(e.target.value)} placeholder="Theme default" className="flex-1" />
                {cardBgOverride && <Button variant="ghost" size="sm" onClick={() => setCardBgOverride("")}>Reset</Button>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link Card Text</Label>
              <div className="flex gap-2">
                <input type="color" value={cardTextOverride || selectedTheme?.card_text_color || "#ffffff"}
                  onChange={(e) => setCardTextOverride(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent" />
                <Input value={cardTextOverride} onChange={(e) => setCardTextOverride(e.target.value)} placeholder="Theme default" className="flex-1" />
                {cardTextOverride && <Button variant="ghost" size="sm" onClick={() => setCardTextOverride("")}>Reset</Button>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Button Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["rounded", "pill", "sharp"] as const).map((s) => (
                  <button key={s} onClick={() => setButtonStyle(s)}
                    className={`px-4 py-2 text-sm font-medium border-2 transition-colors capitalize ${
                      buttonStyle === s ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/30"
                    }`}
                    style={{ borderRadius: s === "rounded" ? "0.5rem" : s === "pill" ? "9999px" : "0" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Page Animation</Label>
              <Select value={animationType} onValueChange={setAnimationType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="gradient">Gradient Shift</SelectItem>
                  <SelectItem value="particles">Floating Particles</SelectItem>
                  <SelectItem value="float">Float Effect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cursor Effect</Label>
              <Select value={cursorEffect} onValueChange={setCursorEffect}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="sparkle">Sparkle Trail</SelectItem>
                  <SelectItem value="emoji_trail">Emoji Trail</SelectItem>
                  <SelectItem value="glow">Glow</SelectItem>
                  <SelectItem value="ring">Ring</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ── PREVIEW ── */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="text-sm font-medium text-muted-foreground mb-4 text-center">Preview</p>
        <ProfilePreview
          profile={profile}
          theme={selectedTheme}
          links={previewLinks}
          bgType={bgType}
          backgroundOverride={backgroundOverride}
          bgImageUrl={bgImageUrl}
          bgOverlayColor={bgOverlayColor}
          bgOverlayOpacity={bgOverlayOpacity}
          cardStyle={cardStyle}
          cardBgOpacity={cardBgOpacity}
          cardBgImageUrl={cardBgImageUrl}
          cardBlur={cardBlur}
          cardBorderRadius={cardBorderRadius}
          cardBorderColor={cardBorderColor}
          cardShadow={cardShadow}
          cardMaxWidth={cardMaxWidth}
          cardPadding={cardPadding}
          accentColor={accentColor}
          cardBgOverride={cardBgOverride}
          cardTextOverride={cardTextOverride}
          buttonStyle={buttonStyle}
          animationType={animationType}
        />
      </div>

      {/* Floating Save Bar */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-xl px-5 py-2.5 pointer-events-auto">
            <span className="text-sm text-muted-foreground hidden sm:block">Unsaved changes</span>
            <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-full px-5">
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
