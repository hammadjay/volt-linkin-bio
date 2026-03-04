import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LinkAnalyticsDetail } from "@/components/dashboard/link-analytics-detail";

interface Props {
  params: Promise<{ linkId: string }>;
}

export default async function LinkAnalyticsPage({ params }: Props) {
  const { linkId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verify link belongs to user
  const { data: link } = await supabase
    .from("links")
    .select("id, title, url")
    .eq("id", linkId)
    .eq("user_id", user!.id)
    .single();

  if (!link) {
    notFound();
  }

  // Fetch 30 days of clicks
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: clicks } = await supabase
    .from("link_clicks")
    .select("*")
    .eq("link_id", linkId)
    .gte("clicked_at", thirtyDaysAgo)
    .order("clicked_at", { ascending: true });

  // All-time count
  const { count: allTimeClicks } = await supabase
    .from("link_clicks")
    .select("*", { count: "exact", head: true })
    .eq("link_id", linkId);

  return (
    <div className="space-y-8">
      <div>
        <a
          href="/dashboard/analytics"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Analytics
        </a>
        <h1 className="text-3xl font-bold tracking-tight mt-2">
          {link.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm truncate">
          {link.url}
        </p>
      </div>

      <LinkAnalyticsDetail
        clicks={clicks ?? []}
        allTimeClicks={allTimeClicks ?? 0}
        linkTitle={link.title}
      />
    </div>
  );
}
