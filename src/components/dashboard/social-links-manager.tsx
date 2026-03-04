"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { SocialLink } from "@/types/database";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PLATFORMS = [
  "instagram",
  "tiktok",
  "twitter",
  "youtube",
  "github",
  "linkedin",
  "twitch",
  "discord",
];

export function SocialLinksManager({
  initialLinks,
  userId,
}: {
  initialLinks: SocialLink[];
  userId: string;
}) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [newPlatform, setNewPlatform] = useState(PLATFORMS[0]);
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleAdd() {
    if (!newUrl.trim()) return;
    setAdding(true);

    const { data, error } = await supabase
      .from("social_links")
      .insert({
        user_id: userId,
        platform: newPlatform,
        url: newUrl.trim(),
        sort_order: links.length,
      })
      .select()
      .single();

    if (error || !data) {
      toast.error("Failed to add social link");
      setAdding(false);
      return;
    }

    setLinks((prev) => [...prev, data]);
    setNewUrl("");
    setAdding(false);
    toast.success("Social link added");
    router.refresh();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete social link");
      return;
    }
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success("Social link removed");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-3 rounded-lg border border-border p-3"
          >
            <span className="text-sm font-medium capitalize w-20 shrink-0">
              {link.platform}
            </span>
            <span className="text-sm text-muted-foreground truncate flex-1">
              {link.url}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(link.id)}
              className="text-destructive hover:text-destructive shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {links.length < 8 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm capitalize"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Input
              placeholder="https://instagram.com/yourname"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAdd} disabled={adding || !newUrl.trim()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
