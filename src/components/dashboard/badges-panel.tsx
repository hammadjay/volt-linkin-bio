"use client";

import { useEffect, useState } from "react";
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
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function BadgesPanel({
  badges,
  userBadges,
}: {
  badges: Badge[];
  userBadges: UserBadge[];
}) {
  const earnedIds = new Set(userBadges.map((ub) => ub.badge_id));
  const [checking, setChecking] = useState(false);
  const [newlyEarned, setNewlyEarned] = useState<string[]>([]);

  useEffect(() => {
    // Auto-check badges on mount
    setChecking(true);
    fetch("/api/badges/check", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        if (data.newBadges?.length > 0) {
          setNewlyEarned(data.newBadges);
          data.newBadges.forEach((id: string) => earnedIds.add(id));
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Badges</h1>
        <p className="text-muted-foreground mt-1">
          {earnedIds.size} of {badges.length} badges earned
          {checking && " — checking..."}
        </p>
      </div>

      {newlyEarned.length > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-yellow-500">
              New badges unlocked: {newlyEarned.map((id) => badges.find((b) => b.id === id)?.name).join(", ")}!
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => {
          const isEarned = earnedIds.has(badge.id);
          const Icon = ICON_MAP[badge.icon] || Flame;
          const ub = userBadges.find((u) => u.badge_id === badge.id);

          return (
            <Card
              key={badge.id}
              className={isEarned ? "" : "opacity-50"}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      isEarned ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    {isEarned ? (
                      <Icon className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{badge.name}</CardTitle>
                    <p className="text-xs text-muted-foreground capitalize">{badge.category}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
                {isEarned && ub && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Earned {new Date(ub.unlocked_at).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
