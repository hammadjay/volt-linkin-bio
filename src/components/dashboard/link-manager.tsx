"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { GripVertical, Plus, Pencil, Trash2, ExternalLink, Clock, X, Star, Type, Globe, ShieldAlert } from "lucide-react";
import type { Link } from "@/types/database";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { detectPlatform } from "@/lib/embed-utils";

type EmbedPlatform = "youtube" | "spotify" | "twitter" | "tiktok" | "soundcloud";

function getScheduleStatus(link: Link): { label: string; variant: "outline" | "destructive" | "default" } | null {
  if (!link.scheduled_start && !link.scheduled_end) return null;
  const now = new Date();
  if (link.scheduled_start && new Date(link.scheduled_start) > now) {
    return { label: "Scheduled", variant: "outline" };
  }
  if (link.scheduled_end && new Date(link.scheduled_end) < now) {
    return { label: "Expired", variant: "destructive" };
  }
  return { label: "Live", variant: "default" };
}

function SortableLinkItem({
  link,
  onEdit,
  onDelete,
  onToggle,
  onToggleFeatured,
}: {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onToggleFeatured: (id: string, currentlyFeatured: boolean) => void;
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

  const scheduleStatus = link.type !== "header" ? getScheduleStatus(link) : null;

  // Header rendering
  if (link.type === "header") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/50 p-3 ${
          isDragging ? "opacity-50 shadow-lg" : ""
        }`}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <Type className="h-4 w-4 text-muted-foreground shrink-0" />
        <p className="flex-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {link.title}
        </p>
        <div className="flex items-center gap-2 shrink-0">
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
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{link.title}</p>
          {link.type === "embed" && link.embed_platform && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {link.embed_platform}
            </Badge>
          )}
          {link.is_featured && (
            <Badge variant="default" className="shrink-0 text-xs bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
              Featured
            </Badge>
          )}
          {link.is_sensitive && (
            <Badge variant="outline" className="shrink-0 text-xs">
              <ShieldAlert className="mr-1 h-3 w-3" />
              Sensitive
            </Badge>
          )}
          {scheduleStatus && (
            <Badge variant={scheduleStatus.variant} className="shrink-0 text-xs">
              <Clock className="mr-1 h-3 w-3" />
              {scheduleStatus.label}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {link.type === "link" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFeatured(link.id, link.is_featured)}
            title={link.is_featured ? "Remove featured" : "Set as featured"}
          >
            <Star className={`h-4 w-4 ${link.is_featured ? "fill-yellow-500 text-yellow-500" : ""}`} />
          </Button>
        )}
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
  const [scheduledStart, setScheduledStart] = useState<Date | null>(null);
  const [scheduledEnd, setScheduledEnd] = useState<Date | null>(null);
  const [linkType, setLinkType] = useState<"link" | "embed" | "header">("link");
  const [embedPlatform, setEmbedPlatform] = useState<EmbedPlatform | "">("");
  const [isSensitive, setIsSensitive] = useState(false);
  const [fetchingOg, setFetchingOg] = useState(false);
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
    setScheduledStart(null);
    setScheduledEnd(null);
    setLinkType("link");
    setEmbedPlatform("");
    setIsSensitive(false);
    setDialogOpen(true);
  }

  function openAddHeaderDialog() {
    setEditingLink(null);
    setTitle("");
    setUrl("");
    setThumbnailUrl("");
    setScheduledStart(null);
    setScheduledEnd(null);
    setLinkType("header");
    setEmbedPlatform("");
    setIsSensitive(false);
    setDialogOpen(true);
  }

  function openEditDialog(link: Link) {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setThumbnailUrl(link.thumbnail_url || "");
    setScheduledStart(link.scheduled_start ? new Date(link.scheduled_start) : null);
    setScheduledEnd(link.scheduled_end ? new Date(link.scheduled_end) : null);
    setLinkType(link.type);
    setEmbedPlatform(link.embed_platform || "");
    setIsSensitive(link.is_sensitive);
    setDialogOpen(true);
  }

  function handleUrlChange(newUrl: string) {
    setUrl(newUrl);
    if (linkType === "embed" && newUrl.trim()) {
      const detected = detectPlatform(newUrl.trim());
      if (detected) {
        setEmbedPlatform(detected);
      }
    }
  }

  async function handleFetchOg() {
    if (!url.trim()) return;
    setFetchingOg(true);
    try {
      const res = await fetch(`/api/og-image?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.image) setThumbnailUrl(data.image);
      if (data.title && !title.trim()) setTitle(data.title);
      toast.success("Fetched page info");
    } catch {
      toast.error("Failed to fetch page info");
    }
    setFetchingOg(false);
  }

  async function handleSave() {
    if (linkType === "header") {
      if (!title.trim()) return;
    } else {
      if (!title.trim() || !url.trim()) return;
      if (linkType === "embed" && !embedPlatform) {
        toast.error("Please select an embed platform");
        return;
      }
    }
    setSaving(true);

    const saveData = {
      title: title.trim(),
      url: linkType === "header" ? "" : url.trim(),
      thumbnail_url: linkType === "link" ? (thumbnailUrl.trim() || null) : null,
      scheduled_start: linkType === "header" ? null : (scheduledStart?.toISOString() || null),
      scheduled_end: linkType === "header" ? null : (scheduledEnd?.toISOString() || null),
      type: linkType,
      embed_platform: linkType === "embed" && embedPlatform ? embedPlatform : null,
      is_sensitive: linkType === "link" ? isSensitive : false,
    };

    if (editingLink) {
      const { error } = await supabase
        .from("links")
        .update(saveData)
        .eq("id", editingLink.id);

      if (error) {
        toast.error("Failed to update link");
        setSaving(false);
        return;
      }

      setLinks((prev) =>
        prev.map((l) =>
          l.id === editingLink.id ? { ...l, ...saveData } : l
        )
      );
      toast.success(linkType === "header" ? "Header updated" : "Link updated");
    } else {
      const newSortOrder = links.length;
      const { data, error } = await supabase
        .from("links")
        .insert({
          user_id: userId,
          ...saveData,
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
      toast.success(linkType === "header" ? "Header added" : "Link added");
      // Trigger badge check
      fetch("/api/badges/check", { method: "POST" }).catch(() => {});
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

  async function handleToggleFeatured(id: string, currentlyFeatured: boolean) {
    if (currentlyFeatured) {
      // Unfeature
      const { error } = await supabase
        .from("links")
        .update({ is_featured: false })
        .eq("id", id);
      if (error) {
        toast.error("Failed to update");
        return;
      }
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_featured: false } : l))
      );
      toast.success("Link unfeatured");
    } else {
      // Clear all featured for this user, then set new one
      await supabase
        .from("links")
        .update({ is_featured: false })
        .eq("user_id", userId);

      const { error } = await supabase
        .from("links")
        .update({ is_featured: true })
        .eq("id", id);

      if (error) {
        toast.error("Failed to feature link");
        return;
      }
      setLinks((prev) =>
        prev.map((l) => ({
          ...l,
          is_featured: l.id === id,
        }))
      );
      toast.success("Link featured");
    }
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

  const isSaveDisabled = linkType === "header"
    ? saving || !title.trim()
    : saving || !title.trim() || !url.trim() || (linkType === "embed" && !embedPlatform);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <Button variant="outline" onClick={openAddHeaderDialog} className="gap-2">
            <Type className="h-4 w-4" />
            Add Header
          </Button>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLink
                  ? linkType === "header" ? "Edit Header" : "Edit Link"
                  : linkType === "header" ? "Add Section Header" : "Add New Link"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {/* Type Toggle — hidden for headers */}
              {linkType !== "header" && (
                <Tabs
                  value={linkType}
                  onValueChange={(v) => {
                    setLinkType(v as "link" | "embed");
                    if (v === "link") setEmbedPlatform("");
                  }}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="link" className="flex-1">Link</TabsTrigger>
                    <TabsTrigger value="embed" className="flex-1">Embed</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              <div className="space-y-2">
                <Label htmlFor="link-title">{linkType === "header" ? "Header Text" : "Title"}</Label>
                <Input
                  id="link-title"
                  placeholder={linkType === "header" ? "Section name" : linkType === "embed" ? "My YouTube Video" : "My Website"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {linkType === "embed" && (
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={embedPlatform}
                    onValueChange={(v) => setEmbedPlatform(v as EmbedPlatform)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="spotify">Spotify</SelectItem>
                      <SelectItem value="twitter">Twitter / X</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="soundcloud">SoundCloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {linkType !== "header" && (
                <div className="space-y-2">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    placeholder={linkType === "embed" ? "https://youtube.com/watch?v=..." : "https://example.com"}
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                  />
                </div>
              )}

              {linkType === "link" && (
                <div className="space-y-2">
                  <Label htmlFor="link-thumb">Thumbnail URL (optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="link-thumb"
                      placeholder="https://example.com/image.png"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFetchOg}
                      disabled={fetchingOg || !url.trim()}
                      className="shrink-0 gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      {fetchingOg ? "Fetching..." : "Fetch"}
                    </Button>
                  </div>
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail preview"
                      className="h-16 w-16 rounded-md object-cover mt-1"
                    />
                  )}
                </div>
              )}

              {/* Schedule Section — hidden for headers */}
              {linkType !== "header" && (
                <div className="space-y-3 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Schedule (optional)</Label>
                    {(scheduledStart || scheduledEnd) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs text-muted-foreground"
                        onClick={() => {
                          setScheduledStart(null);
                          setScheduledEnd(null);
                        }}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Clear schedule
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Start</Label>
                      <DateTimePicker
                        value={scheduledStart}
                        onChange={setScheduledStart}
                        placeholder="Start date"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">End</Label>
                      <DateTimePicker
                        value={scheduledEnd}
                        onChange={setScheduledEnd}
                        placeholder="End date"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sensitive Content Toggle — only for link type */}
              {linkType === "link" && (
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Sensitive Content</Label>
                    <p className="text-xs text-muted-foreground">Show a warning before visitors open this link</p>
                  </div>
                  <Switch checked={isSensitive} onCheckedChange={setIsSensitive} />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaveDisabled}>
                  {saving ? "Saving..." : editingLink ? "Update" : linkType === "header" ? "Add Header" : linkType === "embed" ? "Add Embed" : "Add Link"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
