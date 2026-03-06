"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LiveVisitors({
  userId,
  textColor,
}: {
  userId: string;
  textColor: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`profile:${userId}`, {
      config: { presence: { key: Math.random().toString(36).slice(2) } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (count < 1) return null;

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mx-auto w-fit"
      style={{ backgroundColor: `${textColor}10`, color: textColor }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{
          backgroundColor: "#22c55e",
          animation: "live-pulse 2s ease-in-out infinite",
        }}
      />
      <span>
        {count} {count === 1 ? "person" : "people"} here now
      </span>
    </div>
  );
}
