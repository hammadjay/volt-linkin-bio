import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { SocialLinksManager } from "@/components/dashboard/social-links-manager";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("user_id", user!.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and account settings.
        </p>
      </div>

      <SettingsForm profile={profile!} userEmail={user!.email!} />

      <Separator />

      <SocialLinksManager
        initialLinks={socialLinks ?? []}
        userId={user!.id}
      />
    </div>
  );
}
