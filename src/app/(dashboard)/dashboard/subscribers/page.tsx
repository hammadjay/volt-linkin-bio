import { createClient } from "@/lib/supabase/server";
import { SubscribersList } from "@/components/dashboard/subscribers-list";

export default async function SubscribersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .eq("user_id", user!.id)
    .order("subscribed_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
        <p className="text-muted-foreground mt-1">
          People who subscribed via your profile page.
        </p>
      </div>

      <SubscribersList initialSubscribers={subscribers ?? []} userId={user!.id} />
    </div>
  );
}
