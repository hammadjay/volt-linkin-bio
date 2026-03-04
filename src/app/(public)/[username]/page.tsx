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
    .select("display_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return { title: "Not Found" };
  }

  const title = `${profile.display_name || username} | Volt`;
  const description = profile.bio || `Check out ${profile.display_name || username}'s links on Volt`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
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

  return (
    <ProfilePage
      profile={profile}
      theme={profile.themes}
      links={links ?? []}
      socialLinks={socialLinks ?? []}
    />
  );
}
