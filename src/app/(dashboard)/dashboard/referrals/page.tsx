import { createClient } from "@/lib/supabase/server";
import { ReferralPanel } from "@/components/dashboard/referral-panel";

export default async function ReferralsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", user!.id)
    .single();

  const { count: referralCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("referred_by", user!.id);

  const { data: rewards } = await supabase
    .from("referral_rewards")
    .select("*")
    .eq("user_id", user!.id)
    .order("unlocked_at", { ascending: false });

  return (
    <ReferralPanel
      referralCode={profile?.referral_code || ""}
      referralCount={referralCount ?? 0}
      rewards={rewards ?? []}
    />
  );
}
