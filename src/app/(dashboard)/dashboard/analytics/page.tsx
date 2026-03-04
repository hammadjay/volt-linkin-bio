import { createClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetch all clicks
  const { data: allClicks } = await supabase
    .from("link_clicks")
    .select("*")
    .eq("user_id", user!.id)
    .gte("clicked_at", thirtyDaysAgo.toISOString())
    .order("clicked_at", { ascending: true });

  // Fetch all page views
  const { data: allViews } = await supabase
    .from("page_views")
    .select("*")
    .eq("user_id", user!.id)
    .gte("viewed_at", thirtyDaysAgo.toISOString())
    .order("viewed_at", { ascending: true });

  // Fetch total counts
  const { count: totalClicks } = await supabase
    .from("link_clicks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: totalViews } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  // Fetch links for per-link breakdown
  const { data: links } = await supabase
    .from("links")
    .select("id, title")
    .eq("user_id", user!.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track how your Volt page is performing.
        </p>
      </div>

      <AnalyticsDashboard
        clicks={allClicks ?? []}
        pageViews={allViews ?? []}
        links={links ?? []}
        totalClicks={totalClicks ?? 0}
        totalViews={totalViews ?? 0}
      />
    </div>
  );
}
