import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { referralCode } = await request.json();

  if (!referralCode) {
    return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the referrer by code
  const { data: referrer } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", referralCode)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
  }

  // Don't allow self-referral
  if (referrer.id === user.id) {
    return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
  }

  // Check if user is already referred
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("referred_by")
    .eq("id", user.id)
    .single();

  if (currentProfile?.referred_by) {
    return NextResponse.json({ error: "Already referred" }, { status: 400 });
  }

  // Set the referred_by field
  await supabase
    .from("profiles")
    .update({ referred_by: referrer.id })
    .eq("id", user.id);

  // Count total referrals for the referrer
  const { count: referralCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("referred_by", referrer.id);

  // Check reward tiers
  const rewards: { type: string; value: string }[] = [];

  if (referralCount && referralCount >= 1) {
    // Check if "Referrer" badge already awarded
    const { data: existingBadge } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", referrer.id)
      .eq("badge_id", "referrer")
      .single();

    if (!existingBadge) {
      await supabase.from("user_badges").insert({
        user_id: referrer.id,
        badge_id: "referrer",
      });
      rewards.push({ type: "badge", value: "referrer" });
    }
  }

  if (referralCount && referralCount >= 3) {
    // Check if premium theme reward already given
    const { data: existingReward } = await supabase
      .from("referral_rewards")
      .select("id")
      .eq("user_id", referrer.id)
      .eq("reward_type", "premium_theme")
      .single();

    if (!existingReward) {
      await supabase.from("referral_rewards").insert({
        user_id: referrer.id,
        reward_type: "premium_theme",
        reward_value: "Unlocked premium theme",
      });
      rewards.push({ type: "premium_theme", value: "Unlocked premium theme" });
    }
  }

  if (referralCount && referralCount >= 5) {
    // Check if "Ambassador" badge already awarded
    const { data: existingBadge } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", referrer.id)
      .eq("badge_id", "ambassador")
      .single();

    if (!existingBadge) {
      await supabase.from("user_badges").insert({
        user_id: referrer.id,
        badge_id: "ambassador",
      });
      rewards.push({ type: "badge", value: "ambassador" });
    }
  }

  return NextResponse.json({ success: true, rewards });
}
