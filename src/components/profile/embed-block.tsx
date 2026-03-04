"use client";

import { useEffect, useRef } from "react";
import type { Link } from "@/types/database";
import { parseEmbedUrl } from "@/lib/embed-utils";

export function EmbedBlock({ link }: { link: Link }) {
  const parsed = parseEmbedUrl(link.url);
  if (!parsed) return null;

  switch (parsed.platform) {
    case "youtube":
      return <YouTubeEmbed embedUrl={parsed.embedUrl} title={link.title} />;
    case "spotify":
      return <SpotifyEmbed embedUrl={parsed.embedUrl} url={link.url} />;
    case "twitter":
      return <TwitterEmbed url={parsed.embedUrl} />;
    case "tiktok":
      return <TikTokEmbed embedUrl={parsed.embedUrl} title={link.title} />;
    case "soundcloud":
      return <SoundCloudEmbed embedUrl={parsed.embedUrl} title={link.title} />;
    default:
      return null;
  }
}

function YouTubeEmbed({ embedUrl, title }: { embedUrl: string; title: string }) {
  return (
    <div className="w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16/9" }}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}

function SpotifyEmbed({ embedUrl, url }: { embedUrl: string; url: string }) {
  const isTrack = url.includes("/track/");
  return (
    <div className="w-full overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full border-0"
        style={{ height: isTrack ? 80 : 380 }}
      />
    </div>
  );
}

function TwitterEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-lg">
      <blockquote className="twitter-tweet" data-theme="dark">
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  );
}

function TikTokEmbed({ embedUrl, title }: { embedUrl: string; title: string }) {
  return (
    <div className="flex justify-center w-full overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        title={title}
        allowFullScreen
        className="border-0"
        style={{ width: 325, height: 580 }}
      />
    </div>
  );
}

function SoundCloudEmbed({ embedUrl, title }: { embedUrl: string; title: string }) {
  return (
    <div className="w-full overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        title={title}
        scrolling="no"
        allow="autoplay"
        className="w-full border-0"
        style={{ height: 166 }}
      />
    </div>
  );
}
