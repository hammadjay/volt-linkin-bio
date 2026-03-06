"use client";

import {
  Link as LinkIcon,
  Target,
  Flame,
  Palette,
  Share2,
  Clock,
  Eye,
  Layers,
  UserPlus,
  Crown,
} from "lucide-react";
import type { Badge, UserBadge } from "@/types/database";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  link: LinkIcon,
  target: Target,
  flame: Flame,
  palette: Palette,
  "share-2": Share2,
  clock: Clock,
  eye: Eye,
  layers: Layers,
  "user-plus": UserPlus,
  crown: Crown,
};

export function BadgeRow({
  badges,
  userBadges,
  accentColor,
  textColor,
}: {
  badges: Badge[];
  userBadges: (UserBadge & { badges?: Badge })[];
  accentColor: string;
  textColor: string;
}) {
  const earnedIds = new Set(userBadges.map((ub) => ub.badge_id));
  const earnedBadges = badges.filter((b) => earnedIds.has(b.id));

  if (earnedBadges.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {earnedBadges.map((badge) => {
        const Icon = ICON_MAP[badge.icon] || Flame;
        return (
          <div
            key={badge.id}
            className="group relative flex items-center justify-center h-8 w-8 rounded-full transition-transform hover:scale-110"
            style={{ backgroundColor: `${accentColor}30` }}
            title={`${badge.name} — ${badge.description}`}
          >
            <span style={{ color: accentColor }}><Icon className="h-4 w-4" /></span>
            <div
              className="absolute bottom-full mb-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
              style={{ backgroundColor: accentColor, color: "#ffffff" }}
            >
              {badge.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
