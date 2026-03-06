import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, emoji } = await request.json();

  if (!userId || !emoji) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const allowedEmojis = ["🔥", "❤️", "⚡", "🎯", "💯", "🙌", "✨", "🫶"];
  if (!allowedEmojis.includes(emoji)) {
    return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("increment_reaction", {
    p_user_id: userId,
    p_emoji: emoji,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data });
}
