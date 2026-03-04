import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkIcon, BarChart3, Eye, MousePointerClick } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: linkCount } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: clickCount } = await supabase
    .from("link_clicks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: viewCount } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const stats = [
    { label: "Total Links", value: linkCount ?? 0, icon: LinkIcon },
    { label: "Total Clicks", value: clickCount ?? 0, icon: MousePointerClick },
    { label: "Page Views", value: viewCount ?? 0, icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your Volt page performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/links">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LinkIcon className="h-4 w-4" />
                Manage Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add, edit, reorder, or remove links from your page.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/analytics">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track clicks, views, and referrers for your page.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
