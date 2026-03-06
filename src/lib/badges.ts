import { SupabaseClient } from "@supabase/supabase-js";

export async function checkAndAwardBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  // Get existing badges
  const { data: existingBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  const earned = new Set((existingBadges || []).map((b) => b.badge_id));
  const newBadges: string[] = [];

  // Check each badge condition
  // 1. First Link
  if (!earned.has("first_link")) {
    const { count } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (count && count >= 1) newBadges.push("first_link");
  }

  // 2. Century (100+ clicks)
  if (!earned.has("century")) {
    const { count } = await supabase
      .from("link_clicks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (count && count >= 100) newBadges.push("century");
  }

  // 3. Viral (1000+ clicks)
  if (!earned.has("viral")) {
    const { count } = await supabase
      .from("link_clicks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (count && count >= 1000) newBadges.push("viral");
  }

  // 4. Customizer (changed theme)
  if (!earned.has("customizer")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("theme_id, accent_color, background_override")
      .eq("id", userId)
      .single();
    if (profile && (profile.theme_id || profile.accent_color || profile.background_override)) {
      newBadges.push("customizer");
    }
  }

  // 5. Social Butterfly (3+ social links)
  if (!earned.has("social_butterfly")) {
    const { count } = await supabase
      .from("social_links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (count && count >= 3) newBadges.push("social_butterfly");
  }

  // 6. OG (30+ days old)
  if (!earned.has("og")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("created_at")
      .eq("id", userId)
      .single();
    if (profile) {
      const age = Date.now() - new Date(profile.created_at).getTime();
      if (age >= 30 * 24 * 60 * 60 * 1000) newBadges.push("og");
    }
  }

  // 7. Popular (100+ page views)
  if (!earned.has("popular")) {
    const { count } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (count && count >= 100) newBadges.push("popular");
  }

  // 8. Collector (10+ links)
  if (!earned.has("collector")) {
    const { count } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (count && count >= 10) newBadges.push("collector");
  }

  // 9. Referrer (1+ referral)
  if (!earned.has("referrer")) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", userId);
    if (count && count >= 1) newBadges.push("referrer");
  }

  // 10. Ambassador (5+ referrals)
  if (!earned.has("ambassador")) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", userId);
    if (count && count >= 5) newBadges.push("ambassador");
  }

  // Insert new badges
  if (newBadges.length > 0) {
    await supabase.from("user_badges").insert(
      newBadges.map((badge_id) => ({
        user_id: userId,
        badge_id,
      }))
    );
  }

  return newBadges;
}
