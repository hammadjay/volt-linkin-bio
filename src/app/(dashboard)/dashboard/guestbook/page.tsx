import { createClient } from "@/lib/supabase/server";
import { GuestbookManager } from "@/components/dashboard/guestbook-manager";

export default async function GuestbookPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase
    .from("guestbook_entries")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <GuestbookManager initialEntries={entries ?? []} />;
}
