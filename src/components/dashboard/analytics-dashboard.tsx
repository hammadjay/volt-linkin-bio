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
import { MousePointerClick, Eye, TrendingUp, Globe } from "lucide-react";
import type { LinkClick, PageView } from "@/types/database";

const COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

type DateRange = "7d" | "30d";

export function AnalyticsDashboard({
  clicks,
  pageViews,
  links,
  totalClicks,
  totalViews,
}: {
  clicks: LinkClick[];
  pageViews: PageView[];
  links: { id: string; title: string }[];
  totalClicks: number;
  totalViews: number;
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

  const filteredViews = useMemo(
    () => pageViews.filter((v) => new Date(v.viewed_at) >= cutoff),
    [pageViews, cutoff]
  );

  // Clicks per day chart data
  const dailyData = useMemo(() => {
    const days = range === "7d" ? 7 : 30;
    const data: { date: string; clicks: number; views: number }[] = [];

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
      const dayViews = filteredViews.filter(
        (v) => v.viewed_at.split("T")[0] === dateStr
      ).length;

      data.push({ date: label, clicks: dayClicks, views: dayViews });
    }
    return data;
  }, [filteredClicks, filteredViews, range]);

  // Per-link breakdown
  const linkBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filteredClicks.forEach((c) => {
      map.set(c.link_id, (map.get(c.link_id) || 0) + 1);
    });

    return links
      .map((link) => ({
        name: link.title,
        clicks: map.get(link.id) || 0,
      }))
      .sort((a, b) => b.clicks - a.clicks);
  }, [filteredClicks, links]);

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalViews}</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Views ({range})
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredViews.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Clicks over time */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClicks.length === 0 && filteredViews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet. Share your page to start tracking.
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
                <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} name="Views" />
                <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Per-link breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Link</CardTitle>
          </CardHeader>
          <CardContent>
            {linkBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No click data yet.</p>
            ) : (
              <div className="space-y-3">
                {linkBreakdown.map((item, i) => {
                  const maxClicks = linkBreakdown[0]?.clicks || 1;
                  const pct = (item.clicks / maxClicks) * 100;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="truncate font-medium">{item.name}</span>
                        <span className="text-muted-foreground">{item.clicks}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

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
