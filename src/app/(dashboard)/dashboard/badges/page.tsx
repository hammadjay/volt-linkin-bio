import { createClient } from "@/lib/supabase/server";
import { BadgesPanel } from "@/components/dashboard/badges-panel";

export default async function BadgesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: badges } = await supabase
    .from("badges")
    .select("*")
    .order("name");

  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("*")
    .eq("user_id", user!.id);

  return (
    <BadgesPanel
      badges={badges ?? []}
      userBadges={userBadges ?? []}
    />
  );
}
