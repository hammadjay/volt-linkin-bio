"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
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

function SortableSocialLinkItem({
  link,
  onDelete,
}: {
  link: SocialLink;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-border p-3 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium capitalize w-20 shrink-0">
        {link.platform}
      </span>
      <span className="text-sm text-muted-foreground truncate flex-1">
        {link.url}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(link.id)}
        className="text-destructive hover:text-destructive shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    // Trigger badge check
    fetch("/api/badges/check", { method: "POST" }).catch(() => {});
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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);

    const newLinks = arrayMove(links, oldIndex, newIndex);
    setLinks(newLinks);

    const updates = newLinks.map((link, index) => ({
      id: link.id,
      user_id: userId,
      platform: link.platform,
      url: link.url,
      sort_order: index,
    }));

    const { error } = await supabase.from("social_links").upsert(updates);
    if (error) {
      toast.error("Failed to save order");
      setLinks(links);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {links.map((link) => (
                  <SortableSocialLinkItem
                    key={link.id}
                    link={link}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

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
