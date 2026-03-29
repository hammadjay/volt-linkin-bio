"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Profile, Theme, Link, SocialLink, ProfileReaction, GuestbookEntry, Badge, UserBadge, ProfileSticker } from "@/types/database";
import { getHoverEffectProps } from "@/lib/button-hover-effects";
import { SocialIcon } from "@/components/profile/social-icon";
import { EmbedBlock } from "@/components/profile/embed-block";
import { ReactionBar } from "@/components/profile/reaction-bar";
import { Guestbook } from "@/components/profile/guestbook";
import { BadgeRow } from "@/components/profile/badge-row";
import { VideoBackground } from "@/components/profile/video-background";
import { MusicPlayer } from "@/components/profile/music-player";
import { CursorEffects } from "@/components/profile/cursor-effects";
import { StickerLayer } from "@/components/profile/sticker-layer";
import { LiveVisitors } from "@/components/profile/live-visitors";
import { ShieldAlert } from "lucide-react";

function loadFont(name: string | null | undefined) {
  if (!name || name === "Inter" || typeof document === "undefined") return;
  const id = `gf-${name.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

function getAvatarShapeStyle(shape: string | undefined): React.CSSProperties {
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

function AvatarDisplay({
  profile,
  accentColor,
  floatStyle,
}: {
  profile: Profile;
  accentColor: string;
  floatStyle: React.CSSProperties;
}) {
  const ringStyle = profile.avatar_ring_style || "none";
  const ringColor = profile.avatar_ring_color || accentColor;
  const effect = profile.avatar_effect || "none";
  const shape = profile.avatar_shape || "circle";

  const shapeStyle = getAvatarShapeStyle(shape);
  const glowStyle = effect === "glow"
    ? { boxShadow: `0 0 20px ${accentColor}60, 0 0 40px ${accentColor}30` }
    : {};
  const pulseAnim = effect === "pulse" ? { animation: "avatar-pulse 2s ease-in-out infinite" } : {};

  const ringEl = (() => {
    if (ringStyle === "none") return null;
    const base: React.CSSProperties = { position: "absolute", inset: -4, borderRadius: "50%" };
    if (ringStyle === "solid") return <div style={{ ...base, border: `2px solid ${ringColor}` }} />;
    if (ringStyle === "dashed") return <div style={{ ...base, border: `2px dashed ${ringColor}`, opacity: 0.8 }} />;
    if (ringStyle === "glow") return <div style={{ ...base, border: `1.5px solid ${ringColor}`, boxShadow: `0 0 12px ${ringColor}80, 0 0 24px ${ringColor}40` }} />;
    if (ringStyle === "gradient") return <div style={{ ...base, padding: 2, background: `linear-gradient(135deg, ${ringColor}, #EC4899)`, borderRadius: "50%" }} />;
    return null;
  })();

  return (
    <div className="relative" style={floatStyle}>
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.display_name || profile.username}
          className="h-24 w-24 object-cover"
          style={{ ...shapeStyle, ...glowStyle, ...pulseAnim }}
        />
      ) : (
        <div
          className="h-24 w-24 flex items-center justify-center text-3xl font-bold"
          style={{ backgroundColor: accentColor, ...shapeStyle, ...glowStyle, ...pulseAnim }}
        >
          {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
        </div>
      )}
      {ringEl}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function detectDeviceType(): "mobile" | "desktop" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(ua))
    return "mobile";
  return "desktop";
}

export function ProfilePage({
  profile,
  theme,
  links,
  socialLinks,
  clickCounts,
  reactions,
  guestbookEntries,
  badges,
  userBadges,
  stickers,
}: {
  profile: Profile;
  theme: Theme | null;
  links: Link[];
  socialLinks: SocialLink[];
  clickCounts: Record<string, number>;
  reactions: ProfileReaction[];
  guestbookEntries: GuestbookEntry[];
  badges: Badge[];
  userBadges: UserBadge[];
  stickers: ProfileSticker[];
}) {
  const [acknowledgedSensitive, setAcknowledgedSensitive] = useState<Set<string>>(new Set());
  const [sensitiveModal, setSensitiveModal] = useState<{ linkId: string; url: string } | null>(null);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const bg =
    profile.background_override || theme?.background_value || "#0f0f23";
  const textColor = theme?.text_color || "#ffffff";
  const cardBg = profile.card_bg_override || theme?.card_bg || "rgba(255,255,255,0.08)";
  const cardTextColor = profile.card_text_override || theme?.card_text_color || "#ffffff";
  const accentColor = profile.accent_color || theme?.accent_color || "#8b5cf6";
  const isGradient = bg.includes("gradient");

  // Button radius — new button_shape takes precedence over legacy button_style
  const buttonShapeRadius: Record<string, string> = {
    rounded: "12px",
    pill: "9999px",
    sharp: "0",
    squircle: "30%",
    tag: "4px",
    chip: "6px",
    "shadow-lift": "10px",
    underline: "0",
  };
  const legacyRadiusMap: Record<string, string> = {
    rounded: "0.75rem",
    pill: "9999px",
    sharp: "0",
  };
  const btnRadius =
    buttonShapeRadius[profile.button_shape] ||
    legacyRadiusMap[profile.button_style] ||
    "0.75rem";

  // Separate featured link and remaining links
  const featuredLink = links.find((l) => l.is_featured && l.type === "link");
  const remainingLinks = links.filter((l) => l !== featuredLink);

  // Load custom Google Fonts
  useEffect(() => {
    loadFont(profile.font_heading);
    loadFont(profile.font_body);
    loadFont(profile.font_buttons);
  }, [profile.font_heading, profile.font_body, profile.font_buttons]);

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        userId: profile.id,
        referrer: document.referrer || null,
        deviceType: detectDeviceType(),
      }),
    }).catch(() => {});
  }, [profile.id]);

  function trackAndOpen(linkId: string, url: string) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "link_click",
        linkId,
        userId: profile.id,
        referrer: document.referrer || null,
        deviceType: detectDeviceType(),
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleLinkClick(linkId: string, url: string, isSensitive: boolean) {
    if (isSensitive && !acknowledgedSensitive.has(linkId)) {
      setSensitiveModal({ linkId, url });
      return;
    }
    trackAndOpen(linkId, url);
  }

  function handleSensitiveConfirm() {
    if (!sensitiveModal) return;
    setAcknowledgedSensitive((prev) => new Set(prev).add(sensitiveModal.linkId));
    trackAndOpen(sensitiveModal.linkId, sensitiveModal.url);
    setSensitiveModal(null);
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    setSubscribing(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.id, email: subscribeEmail.trim() }),
      });
      if (res.ok) {
        setSubscribed(true);
      }
    } catch {
      // Silent fail
    }
    setSubscribing(false);
  }

  // Background type resolution
  const bgType = profile.bg_image_url
    ? "image"
    : profile.video_background_url
    ? "video"
    : isGradient
    ? "gradient"
    : "solid";

  // Content card helpers
  const cardMaxWidths: Record<string, string> = { sm: "360px", md: "448px", lg: "560px", full: "100%" };
  const cardPaddingValues: Record<string, string> = { sm: "1rem", md: "1.5rem", lg: "2.5rem" };
  const profileCardStyle = profile.card_style || "none";
  const profileCardBgOpacity = (profile.card_bg_opacity ?? 100) / 100;
  const profileCardBorderRadius = profile.card_border_radius ?? 24;

  const animationType = profile.animation_type || "none";
  const floatLinkStyle = animationType === "float"
    ? { animation: "profile-link-float 3s ease-in-out infinite" }
    : {};
  const floatAvatarStyle = animationType === "float"
    ? { animation: "profile-avatar-float 4s ease-in-out infinite" }
    : {};

  function renderLink(link: Link, isFeatured = false, index = 0) {
    if (link.type === "header") {
      return (
        <div key={link.id} className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px" style={{ backgroundColor: `${textColor}30` }} />
          <span
            className="text-xs font-semibold uppercase tracking-widest px-2"
            style={{ color: textColor, opacity: 0.6 }}
          >
            {link.title}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${textColor}30` }} />
        </div>
      );
    }

    if (link.type === "embed") {
      return <EmbedBlock key={link.id} link={link} />;
    }

    const clicks = clickCounts[link.id];

    const btnFontFamily = profile.font_buttons && profile.font_buttons !== "Inter"
      ? `"${profile.font_buttons}", sans-serif`
      : undefined;

    const extraBtnStyle: React.CSSProperties = (() => {
      const shape = profile.button_shape || profile.button_style;
      if (shape === "underline") return { backgroundColor: "transparent", borderBottom: `2px solid ${accentColor}`, borderRadius: 0, paddingLeft: 0, paddingRight: 0 };
      if (shape === "tag") return { borderLeft: `3px solid ${accentColor}`, textAlign: "left", paddingLeft: 12 };
      if (shape === "shadow-lift") return { boxShadow: `0 4px 12px ${accentColor}40` };
      return {};
    })();

    const hoverFx = getHoverEffectProps(profile.button_hover_effect || "scale", accentColor);

    return (
      <motion.button
        key={link.id}
        onClick={() => handleLinkClick(link.id, link.url, link.is_sensitive)}
        whileHover={hoverFx.whileHover as any}
        whileTap={hoverFx.whileTap as any}
        transition={hoverFx.transition}
        className={`flex items-center gap-3 w-full px-5 py-4 text-center font-medium cursor-pointer${hoverFx.className ? ` ${hoverFx.className}` : ""}`}
        style={{
          backgroundColor: isFeatured ? accentColor : cardBg,
          color: isFeatured ? "#ffffff" : cardTextColor,
          borderRadius: btnRadius,
          backdropFilter: "blur(10px)",
          fontFamily: btnFontFamily,
          ...(isFeatured
            ? { boxShadow: `0 0 20px ${accentColor}40, 0 0 40px ${accentColor}20` }
            : {}),
          ...extraBtnStyle,
          ...floatLinkStyle,
          ...(animationType === "float" ? { animationDelay: `${index * 0.15}s` } : {}),
        }}
      >
        {link.thumbnail_url && (
          <img
            src={link.thumbnail_url}
            alt=""
            className="h-8 w-8 rounded-md object-cover shrink-0"
          />
        )}
        <span className="flex-1">{link.title}</span>
        {profile.show_stats && clicks != null && clicks > 0 && (
          <span
            className="text-xs opacity-60"
            style={{ color: isFeatured ? "#ffffff" : cardTextColor }}
          >
            {clicks} {clicks === 1 ? "click" : "clicks"}
          </span>
        )}
      </motion.button>
    );
  }

  const showGradientAnim = animationType === "gradient" && bgType === "gradient";

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12 overflow-hidden relative"
      style={{
        ...(bgType === "image"
          ? {
              backgroundImage: `url(${profile.bg_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : bgType === "gradient"
          ? {
              backgroundImage: bg,
              ...(showGradientAnim
                ? { backgroundSize: "200% 200%", animation: "gradient-shift 4s ease-in-out infinite" }
                : {}),
            }
          : { backgroundColor: bg }),
        color: textColor,
        fontFamily: profile.font_body && profile.font_body !== "Inter"
          ? `"${profile.font_body}", sans-serif`
          : theme?.font_family
          ? `"${theme.font_family}", sans-serif`
          : undefined,
      }}
    >
      {/* Video Background */}
      {profile.video_background_url && (
        <VideoBackground url={profile.video_background_url} />
      )}

      {/* Cursor Effects */}
      {profile.cursor_effect && profile.cursor_effect !== "default" && (
        <CursorEffects effect={profile.cursor_effect} accentColor={accentColor} />
      )}

      {/* Sticker Layer */}
      {stickers.length > 0 && <StickerLayer stickers={stickers} />}

      {/* Particles layer */}
      {animationType === "particles" && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => {
            const size = 10 + (i % 5) * 8;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: accentColor,
                  opacity: 0,
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${3 + (i * 7) % 90}%`,
                  bottom: `${-2 - (i * 2) % 8}%`,
                  filter: `blur(${size > 20 ? 3 : 1}px)`,
                  animation: `profile-particle ${5 + (i % 4) * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Texture Overlay */}
      {profile.texture_type && profile.texture_type !== "none" && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: (() => {
              switch (profile.texture_type) {
                case "grain": return `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;
                case "dots": return `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`;
                case "grid": return `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`;
                case "diagonal": return `repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 8px)`;
                case "scanlines": return `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)`;
                default: return "none";
              }
            })(),
            backgroundSize: profile.texture_type === "dots" ? "16px 16px" : profile.texture_type === "grid" ? "32px 32px" : "auto",
            opacity: (profile.texture_opacity ?? 20) / 100,
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Background Overlay */}
      {(profile.bg_overlay_opacity ?? 0) > 0 && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundColor: profile.bg_overlay_color || "#000000",
            opacity: (profile.bg_overlay_opacity ?? 0) / 100,
          }}
        />
      )}

      {/* Content Card */}
      <div
        className={`w-full space-y-6 relative z-[2]${profileCardStyle === "image" ? " overflow-hidden" : ""}`}
        style={{
          maxWidth: cardMaxWidths[profile.card_max_width || "md"],
          ...(profileCardStyle !== "none" ? {
            padding: cardPaddingValues[profile.card_padding || "md"],
            borderRadius: `${profileCardBorderRadius}px`,
          } : {}),
          ...(profileCardStyle === "glass" ? {
            backgroundColor: "rgba(255,255,255,0.08)",
            backdropFilter: `blur(${profile.card_blur ?? 20}px)`,
            border: `1px solid ${profile.card_border_color || "rgba(255,255,255,0.15)"}`,
          } : profileCardStyle === "solid" ? {
            backgroundColor: cardBg.startsWith("#")
              ? hexToRgba(cardBg, profileCardBgOpacity)
              : cardBg,
            border: `1px solid ${profile.card_border_color || "transparent"}`,
          } : profileCardStyle === "outlined" ? {
            backgroundColor: "transparent",
            border: `1px solid ${profile.card_border_color || "rgba(255,255,255,0.3)"}`,
          } : profileCardStyle === "image" ? {
            border: `1px solid ${profile.card_border_color || "transparent"}`,
          } : {}),
          ...(profileCardStyle !== "none" && profile.card_shadow ? {
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          } : {}),
        }}
      >
        {/* Card image background layers */}
        {profileCardStyle === "image" && profile.card_bg_image_url && (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${profile.card_bg_image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: `${profileCardBorderRadius}px`,
                zIndex: -1,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: cardBg,
                opacity: profileCardBgOpacity,
                borderRadius: `${profileCardBorderRadius}px`,
                zIndex: -1,
              }}
            />
          </>
        )}
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <AvatarDisplay
            profile={profile}
            accentColor={accentColor}
            floatStyle={floatAvatarStyle}
          />
          <div className="text-center">
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: profile.font_heading && profile.font_heading !== "Inter"
                  ? `"${profile.font_heading}", sans-serif`
                  : undefined,
              }}
            >
              {profile.display_name || profile.username}
            </h1>

            {(profile.status_emoji || profile.status_text) && (
              <p className="text-sm mt-0.5 opacity-70">
                {profile.status_emoji} {profile.status_text}
              </p>
            )}

            {/* Live Visitors */}
            <LiveVisitors userId={profile.id} textColor={textColor} />

            {profile.bio && (
              <p className="text-sm mt-1 opacity-80">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Badge Row */}
        <BadgeRow
          badges={badges}
          userBadges={userBadges}
          accentColor={accentColor}
          textColor={textColor}
        />

        {/* Music Player */}
        {profile.music_url && (
          <MusicPlayer
            url={profile.music_url}
            accentColor={accentColor}
            textColor={textColor}
            cardBg={cardBg}
          />
        )}

        {/* Social Icons */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-3">
            {socialLinks.map((sl) => (
              <a
                key={sl.id}
                href={sl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-transform hover:scale-110"
                style={{ color: textColor }}
              >
                <SocialIcon platform={sl.platform} />
              </a>
            ))}
          </div>
        )}

        {/* Reaction Bar */}
        <ReactionBar
          profileId={profile.id}
          initialReactions={reactions}
          textColor={textColor}
        />

        {/* Featured Link */}
        {featuredLink && (
          <div className="space-y-3">
            {renderLink(featuredLink, true)}
          </div>
        )}

        {/* Links, Embeds & Headers */}
        <div className="space-y-3">
          {remainingLinks.map((link, i) => renderLink(link, false, i))}
        </div>

        {/* Email Signup */}
        {profile.show_email_signup && (
          <div
            className="rounded-xl p-5 text-center space-y-3"
            style={{
              backgroundColor: cardBg,
              color: cardTextColor,
              borderRadius: btnRadius,
            }}
          >
            {subscribed ? (
              <p className="text-sm font-medium">You&apos;re subscribed!</p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {profile.email_signup_text || "Subscribe to my newsletter!"}
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 rounded-lg text-sm bg-black/20 border border-white/10 outline-none placeholder:opacity-50"
                    style={{ color: cardTextColor }}
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: accentColor, color: "#ffffff" }}
                  >
                    {subscribing ? "..." : "Subscribe"}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* Guestbook */}
        {profile.show_guestbook && (
          <Guestbook
            profileId={profile.id}
            initialEntries={guestbookEntries}
            textColor={textColor}
            cardBg={cardBg}
            cardTextColor={cardTextColor}
            accentColor={accentColor}
            btnRadius={btnRadius}
          />
        )}

        {/* Made with Volt Footer */}
        <div className="text-center pt-8">
          <a
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-opacity"
            style={{
              color: textColor,
              opacity: 0.4,
              backgroundColor: `${textColor}08`,
              border: `1px solid ${textColor}10`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
          >
            <span>⚡</span>
            Made with Volt
          </a>
        </div>
      </div>

      {/* Sensitive Content Modal */}
      {sensitiveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            style={{ backgroundColor: cardBg, color: cardTextColor, backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center h-10 w-10 rounded-full shrink-0"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <ShieldAlert className="h-5 w-5" style={{ color: accentColor }} />
              </div>
              <div>
                <h3 className="font-semibold text-base">Sensitive Content</h3>
                <p className="text-sm opacity-70">This link may contain sensitive material</p>
              </div>
            </div>

            <div
              className="rounded-lg px-3 py-2 text-xs break-all opacity-60"
              style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
            >
              {sensitiveModal.url}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSensitiveModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", color: cardTextColor }}
              >
                Go back
              </button>
              <button
                onClick={handleSensitiveConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentColor, color: "#ffffff" }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
