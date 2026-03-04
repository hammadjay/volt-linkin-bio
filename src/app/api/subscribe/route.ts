import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, email } = body;

  if (!userId || !email) {
    return NextResponse.json({ error: "Missing userId or email" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const supabase = await createClient();

  // Verify user has email signup enabled
  const { data: profile } = await supabase
    .from("profiles")
    .select("show_email_signup")
    .eq("id", userId)
    .single();

  if (!profile?.show_email_signup) {
    return NextResponse.json({ error: "Email signup not enabled" }, { status: 400 });
  }

  const { error } = await supabase
    .from("subscribers")
    .insert({ user_id: userId, email: email.toLowerCase().trim() });

  // Unique violation means already subscribed — treat as success
  if (error && !error.message.includes("duplicate")) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
