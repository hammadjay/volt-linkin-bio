"use client";

import { useEffect } from "react";
import type { Profile, Theme, Link, SocialLink } from "@/types/database";
import { SocialIcon } from "@/components/profile/social-icon";
import { EmbedBlock } from "@/components/profile/embed-block";

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
}: {
  profile: Profile;
  theme: Theme | null;
  links: Link[];
  socialLinks: SocialLink[];
}) {
  const bg =
    profile.background_override || theme?.background_value || "#0f0f23";
  const textColor = theme?.text_color || "#ffffff";
  const cardBg = theme?.card_bg || "rgba(255,255,255,0.08)";
  const cardTextColor = theme?.card_text_color || "#ffffff";
  const accentColor = profile.accent_color || theme?.accent_color || "#8b5cf6";
  const isGradient = bg.includes("gradient");

  const borderRadiusMap: Record<string, string> = {
    rounded: "0.75rem",
    pill: "9999px",
    sharp: "0",
  };
  const btnRadius = borderRadiusMap[profile.button_style] || "0.75rem";

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

  function handleLinkClick(linkId: string) {
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
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{
        background: isGradient ? bg : undefined,
        backgroundColor: !isGradient ? bg : undefined,
        color: textColor,
        fontFamily: theme?.font_family
          ? `"${theme.font_family}", sans-serif`
          : undefined,
      }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="h-24 w-24 rounded-full object-cover border-2"
              style={{ borderColor: accentColor }}
            />
          ) : (
            <div
              className="h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{ backgroundColor: accentColor }}
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

        {/* Links & Embeds */}
        <div className="space-y-3">
          {links.map((link) =>
            link.type === "embed" ? (
              <EmbedBlock key={link.id} link={link} />
            ) : (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="flex items-center gap-3 w-full px-5 py-4 text-center font-medium transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: cardBg,
                  color: cardTextColor,
                  borderRadius: btnRadius,
                  backdropFilter: "blur(10px)",
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
              </a>
            )
          )}
        </div>

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
    </div>
  );
}
