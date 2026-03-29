"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Globe, Music, Sparkles } from "lucide-react";
import { useStudio } from "./studio-context";
import { loadGoogleFont } from "./studio-fonts";
import { getHoverEffectProps } from "@/lib/button-hover-effects";
import { cn } from "@/lib/utils";

// ── Texture patterns ─────────────────────────────────────────
function getTextureBg(type: string): string {
  switch (type) {
    case "grain":
      return `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;
    case "dots":
      return `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`;
    case "grid":
      return `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`;
    case "diagonal":
      return `repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 8px)`;
    case "scanlines":
      return `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)`;
    default:
      return "none";
  }
}

function getTextureBgSize(type: string): string {
  switch (type) {
    case "dots": return "16px 16px";
    case "grid": return "32px 32px";
    default: return "auto";
  }
}

// ── Avatar shape ─────────────────────────────────────────────
function getAvatarClipPath(shape: string): React.CSSProperties {
  switch (shape) {
    case "hexagon":
      return { clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" };
    case "diamond":
      return { clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" };
    case "rounded-square":
      return { borderRadius: "20%" };
    case "squircle":
      return { borderRadius: "30%" };
    default:
      return { borderRadius: "50%" };
  }
}

// ── Button shape radius ───────────────────────────────────────
function getButtonRadius(shape: string): string {
  const map: Record<string, string> = {
    rounded: "12px",
    pill: "9999px",
    sharp: "0",
    squircle: "30%",
    tag: "4px",
    chip: "6px",
    "shadow-lift": "10px",
    underline: "0",
  };
  return map[shape] ?? "12px";
}

// ── Avatar ring ───────────────────────────────────────────────
function AvatarRing({
  ringStyle,
  ringColor,
  size,
}: {
  ringStyle: string;
  ringColor: string;
  size: number;
}) {
  if (ringStyle === "none") return null;
  const base: React.CSSProperties = {
    position: "absolute",
    inset: -4,
    borderRadius: "50%",
  };
  if (ringStyle === "solid") {
    return <div style={{ ...base, border: `2px solid ${ringColor}` }} />;
  }
  if (ringStyle === "dashed") {
    return <div style={{ ...base, border: `2px dashed ${ringColor}`, opacity: 0.8 }} />;
  }
  if (ringStyle === "glow") {
    return <div style={{ ...base, border: `1.5px solid ${ringColor}`, boxShadow: `0 0 12px ${ringColor}80, 0 0 24px ${ringColor}40` }} />;
  }
  if (ringStyle === "gradient") {
    return <div style={{ ...base, padding: 2, background: `linear-gradient(135deg, ${ringColor}, #EC4899)`, borderRadius: "50%" }}>
      <div style={{ borderRadius: "50%", width: "100%", height: "100%", backgroundColor: "transparent" }} />
    </div>;
  }
  if (ringStyle === "rotating") {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ ...base, padding: 2, background: `conic-gradient(${ringColor}, transparent, ${ringColor})`, borderRadius: "50%" }}
      />
    );
  }
  return null;
}

// ── Main canvas ───────────────────────────────────────────────
export function StudioCanvas() {
  const { state, selectedTheme, profileDisplayName, profileBio, profileAvatarUrl, previewMode } = useStudio();
  const prefersReducedMotion = useReducedMotion();

  // Load Google Fonts when selected
  useEffect(() => {
    loadGoogleFont(state.font_heading);
    loadGoogleFont(state.font_body);
    loadGoogleFont(state.font_buttons);
  }, [state.font_heading, state.font_body, state.font_buttons]);

  const bg = state.background_override || selectedTheme?.background_value || "#0f0f23";
  const textColor = selectedTheme?.text_color || "#ffffff";
  const cardBg = state.card_bg_override || selectedTheme?.card_bg || "rgba(255,255,255,0.08)";
  const cardTextColor = state.card_text_override || selectedTheme?.card_text_color || "#ffffff";
  const accentColor = state.accent_color || selectedTheme?.accent_color || "#8b5cf6";
  const isGradient = bg.includes("gradient");

  const paddingMap: Record<string, string> = { sm: "12px", md: "18px", lg: "28px" };
  const widthMap: Record<string, string> = { sm: "200px", md: "260px", lg: "300px", full: "100%" };
  const btnRadius = getButtonRadius(state.button_shape || state.button_style);

  const cardStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      borderRadius: `${state.card_border_radius}px`,
      padding: paddingMap[state.card_padding] ?? "18px",
      width: "100%",
      maxWidth: widthMap[state.card_max_width] ?? "260px",
      boxShadow: state.card_shadow ? "0 12px 32px rgba(0,0,0,0.4)" : "none",
    };
    switch (state.card_style) {
      case "glass":
        return { ...base, backgroundColor: `rgba(255,255,255,${(state.card_bg_opacity / 100) * 0.12})`, backdropFilter: `blur(${state.card_blur}px)`, border: `1px solid ${state.card_border_color || "rgba(255,255,255,0.12)"}` };
      case "solid":
        return { ...base, backgroundColor: cardBg, border: `1px solid ${state.card_border_color || "transparent"}` };
      case "outlined":
        return { ...base, backgroundColor: "transparent", border: `1px solid ${state.card_border_color || "rgba(255,255,255,0.3)"}` };
      default:
        return { ...base };
    }
  })();

  const sampleLinks = [
    { label: "My Portfolio", featured: false },
    { label: "Latest Video", featured: false },
    { label: "Shop Merch", featured: false },
  ];

  const floatAnim = !prefersReducedMotion && state.animation_type === "float";
  const showParticles = !prefersReducedMotion && state.animation_type === "particles";
  const hoverProps = getHoverEffectProps(state.button_hover_effect, accentColor);

  // Canvas size
  const canvasWidths = { mobile: 320, tablet: 420, desktop: 560 };
  const canvasW = canvasWidths[previewMode];

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Phone/Browser frame */}
      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: canvasW }}
        className="relative"
      >
        {/* Frame outer */}
        <div
          className={cn(
            "relative overflow-hidden border border-white/15 shadow-2xl shadow-black/60",
            previewMode === "mobile" ? "rounded-[2rem]" : previewMode === "tablet" ? "rounded-[1.5rem]" : "rounded-xl"
          )}
          style={{ minHeight: previewMode === "desktop" ? 400 : 580 }}
        >
          {/* Notch (mobile only) */}
          {previewMode === "mobile" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-20 h-1.5 bg-black/60 rounded-full" />
          )}
          {/* Browser bar (desktop) */}
          {previewMode === "desktop" && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border-b border-white/[0.06]">
              <div className="flex gap-1">
                {["bg-red-500", "bg-yellow-400", "bg-green-500"].map((c) => (
                  <div key={c} className={`h-2.5 w-2.5 rounded-full ${c} opacity-60`} />
                ))}
              </div>
              <div className="flex-1 bg-white/[0.05] rounded text-[9px] text-white/30 text-center py-0.5 font-mono">
                volt.app/{profileDisplayName.toLowerCase()}
              </div>
            </div>
          )}

          {/* Profile content */}
          <div
            className="relative flex flex-col items-center overflow-hidden"
            style={{
              ...(isGradient ? { backgroundImage: bg } : { backgroundColor: bg }),
              ...((!prefersReducedMotion && state.animation_type === "gradient" && isGradient) ? { backgroundSize: "200% 200%", animation: "gradient-shift 4s ease-in-out infinite" } : {}),
              color: textColor,
              fontFamily: state.font_body !== "Inter" ? `"${state.font_body}", sans-serif` : undefined,
              minHeight: previewMode === "desktop" ? 360 : 530,
              paddingTop: previewMode === "mobile" ? "2.5rem" : "1.5rem",
              paddingBottom: "1.5rem",
            }}
          >
            {/* Texture overlay */}
            {state.texture_type !== "none" && (
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage: getTextureBg(state.texture_type),
                  backgroundSize: getTextureBgSize(state.texture_type),
                  opacity: state.texture_opacity / 100,
                  mixBlendMode: "overlay",
                }}
              />
            )}

            {/* Particles */}
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      backgroundColor: accentColor,
                      width: `${6 + (i % 3) * 4}px`,
                      height: `${6 + (i % 3) * 4}px`,
                      left: `${10 + (i * 12) % 80}%`,
                      bottom: "-5%",
                      filter: "blur(1px)",
                      opacity: 0,
                      animation: `profile-particle ${5 + (i % 3) * 2}s ease-in-out infinite`,
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Card or plain */}
            <div
              className="relative z-10 flex flex-col items-center w-full px-4"
              style={state.card_style !== "none" ? {} : { padding: "0 16px" }}
            >
              <div style={state.card_style !== "none" ? cardStyle : { width: "100%", maxWidth: widthMap[state.card_max_width] }}>
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <motion.div
                    className="relative"
                    animate={floatAnim ? { y: [0, -6, 0] } : {}}
                    transition={floatAnim ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
                  >
                    <div
                      className="h-16 w-16 flex items-center justify-center text-lg font-bold text-white overflow-hidden"
                      style={{
                        background: profileAvatarUrl ? "transparent" : `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                        ...getAvatarClipPath(state.avatar_shape),
                        animation: state.avatar_effect === "pulse" && !prefersReducedMotion ? "avatar-pulse 2s ease-in-out infinite" : undefined,
                        boxShadow: state.avatar_effect === "glow" ? `0 0 20px ${accentColor}60, 0 0 40px ${accentColor}30` : undefined,
                      }}
                    >
                      {profileAvatarUrl ? (
                        <img src={profileAvatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        profileDisplayName?.[0]?.toUpperCase()
                      )}
                    </div>
                    <AvatarRing ringStyle={state.avatar_ring_style} ringColor={state.avatar_ring_color} size={64} />
                  </motion.div>

                  <div className="text-center">
                    <p
                      className="font-bold text-sm"
                      style={{
                        color: textColor,
                        fontFamily: state.font_heading !== "Inter" ? `"${state.font_heading}", sans-serif` : undefined,
                      }}
                    >
                      {profileDisplayName}
                    </p>
                    {(state.status_emoji || state.status_text) && (
                      <p className="text-[10px] mt-0.5" style={{ color: `${textColor}80` }}>
                        {state.status_emoji} {state.status_text}
                      </p>
                    )}
                    {profileBio && (
                      <p className="text-[10px] mt-1 leading-relaxed" style={{ color: `${textColor}70`, maxWidth: 220 }}>
                        {profileBio.length > 70 ? profileBio.slice(0, 70) + "…" : profileBio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-2 w-full">
                  {sampleLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      animate={floatAnim ? { y: [0, -3, 0] } : {}}
                      transition={
                        floatAnim
                          ? { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
                          : hoverProps.transition
                      }
                      whileHover={hoverProps.whileHover as any}
                      whileTap={hoverProps.whileTap as any}
                      className={cn("w-full px-4 py-2.5 text-center text-xs font-medium overflow-hidden cursor-pointer", hoverProps.className)}
                      style={{
                        backgroundColor: cardBg,
                        color: cardTextColor,
                        borderRadius: btnRadius,
                        fontFamily: state.font_buttons !== "Inter" ? `"${state.font_buttons}", sans-serif` : undefined,
                        backdropFilter: "blur(10px)",
                        ...(state.button_shape === "underline" ? {
                          backgroundColor: "transparent",
                          borderBottom: `2px solid ${accentColor}`,
                          borderRadius: 0,
                          paddingLeft: 0,
                          paddingRight: 0,
                        } : {}),
                        ...(state.button_shape === "tag" ? {
                          borderLeft: `3px solid ${accentColor}`,
                          textAlign: "left",
                          paddingLeft: 12,
                        } : {}),
                        ...(state.button_shape === "shadow-lift" ? {
                          boxShadow: `0 4px 12px ${accentColor}40`,
                          transform: "translateY(-1px)",
                        } : {}),
                      }}
                    >
                      {link.label}
                    </motion.div>
                  ))}
                </div>

                {/* Embed preview */}
                <div className="mt-3 rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.03]" style={{ aspectRatio: "16/9" }}>
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/10 to-transparent">
                    <div className="h-7 w-7 rounded-full bg-red-500/70 flex items-center justify-center">
                      <Play className="h-3.5 w-3.5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Social row */}
                <div className="flex justify-center gap-2 mt-3">
                  {[Globe, Sparkles, Music].map((Icon, i) => (
                    <div key={i} className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                      <Icon className="h-3 w-3" style={{ color: `${accentColor}` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div className="absolute -inset-x-4 bottom-0 h-12 bg-gradient-to-t from-[#020203] to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}
