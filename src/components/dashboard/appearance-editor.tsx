"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function ProfilePreview({
  profile,
  theme,
  links,
  accentColor,
  backgroundOverride,
  buttonStyle,
  cardBgOverride,
  cardTextOverride,
  animationType,
}: {
  profile: Profile;
  theme: Theme | null;
  links: Link[];
  accentColor: string;
  backgroundOverride: string;
  buttonStyle: string;
  cardBgOverride: string;
  cardTextOverride: string;
  animationType: string;
}) {
  const bg = backgroundOverride || theme?.background_value || "#0f0f23";
  const textColor = theme?.text_color || "#ffffff";
  const cardBg = cardBgOverride || theme?.card_bg || "rgba(255,255,255,0.08)";
  const cardTextColor = cardTextOverride || theme?.card_text_color || "#ffffff";
  const isGradient = bg.includes("gradient");

  const borderRadiusMap: Record<string, string> = {
    rounded: "0.5rem",
    pill: "9999px",
    sharp: "0",
  };

  const showGradientAnim = animationType === "gradient" && isGradient;
  const resolvedAccent = accentColor || theme?.accent_color || "#8b5cf6";

  const linkItems = links.length > 0
    ? links.map((link) => ({ key: link.id, label: link.title }))
    : [{ key: "w", label: "My Website" }, { key: "p", label: "Portfolio" }, { key: "c", label: "Contact" }];

  return (
    <div
      className="w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-border"
      style={{ minHeight: 400 }}
    >
      <div
        className="p-6 flex flex-col items-center gap-4 relative overflow-hidden"
        style={{
          ...(isGradient
            ? {
                backgroundImage: bg,
                ...(showGradientAnim
                  ? { backgroundSize: "200% 200%", animation: "gradient-shift 4s ease-in-out infinite" }
                  : {}),
              }
            : { backgroundColor: bg }),
          color: textColor,
          minHeight: 400,
        }}
      >
        {/* Particles in preview */}
        {animationType === "particles" && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: resolvedAccent,
                  width: `${6 + (i % 3) * 4}px`,
                  height: `${6 + (i % 3) * 4}px`,
                  left: `${10 + (i * 12) % 80}%`,
                  bottom: `-5%`,
                  filter: "blur(1px)",
                  opacity: 0,
                  animation: `profile-particle ${5 + (i % 3) * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
          </div>
        )}

        <div
          className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold relative z-10"
          style={{
            backgroundColor: resolvedAccent,
            ...(animationType === "float"
              ? { animation: "profile-avatar-float 4s ease-in-out infinite" }
              : {}),
          }}
        >
          {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
        </div>
        <div className="text-center relative z-10">
          <p className="font-bold">{profile.display_name || profile.username}</p>
          <p className="text-sm opacity-70">{profile.bio || "Your bio here"}</p>
        </div>
        <div className="w-full space-y-2 mt-2 relative z-10">
          {linkItems.map((item, i) => (
            <div
              key={item.key}
              className="w-full px-4 py-3 text-center text-sm font-medium"
              style={{
                backgroundColor: cardBg,
                color: cardTextColor,
                borderRadius: borderRadiusMap[buttonStyle] || "0.5rem",
                ...(animationType === "float"
                  ? {
                      animation: "profile-link-float 3s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    }
                  : {}),
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppearanceEditor({
  profile,
  themes,
  previewLinks,
}: {
  profile: Profile;
  themes: Theme[];
  previewLinks: Link[];
}) {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(
    profile.theme_id
  );
  const [accentColor, setAccentColor] = useState(profile.accent_color || "");
  const [backgroundOverride, setBackgroundOverride] = useState(
    profile.background_override || ""
  );
  const [buttonStyle, setButtonStyle] = useState(profile.button_style || "rounded");
  const [cardBgOverride, setCardBgOverride] = useState(profile.card_bg_override || "");
  const [cardTextOverride, setCardTextOverride] = useState(profile.card_text_override || "");
  const [animationType, setAnimationType] = useState<string>(profile.animation_type || "none");
  const [videoBackgroundUrl, setVideoBackgroundUrl] = useState(profile.video_background_url || "");
  const [cursorEffect, setCursorEffect] = useState<string>(profile.cursor_effect || "default");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const selectedTheme = themes.find((t) => t.id === selectedThemeId) || null;

  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        theme_id: selectedThemeId,
        accent_color: accentColor || null,
        background_override: backgroundOverride || null,
        button_style: buttonStyle,
        card_bg_override: cardBgOverride || null,
        card_text_override: cardTextOverride || null,
        animation_type: animationType,
        video_background_url: videoBackgroundUrl || null,
        cursor_effect: cursorEffect,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to save appearance");
    } else {
      toast.success("Appearance updated");
      // Trigger badge check
      fetch("/api/badges/check", { method: "POST" }).catch(() => {});
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => {
                const isSelected = theme.id === selectedThemeId;
                const isGradient = theme.background_value.includes("gradient");
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`relative rounded-xl p-4 text-left transition-all border-2 ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                    style={{
                      background: isGradient
                        ? theme.background_value
                        : theme.background_value,
                    }}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <span
                      className="text-sm font-medium"
                      style={{ color: theme.text_color }}
                    >
                      {theme.name}
                    </span>
                    <div className="mt-2 flex gap-1">
                      <div
                        className="h-2 w-8 rounded-full"
                        style={{ backgroundColor: theme.accent_color }}
                      />
                      <div
                        className="h-2 w-6 rounded-full"
                        style={{ backgroundColor: theme.card_bg }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor || selectedTheme?.accent_color || "#8b5cf6"}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="Theme default"
                  className="flex-1"
                />
                {accentColor && (
                  <Button variant="ghost" size="sm" onClick={() => setAccentColor("")}>
                    Reset
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Override</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundOverride || "#000000"}
                  onChange={(e) => setBackgroundOverride(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent"
                />
                <Input
                  value={backgroundOverride}
                  onChange={(e) => setBackgroundOverride(e.target.value)}
                  placeholder="Theme default"
                  className="flex-1"
                />
                {backgroundOverride && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBackgroundOverride("")}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Card Background</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cardBgOverride || selectedTheme?.card_bg || "#1a1a2e"}
                  onChange={(e) => setCardBgOverride(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent"
                />
                <Input
                  value={cardBgOverride}
                  onChange={(e) => setCardBgOverride(e.target.value)}
                  placeholder="Theme default"
                  className="flex-1"
                />
                {cardBgOverride && (
                  <Button variant="ghost" size="sm" onClick={() => setCardBgOverride("")}>
                    Reset
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Card Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cardTextOverride || selectedTheme?.card_text_color || "#ffffff"}
                  onChange={(e) => setCardTextOverride(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent"
                />
                <Input
                  value={cardTextOverride}
                  onChange={(e) => setCardTextOverride(e.target.value)}
                  placeholder="Theme default"
                  className="flex-1"
                />
                {cardTextOverride && (
                  <Button variant="ghost" size="sm" onClick={() => setCardTextOverride("")}>
                    Reset
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Page Animation</Label>
              <Select value={animationType} onValueChange={setAnimationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="gradient">Gradient Shift</SelectItem>
                  <SelectItem value="particles">Floating Particles</SelectItem>
                  <SelectItem value="float">Float Effect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Button Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["rounded", "pill", "sharp"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setButtonStyle(style)}
                    className={`px-4 py-2 text-sm font-medium border-2 transition-colors capitalize ${
                      buttonStyle === style
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                    style={{
                      borderRadius:
                        style === "rounded"
                          ? "0.5rem"
                          : style === "pill"
                            ? "9999px"
                            : "0",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cursor Effect</Label>
              <Select value={cursorEffect} onValueChange={setCursorEffect}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="sparkle">Sparkle Trail</SelectItem>
                  <SelectItem value="emoji_trail">Emoji Trail</SelectItem>
                  <SelectItem value="glow">Glow</SelectItem>
                  <SelectItem value="ring">Ring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Appearance"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={videoBackgroundUrl}
                onChange={(e) => setVideoBackgroundUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="video-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent transition-colors">
                  <Upload className="h-4 w-4" />
                  {uploadingVideo ? "Uploading..." : "Upload video"}
                </div>
              </Label>
              <input
                id="video-upload"
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                disabled={uploadingVideo}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("File must be under 10MB");
                    return;
                  }
                  setUploadingVideo(true);
                  const fileExt = file.name.split(".").pop();
                  const filePath = `${profile.id}/bg.${fileExt}`;
                  const { error: uploadError } = await supabase.storage
                    .from("videos")
                    .upload(filePath, file, { upsert: true });
                  if (uploadError) {
                    toast.error("Failed to upload video");
                    setUploadingVideo(false);
                    return;
                  }
                  const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(filePath);
                  setVideoBackgroundUrl(publicUrl);
                  toast.success("Video uploaded");
                  setUploadingVideo(false);
                }}
              />
              {videoBackgroundUrl && (
                <Button variant="ghost" size="sm" onClick={() => setVideoBackgroundUrl("")}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            {videoBackgroundUrl && (
              <video
                src={videoBackgroundUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full rounded-lg max-h-32 object-cover"
              />
            )}
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Appearance"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
          Preview
        </p>
        <ProfilePreview
          profile={profile}
          theme={selectedTheme}
          links={previewLinks}
          accentColor={accentColor}
          backgroundOverride={backgroundOverride}
          buttonStyle={buttonStyle}
          cardBgOverride={cardBgOverride}
          cardTextOverride={cardTextOverride}
          animationType={animationType}
        />
      </div>
    </div>
  );
}
