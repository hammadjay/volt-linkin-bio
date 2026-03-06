import { createClient } from "@/lib/supabase/server";
import { ShareCardGenerator } from "@/components/dashboard/share-card-generator";

export default async function ShareCardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, themes(*)")
    .eq("id", user!.id)
    .single();

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .eq("type", "link")
    .order("sort_order", { ascending: true })
    .limit(3);

  return (
    <ShareCardGenerator
      profile={profile!}
      theme={profile?.themes || null}
      topLinks={links ?? []}
    />
  );
}
