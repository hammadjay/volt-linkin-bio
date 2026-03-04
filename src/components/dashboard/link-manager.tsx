"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { GripVertical, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Link } from "@/types/database";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SortableLinkItem({
  link,
  onEdit,
  onDelete,
  onToggle,
}: {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
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
      className={`flex items-center gap-3 rounded-lg border border-border bg-card p-4 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      } ${!link.is_active ? "opacity-60" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {link.thumbnail_url && (
        <img
          src={link.thumbnail_url}
          alt=""
          className="h-10 w-10 rounded-md object-cover"
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{link.title}</p>
        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Switch
          checked={link.is_active}
          onCheckedChange={(checked) => onToggle(link.id, checked)}
        />
        <Button variant="ghost" size="icon" onClick={() => onEdit(link)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(link.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}

export function LinkManager({
  initialLinks,
  userId,
}: {
  initialLinks: Link[];
  userId: string;
}) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function openAddDialog() {
    setEditingLink(null);
    setTitle("");
    setUrl("");
    setThumbnailUrl("");
    setDialogOpen(true);
  }

  function openEditDialog(link: Link) {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setThumbnailUrl(link.thumbnail_url || "");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!title.trim() || !url.trim()) return;
    setSaving(true);

    if (editingLink) {
      const { error } = await supabase
        .from("links")
        .update({
          title: title.trim(),
          url: url.trim(),
          thumbnail_url: thumbnailUrl.trim() || null,
        })
        .eq("id", editingLink.id);

      if (error) {
        toast.error("Failed to update link");
        setSaving(false);
        return;
      }

      setLinks((prev) =>
        prev.map((l) =>
          l.id === editingLink.id
            ? { ...l, title: title.trim(), url: url.trim(), thumbnail_url: thumbnailUrl.trim() || null }
            : l
        )
      );
      toast.success("Link updated");
    } else {
      const newSortOrder = links.length;
      const { data, error } = await supabase
        .from("links")
        .insert({
          user_id: userId,
          title: title.trim(),
          url: url.trim(),
          thumbnail_url: thumbnailUrl.trim() || null,
          sort_order: newSortOrder,
        })
        .select()
        .single();

      if (error || !data) {
        toast.error("Failed to add link");
        setSaving(false);
        return;
      }

      setLinks((prev) => [...prev, data]);
      toast.success("Link added");
    }

    setDialogOpen(false);
    setSaving(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete link");
      return;
    }
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success("Link deleted");
    router.refresh();
  }

  async function handleToggle(id: string, active: boolean) {
    const { error } = await supabase
      .from("links")
      .update({ is_active: active })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update link");
      return;
    }
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, is_active: active } : l))
    );
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
      title: link.title,
      url: link.url,
      sort_order: index,
    }));

    const { error } = await supabase.from("links").upsert(updates);
    if (error) {
      toast.error("Failed to save order");
      setLinks(links);
    }
  }

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Link" : "Add New Link"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="link-title">Title</Label>
              <Input
                id="link-title"
                placeholder="My Website"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-thumb">Thumbnail URL (optional)</Label>
              <Input
                id="link-thumb"
                placeholder="https://example.com/image.png"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !title.trim() || !url.trim()}>
                {saving ? "Saving..." : editingLink ? "Update" : "Add Link"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">No links yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first link to get started.
          </p>
        </div>
      ) : (
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
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onEdit={openEditDialog}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
