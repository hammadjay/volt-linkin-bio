"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Image as ImageIcon } from "lucide-react";
import type { Profile, Theme, Link } from "@/types/database";

type Template = "minimal" | "bold" | "gradient";
type CardSize = "story" | "social";

const SIZES: Record<CardSize, { w: number; h: number; label: string }> = {
  story: { w: 1080, h: 1920, label: "Instagram Story (1080x1920)" },
  social: { w: 1200, h: 630, label: "Social Card (1200x630)" },
};

export function ShareCardGenerator({
  profile,
  theme,
  topLinks,
}: {
  profile: Profile;
  theme: Theme | null;
  topLinks: Link[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState<Template>("minimal");
  const [size, setSize] = useState<CardSize>("story");
  const [rendering, setRendering] = useState(false);

  const bg = profile.background_override || theme?.background_value || "#0f0f23";
  const textColor = theme?.text_color || "#ffffff";
  const accentColor = profile.accent_color || theme?.accent_color || "#8b5cf6";

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { w, h } = SIZES[size];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    if (template === "bold") {
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, w, h);
    } else if (template === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, accentColor);
      grad.addColorStop(1, bg.includes("gradient") ? "#0f0f23" : bg);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Overlay
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = bg.includes("gradient") ? "#0f0f23" : bg;
      ctx.fillRect(0, 0, w, h);
    }

    const cx = w / 2;
    const isStory = size === "story";
    const scale = isStory ? 1 : 0.7;
    const yStart = isStory ? h * 0.25 : h * 0.15;

    // Avatar circle
    const avatarSize = 120 * scale;
    ctx.beginPath();
    ctx.arc(cx, yStart, avatarSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();

    // Initial letter
    const initial = (profile.display_name || profile.username)?.[0]?.toUpperCase() || "V";
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${48 * scale}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, cx, yStart);

    // Name
    const nameY = yStart + avatarSize / 2 + 40 * scale;
    ctx.fillStyle = template === "bold" ? "#ffffff" : textColor;
    ctx.font = `bold ${36 * scale}px Inter, sans-serif`;
    ctx.fillText(
      profile.display_name || profile.username,
      cx,
      nameY
    );

    // Bio
    if (profile.bio) {
      ctx.fillStyle = template === "bold" ? "rgba(255,255,255,0.8)" : `${textColor}cc`;
      ctx.font = `${20 * scale}px Inter, sans-serif`;
      const bioLines = wrapText(ctx, profile.bio, w * 0.7);
      bioLines.forEach((line, i) => {
        ctx.fillText(line, cx, nameY + 50 * scale + i * 28 * scale);
      });
    }

    // Top links
    const linksStartY = nameY + (profile.bio ? 120 : 60) * scale;
    const linkHeight = 50 * scale;
    const linkWidth = w * 0.6;
    const linkGap = 12 * scale;

    topLinks.slice(0, 3).forEach((link, i) => {
      const y = linksStartY + i * (linkHeight + linkGap);
      const radius = 12 * scale;

      ctx.beginPath();
      ctx.roundRect(cx - linkWidth / 2, y, linkWidth, linkHeight, radius);
      ctx.fillStyle = template === "bold" ? "rgba(255,255,255,0.2)" : `${accentColor}30`;
      ctx.fill();

      ctx.fillStyle = template === "bold" ? "#ffffff" : textColor;
      ctx.font = `${16 * scale}px Inter, sans-serif`;
      ctx.fillText(link.title, cx, y + linkHeight / 2);
    });

    // Branding
    ctx.fillStyle = template === "bold" ? "rgba(255,255,255,0.4)" : `${textColor}66`;
    ctx.font = `${14 * scale}px Inter, sans-serif`;
    ctx.fillText(`volt.app/${profile.username}`, cx, h - 60 * scale);
  }, [template, size, profile, theme, accentColor, bg, textColor, topLinks]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines.slice(0, 3);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setRendering(true);
    canvas.toBlob((blob) => {
      if (!blob) {
        setRendering(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `volt-${profile.username}-${template}-${size}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setRendering(false);
    }, "image/png");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Share Card</h1>
        <p className="text-muted-foreground mt-1">
          Generate a shareable image for your profile.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {(["minimal", "bold", "gradient"] as Template[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`p-4 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                      template === t
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {(Object.entries(SIZES) as [CardSize, typeof SIZES[CardSize]][]).map(
                  ([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setSize(key)}
                      className={`p-3 rounded-lg border-2 text-sm text-left transition-colors ${
                        size === key
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      {val.label}
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleDownload} disabled={rendering} className="w-full gap-2">
            <Download className="h-4 w-4" />
            {rendering ? "Generating..." : "Download PNG"}
          </Button>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-4 block text-center">
            Preview
          </Label>
          <div className="rounded-xl overflow-hidden border border-border">
            <canvas
              ref={canvasRef}
              className="w-full h-auto"
              style={{
                maxHeight: size === "story" ? 600 : 300,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
