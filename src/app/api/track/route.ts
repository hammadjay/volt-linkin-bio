import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, linkId, userId, referrer, deviceType, userAgent } = body;

    const supabase = await createClient();

    if (type === "link_click" && linkId) {
      await supabase.from("link_clicks").insert({
        link_id: linkId,
        user_id: userId,
        referrer: referrer || null,
        device_type: deviceType || "desktop",
        user_agent: userAgent || null,
      });
    } else if (type === "page_view" && userId) {
      await supabase.from("page_views").insert({
        user_id: userId,
        referrer: referrer || null,
        device_type: deviceType || null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
