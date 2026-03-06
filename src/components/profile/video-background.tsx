"use client";

import { useState, useEffect } from "react";

export function VideoBackground({ url }: { url: string }) {
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    // Check for slow connections
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") {
        setCanPlay(false);
      }
    }
  }, []);

  if (!canPlay) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0"
      style={{ pointerEvents: "none" }}
    >
      <source src={url} />
    </video>
  );
}
