import { createClient } from "@/lib/supabase/server";
import { AppearanceEditor } from "@/components/dashboard/appearance-editor";

export default async function AppearancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("name", { ascending: true });

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
        <p className="text-muted-foreground mt-1">
          Customize how your Volt page looks.
        </p>
      </div>

      <AppearanceEditor
        profile={profile!}
        themes={themes ?? []}
        previewLinks={links ?? []}
      />
    </div>
  );
}
