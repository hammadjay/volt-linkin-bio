import { createClient } from "@/lib/supabase/server";
import { StickerEditor } from "@/components/dashboard/sticker-editor";

export default async function StickersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: stickers } = await supabase
    .from("profile_stickers")
    .select("*")
    .eq("user_id", user!.id)
    .order("sort_order", { ascending: true });

  return <StickerEditor initialStickers={stickers ?? []} userId={user!.id} />;
}
