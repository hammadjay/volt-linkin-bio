import { createClient } from "@/lib/supabase/server";
import { StudioProvider } from "@/components/dashboard/studio/studio-context";
import { StudioClient } from "@/components/dashboard/studio/StudioClient";

export default async function StudioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("name", { ascending: true });

  return (
    <StudioProvider profile={profile!} themes={themes ?? []}>
      <StudioClient />
    </StudioProvider>
  );
}
