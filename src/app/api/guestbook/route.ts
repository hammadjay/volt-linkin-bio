import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, authorName, message } = await request.json();

  if (!userId || !authorName?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (authorName.trim().length > 50) {
    return NextResponse.json({ error: "Name too long" }, { status: 400 });
  }

  if (message.trim().length > 280) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("guestbook_entries")
    .insert({
      user_id: userId,
      author_name: authorName.trim(),
      message: message.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}
