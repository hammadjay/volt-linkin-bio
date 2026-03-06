"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import type { ProfileSticker } from "@/types/database";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { STICKER_MAP } from "@/components/profile/sticker-layer";

export function StickerEditor({
  initialStickers,
  userId,
}: {
  initialStickers: ProfileSticker[];
  userId: string;
}) {
  const [stickers, setStickers] = useState<ProfileSticker[]>(initialStickers);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleAddSticker(key: string) {
    if (stickers.length >= 5) {
      toast.error("Maximum 5 stickers per profile");
      return;
    }

    const { data, error } = await supabase
      .from("profile_stickers")
      .insert({
        user_id: userId,
        sticker_key: key,
        x_percent: 20 + Math.random() * 60,
        y_percent: 20 + Math.random() * 60,
        scale: 1,
        rotation: Math.random() * 30 - 15,
        sort_order: stickers.length,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add sticker");
      return;
    }

    setStickers((prev) => [...prev, data]);
    toast.success("Sticker added");
    router.refresh();
  }

  async function handleDeleteSticker(id: string) {
    const { error } = await supabase
      .from("profile_stickers")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete sticker");
      return;
    }

    setStickers((prev) => prev.filter((s) => s.id !== id));
    setSelectedSticker(null);
    toast.success("Sticker removed");
    router.refresh();
  }

  async function handleUpdateSticker(
    id: string,
    updates: Partial<Pick<ProfileSticker, "x_percent" | "y_percent" | "scale" | "rotation">>
  ) {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }

  async function handleSave() {
    setSaving(true);

    for (const sticker of stickers) {
      await supabase
        .from("profile_stickers")
        .update({
          x_percent: sticker.x_percent,
          y_percent: sticker.y_percent,
          scale: sticker.scale,
          rotation: sticker.rotation,
        })
        .eq("id", sticker.id);
    }

    toast.success("Stickers saved");
    setSaving(false);
    router.refresh();
  }

  const stickerKeys = Object.keys(STICKER_MAP);
  const selected = stickers.find((s) => s.id === selectedSticker);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stickers</h1>
        <p className="text-muted-foreground mt-1">
          Drag decorative stickers onto your profile. Up to 5 allowed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Preview canvas */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="relative w-full bg-muted rounded-lg overflow-hidden"
              style={{ aspectRatio: "9/16", maxHeight: 500 }}
            >
              {stickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className={`absolute text-4xl cursor-pointer select-none transition-all ${
                    selectedSticker === sticker.id
                      ? "ring-2 ring-primary rounded-lg"
                      : ""
                  }`}
                  style={{
                    left: `${sticker.x_percent}%`,
                    top: `${sticker.y_percent}%`,
                    transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                  }}
                  onClick={() => setSelectedSticker(sticker.id)}
                >
                  {STICKER_MAP[sticker.sticker_key] || "⭐"}
                </div>
              ))}
              {stickers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  Add stickers from the palette
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Sticker palette */}
          <Card>
            <CardHeader>
              <CardTitle>Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {stickerKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleAddSticker(key)}
                    disabled={stickers.length >= 5}
                    className="flex items-center justify-center h-12 w-12 text-2xl rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-30"
                  >
                    {STICKER_MAP[key]}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edit selected sticker */}
          {selected && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Edit: {STICKER_MAP[selected.sticker_key]}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSticker(selected.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>X Position ({Math.round(selected.x_percent)}%)</Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={selected.x_percent}
                    onChange={(e) =>
                      handleUpdateSticker(selected.id, {
                        x_percent: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Y Position ({Math.round(selected.y_percent)}%)</Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={selected.y_percent}
                    onChange={(e) =>
                      handleUpdateSticker(selected.id, {
                        y_percent: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scale ({selected.scale.toFixed(1)}x)</Label>
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={selected.scale}
                    onChange={(e) =>
                      handleUpdateSticker(selected.id, {
                        scale: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rotation ({Math.round(selected.rotation)}°)</Label>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={selected.rotation}
                    onChange={(e) =>
                      handleUpdateSticker(selected.id, {
                        rotation: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active stickers list */}
          {stickers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active ({stickers.length}/5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stickers.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedSticker === s.id ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedSticker(s.id)}
                  >
                    <span className="text-xl">{STICKER_MAP[s.sticker_key]}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSticker(s.id);
                      }}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
                  {saving ? "Saving..." : "Save Positions"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
