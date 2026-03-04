"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MousePointerClick, TrendingUp } from "lucide-react";
import type { LinkClick } from "@/types/database";

const COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

type DateRange = "7d" | "30d";

export function LinkAnalyticsDetail({
  clicks,
  allTimeClicks,
  linkTitle,
}: {
  clicks: LinkClick[];
  allTimeClicks: number;
  linkTitle: string;
}) {
  const [range, setRange] = useState<DateRange>("30d");

  const cutoff = useMemo(() => {
    const now = new Date();
    return range === "7d"
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }, [range]);

  const filteredClicks = useMemo(
    () => clicks.filter((c) => new Date(c.clicked_at) >= cutoff),
    [clicks, cutoff]
  );

  // Clicks per day
  const dailyData = useMemo(() => {
    const days = range === "7d" ? 7 : 30;
    const data: { date: string; clicks: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const dayClicks = filteredClicks.filter(
        (c) => c.clicked_at.split("T")[0] === dateStr
      ).length;

      data.push({ date: label, clicks: dayClicks });
    }
    return data;
  }, [filteredClicks, range]);

  // Top referrers
  const referrers = useMemo(() => {
    const map = new Map<string, number>();
    filteredClicks.forEach((c) => {
      const ref = c.referrer || "Direct";
      try {
        const hostname = ref === "Direct" ? ref : new URL(ref).hostname;
        map.set(hostname, (map.get(hostname) || 0) + 1);
      } catch {
        map.set(ref, (map.get(ref) || 0) + 1);
      }
    });

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredClicks]);

  // Device breakdown
  const devices = useMemo(() => {
    const map = new Map<string, number>();
    filteredClicks.forEach((c) => {
      const device = c.device_type || "unknown";
      map.set(device, (map.get(device) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [filteredClicks]);

  return (
    <div className="space-y-6">
      {/* Date range selector */}
      <div className="flex gap-2">
        <Button
          variant={range === "7d" ? "default" : "outline"}
          size="sm"
          onClick={() => setRange("7d")}
        >
          Last 7 days
        </Button>
        <Button
          variant={range === "30d" ? "default" : "outline"}
          size="sm"
          onClick={() => setRange("30d")}
        >
          Last 30 days
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              All-Time Clicks
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{allTimeClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clicks ({range})
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredClicks.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Clicks over time */}
      <Card>
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClicks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No clicks in this period.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
                <Bar
                  dataKey="clicks"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  name="Clicks"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            {referrers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No referrer data yet.</p>
            ) : (
              <div className="space-y-3">
                {referrers.map((ref, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="truncate">{ref.name}</span>
                    <span className="text-muted-foreground font-medium">
                      {ref.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No device data yet.</p>
            ) : (
              <div className="flex items-center gap-8">
                <ResponsiveContainer width={150} height={150}>
                  <PieChart>
                    <Pie
                      data={devices}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      strokeWidth={2}
                    >
                      {devices.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                          stroke="hsl(var(--card))"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {devices.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span>
                        {d.name}: {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
