"use client";

import { useEffect, useState, useCallback } from "react";
import type { Profile, Theme, Link, SocialLink } from "@/types/database";
import { SocialIcon } from "@/components/profile/social-icon";
import { EmbedBlock } from "@/components/profile/embed-block";
import { ShieldAlert } from "lucide-react";

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
}: {
  profile: Profile;
  theme: Theme | null;
  links: Link[];
  socialLinks: SocialLink[];
  clickCounts: Record<string, number>;
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

  const borderRadiusMap: Record<string, string> = {
    rounded: "0.75rem",
    pill: "9999px",
    sharp: "0",
  };
  const btnRadius = borderRadiusMap[profile.button_style] || "0.75rem";

  // Separate featured link and remaining links
  const featuredLink = links.find((l) => l.is_featured && l.type === "link");
  const remainingLinks = links.filter((l) => l !== featuredLink);

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

    return (
      <button
        key={link.id}
        onClick={() => handleLinkClick(link.id, link.url, link.is_sensitive)}
        className="flex items-center gap-3 w-full px-5 py-4 text-center font-medium transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
        style={{
          backgroundColor: isFeatured ? accentColor : cardBg,
          color: isFeatured ? "#ffffff" : cardTextColor,
          borderRadius: btnRadius,
          backdropFilter: "blur(10px)",
          ...(isFeatured
            ? { boxShadow: `0 0 20px ${accentColor}40, 0 0 40px ${accentColor}20` }
            : {}),
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
      </button>
    );
  }

  const showGradientAnim = animationType === "gradient" && isGradient;

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12 overflow-hidden relative"
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
        fontFamily: theme?.font_family
          ? `"${theme.font_family}", sans-serif`
          : undefined,
      }}
    >
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

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="h-24 w-24 rounded-full object-cover border-2"
              style={{ borderColor: accentColor, ...floatAvatarStyle }}
            />
          ) : (
            <div
              className="h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{ backgroundColor: accentColor, ...floatAvatarStyle }}
            >
              {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="text-center">
            <h1 className="text-xl font-bold">
              {profile.display_name || profile.username}
            </h1>
            {profile.bio && (
              <p className="text-sm mt-1 opacity-80">{profile.bio}</p>
            )}
          </div>
        </div>

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

        {/* Footer */}
        <div className="text-center pt-8">
          <a
            href="/"
            className="text-xs opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: textColor }}
          >
            Powered by Volt
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
