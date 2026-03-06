import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfilePage } from "@/components/profile/profile-page";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, avatar_url, seo_title, seo_description, seo_image")
    .eq("username", username)
    .single();

  if (!profile) {
    return { title: "Not Found" };
  }

  const title = profile.seo_title || `${profile.display_name || username} | Volt`;
  const description =
    profile.seo_description ||
    profile.bio ||
    `Check out ${profile.display_name || username}'s links on Volt`;
  const ogImage = profile.seo_image || profile.avatar_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, themes(*)")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  const now = new Date().toISOString();
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .or(`scheduled_start.is.null,scheduled_start.lte.${now}`)
    .or(`scheduled_end.is.null,scheduled_end.gte.${now}`)
    .order("sort_order", { ascending: true });

  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("user_id", profile.id)
    .order("sort_order", { ascending: true });

  // Fetch click counts if show_stats is enabled
  let clickCounts: Record<string, number> = {};
  if (profile.show_stats && links && links.length > 0) {
    const linkIds = links.map((l) => l.id);
    const { data: clicks } = await supabase
      .from("link_clicks")
      .select("link_id")
      .in("link_id", linkIds);

    if (clicks) {
      for (const click of clicks) {
        clickCounts[click.link_id] = (clickCounts[click.link_id] || 0) + 1;
      }
    }
  }

  // Fetch reactions
  const { data: reactions } = await supabase
    .from("profile_reactions")
    .select("*")
    .eq("user_id", profile.id);

  // Fetch guestbook entries if enabled
  let guestbookEntries = null;
  if (profile.show_guestbook) {
    const { data } = await supabase
      .from("guestbook_entries")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(50);
    guestbookEntries = data;
  }

  // Fetch badges
  const { data: allBadges } = await supabase
    .from("badges")
    .select("*");

  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("*")
    .eq("user_id", profile.id);

  // Fetch stickers
  const { data: stickers } = await supabase
    .from("profile_stickers")
    .select("*")
    .eq("user_id", profile.id)
    .order("sort_order", { ascending: true });

  return (
    <ProfilePage
      profile={profile}
      theme={profile.themes}
      links={links ?? []}
      socialLinks={socialLinks ?? []}
      clickCounts={clickCounts}
      reactions={reactions ?? []}
      guestbookEntries={guestbookEntries ?? []}
      badges={allBadges ?? []}
      userBadges={userBadges ?? []}
      stickers={stickers ?? []}
    />
  );
}
