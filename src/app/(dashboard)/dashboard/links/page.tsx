import { createClient } from "@/lib/supabase/server";
import { LinkManager } from "@/components/dashboard/link-manager";
import { SocialLinksManager } from "@/components/dashboard/social-links-manager";
import { Separator } from "@/components/ui/separator";

export default async function LinksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user!.id)
    .order("sort_order", { ascending: true });

  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("user_id", user!.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Links</h1>
        <p className="text-muted-foreground mt-1">
          Manage the links on your Volt page.
        </p>
      </div>

      <LinkManager initialLinks={links ?? []} userId={user!.id} />

      <Separator />

      <SocialLinksManager
        initialLinks={socialLinks ?? []}
        userId={user!.id}
      />
    </div>
  );
}
