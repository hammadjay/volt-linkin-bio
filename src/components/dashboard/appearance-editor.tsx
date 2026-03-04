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
import { Check } from "lucide-react";

function ProfilePreview({
  profile,
  theme,
  links,
  accentColor,
  backgroundOverride,
  buttonStyle,
}: {
  profile: Profile;
  theme: Theme | null;
  links: Link[];
  accentColor: string;
  backgroundOverride: string;
  buttonStyle: string;
}) {
  const bg = backgroundOverride || theme?.background_value || "#0f0f23";
  const textColor = theme?.text_color || "#ffffff";
  const cardBg = theme?.card_bg || "rgba(255,255,255,0.08)";
  const cardTextColor = theme?.card_text_color || "#ffffff";
  const isGradient = bg.includes("gradient");

  const borderRadiusMap: Record<string, string> = {
    rounded: "0.5rem",
    pill: "9999px",
    sharp: "0",
  };

  return (
    <div
      className="w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-border"
      style={{ minHeight: 400 }}
    >
      <div
        className="p-6 flex flex-col items-center gap-4"
        style={{
          background: isGradient ? bg : bg,
          backgroundColor: !isGradient ? bg : undefined,
          color: textColor,
          minHeight: 400,
        }}
      >
        <div
          className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold"
          style={{ backgroundColor: accentColor || theme?.accent_color || "#8b5cf6" }}
        >
          {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
        </div>
        <div className="text-center">
          <p className="font-bold">{profile.display_name || profile.username}</p>
          <p className="text-sm opacity-70">{profile.bio || "Your bio here"}</p>
        </div>
        <div className="w-full space-y-2 mt-2">
          {links.length > 0
            ? links.map((link) => (
                <div
                  key={link.id}
                  className="w-full px-4 py-3 text-center text-sm font-medium"
                  style={{
                    backgroundColor: cardBg,
                    color: cardTextColor,
                    borderRadius: borderRadiusMap[buttonStyle] || "0.5rem",
                  }}
                >
                  {link.title}
                </div>
              ))
            : ["My Website", "Portfolio", "Contact"].map((label) => (
                <div
                  key={label}
                  className="w-full px-4 py-3 text-center text-sm font-medium"
                  style={{
                    backgroundColor: cardBg,
                    color: cardTextColor,
                    borderRadius: borderRadiusMap[buttonStyle] || "0.5rem",
                  }}
                >
                  {label}
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
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to save appearance");
    } else {
      toast.success("Appearance updated");
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
        />
      </div>
    </div>
  );
}
