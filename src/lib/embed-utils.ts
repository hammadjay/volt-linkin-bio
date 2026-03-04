type EmbedPlatform = "youtube" | "spotify" | "twitter" | "tiktok" | "soundcloud";

interface EmbedResult {
  platform: EmbedPlatform;
  embedUrl: string;
}

export function parseEmbedUrl(url: string): EmbedResult | null {
  const platform = detectPlatform(url);
  if (!platform) return null;

  switch (platform) {
    case "youtube": {
      const videoId = extractYouTubeId(url);
      if (!videoId) return null;
      return { platform, embedUrl: `https://www.youtube.com/embed/${videoId}` };
    }
    case "spotify": {
      const match = url.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
      if (!match) return null;
      return { platform, embedUrl: `https://open.spotify.com/embed/${match[1]}/${match[2]}` };
    }
    case "twitter": {
      const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
      if (!match) return null;
      return { platform, embedUrl: url };
    }
    case "tiktok": {
      const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
      if (!match) return null;
      return { platform, embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}` };
    }
    case "soundcloud": {
      return { platform, embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false` };
    }
  }
}

export function detectPlatform(url: string): EmbedPlatform | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "youtube";
    if (hostname.includes("spotify.com")) return "spotify";
    if (hostname.includes("twitter.com") || hostname.includes("x.com")) return "twitter";
    if (hostname.includes("tiktok.com")) return "tiktok";
    if (hostname.includes("soundcloud.com")) return "soundcloud";
    return null;
  } catch {
    return null;
  }
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
