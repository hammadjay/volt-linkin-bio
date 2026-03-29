"use client";

import { createContext, useContext, useReducer, useCallback, useEffect, useRef, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Profile, Theme } from "@/types/database";
import type { Vibe } from "./vibes";

export interface AppearanceState {
  // Theme
  theme_id: string | null;
  // Background
  background_override: string;
  bg_image_url: string;
  video_background_url: string;
  bg_overlay_color: string;
  bg_overlay_opacity: number;
  // Card
  card_style: "none" | "glass" | "solid" | "outlined" | "image";
  card_bg_opacity: number;
  card_bg_image_url: string;
  card_blur: number;
  card_border_radius: number;
  card_border_color: string;
  card_shadow: boolean;
  card_max_width: "sm" | "md" | "lg" | "full";
  card_padding: "sm" | "md" | "lg";
  // Colors
  accent_color: string;
  card_bg_override: string;
  card_text_override: string;
  // Buttons
  button_style: "rounded" | "pill" | "sharp";
  button_shape: string;
  button_hover_effect: string;
  // Animation + FX
  animation_type: "none" | "gradient" | "particles" | "float";
  cursor_effect: "default" | "sparkle" | "emoji_trail" | "glow" | "ring";
  // Typography
  font_heading: string;
  font_body: string;
  font_buttons: string;
  // Avatar
  avatar_shape: string;
  avatar_ring_style: string;
  avatar_ring_color: string;
  avatar_effect: string;
  // Status
  status_emoji: string;
  status_text: string;
  // Texture
  texture_type: string;
  texture_opacity: number;
  // Spotlight
  spotlight_enabled: boolean;
  spotlight_color: string;
  // Vibe
  vibe_id: string | null;
}

function profileToState(profile: Profile): AppearanceState {
  return {
    theme_id: profile.theme_id ?? null,
    background_override: profile.background_override ?? "",
    bg_image_url: profile.bg_image_url ?? "",
    video_background_url: profile.video_background_url ?? "",
    bg_overlay_color: profile.bg_overlay_color ?? "#000000",
    bg_overlay_opacity: profile.bg_overlay_opacity ?? 0,
    card_style: profile.card_style ?? "none",
    card_bg_opacity: profile.card_bg_opacity ?? 100,
    card_bg_image_url: profile.card_bg_image_url ?? "",
    card_blur: profile.card_blur ?? 20,
    card_border_radius: profile.card_border_radius ?? 16,
    card_border_color: profile.card_border_color ?? "rgba(255,255,255,0.15)",
    card_shadow: profile.card_shadow ?? false,
    card_max_width: profile.card_max_width ?? "md",
    card_padding: profile.card_padding ?? "md",
    accent_color: profile.accent_color ?? "#8b5cf6",
    card_bg_override: profile.card_bg_override ?? "",
    card_text_override: profile.card_text_override ?? "",
    button_style: profile.button_style ?? "rounded",
    button_shape: (profile as any).button_shape ?? "rounded",
    button_hover_effect: (profile as any).button_hover_effect ?? "scale",
    animation_type: profile.animation_type ?? "none",
    cursor_effect: profile.cursor_effect ?? "default",
    font_heading: (profile as any).font_heading ?? "Inter",
    font_body: (profile as any).font_body ?? "Inter",
    font_buttons: (profile as any).font_buttons ?? "Inter",
    avatar_shape: (profile as any).avatar_shape ?? "circle",
    avatar_ring_style: (profile as any).avatar_ring_style ?? "none",
    avatar_ring_color: (profile as any).avatar_ring_color ?? "#8b5cf6",
    avatar_effect: (profile as any).avatar_effect ?? "none",
    status_emoji: (profile as any).status_emoji ?? "",
    status_text: (profile as any).status_text ?? "",
    texture_type: (profile as any).texture_type ?? "none",
    texture_opacity: (profile as any).texture_opacity ?? 20,
    spotlight_enabled: (profile as any).spotlight_enabled ?? false,
    spotlight_color: (profile as any).spotlight_color ?? "#ffffff",
    vibe_id: (profile as any).vibe_id ?? null,
  };
}

// ── Reducer ──────────────────────────────────────────────────

interface HistoryState {
  current: AppearanceState;
  past: AppearanceState[];
  future: AppearanceState[];
}

type Action =
  | { type: "UPDATE"; patch: Partial<AppearanceState> }
  | { type: "APPLY_VIBE"; state: AppearanceState }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET"; state: AppearanceState };

const MAX_HISTORY = 50;

function historyReducer(hs: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case "UPDATE": {
      const next = { ...hs.current, ...action.patch };
      return {
        current: next,
        past: [...hs.past, hs.current].slice(-MAX_HISTORY),
        future: [],
      };
    }
    case "APPLY_VIBE": {
      return {
        current: action.state,
        past: [...hs.past, hs.current].slice(-MAX_HISTORY),
        future: [],
      };
    }
    case "UNDO": {
      if (hs.past.length === 0) return hs;
      const prev = hs.past[hs.past.length - 1];
      return {
        current: prev,
        past: hs.past.slice(0, -1),
        future: [hs.current, ...hs.future],
      };
    }
    case "REDO": {
      if (hs.future.length === 0) return hs;
      const next = hs.future[0];
      return {
        current: next,
        past: [...hs.past, hs.current],
        future: hs.future.slice(1),
      };
    }
    case "RESET":
      return { current: action.state, past: [], future: [] };
    default:
      return hs;
  }
}

// ── Context ──────────────────────────────────────────────────

interface StudioContextValue {
  state: AppearanceState;
  originalState: AppearanceState;
  selectedTheme: Theme | null;
  themes: Theme[];
  profileId: string;
  profileUsername: string;
  profileDisplayName: string;
  profileBio: string;
  profileAvatarUrl: string | null;
  previewMode: "mobile" | "tablet" | "desktop";
  activePanel: string;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  update: (patch: Partial<AppearanceState>) => void;
  applyVibe: (vibe: Vibe) => void;
  undo: () => void;
  redo: () => void;
  discard: () => void;
  publish: () => Promise<void>;
  setPreviewMode: (m: "mobile" | "tablet" | "desktop") => void;
  setActivePanel: (p: string) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside StudioProvider");
  return ctx;
}

interface StudioProviderProps {
  profile: Profile;
  themes: Theme[];
  children: ReactNode;
}

export function StudioProvider({ profile, themes, children }: StudioProviderProps) {
  const initialState = profileToState(profile);
  const [historyState, dispatch] = useReducer(historyReducer, {
    current: initialState,
    past: [],
    future: [],
  });
  const [previewMode, setPreviewMode] = useSimpleState<"mobile" | "tablet" | "desktop">("mobile");
  const [activePanel, setActivePanel] = useSimpleState("vibes");
  const [isSaving, setIsSaving] = useSimpleState(false);
  const [isPublishing, setIsPublishing] = useSimpleState(false);
  const supabase = createClient();
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const state = historyState.current;
  const isDirty = historyState.past.length > 0;

  // Auto-save draft every 30s when dirty
  useEffect(() => {
    if (!isDirty) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await supabase.from("profile_drafts").upsert({
          user_id: profile.id,
          draft_data: state as unknown as Record<string, unknown>,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // Silent — draft save failure is non-critical
      }
      setIsSaving(false);
    }, 30_000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [state, isDirty]);

  const update = useCallback((patch: Partial<AppearanceState>) => {
    dispatch({ type: "UPDATE", patch });
  }, []);

  const applyVibe = useCallback((vibe: Vibe) => {
    const next: AppearanceState = {
      ...historyState.current,
      ...vibe.config,
      vibe_id: vibe.id,
    } as AppearanceState;
    dispatch({ type: "APPLY_VIBE", state: next });
  }, [historyState.current]);

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const discard = useCallback(() => dispatch({ type: "RESET", state: initialState }), []);

  const publish = useCallback(async () => {
    setIsPublishing(true);
    const { error } = await supabase.from("profiles").update({
      theme_id: state.theme_id,
      background_override: state.background_override || null,
      bg_image_url: state.bg_image_url || null,
      video_background_url: state.video_background_url || null,
      bg_overlay_color: state.bg_overlay_color,
      bg_overlay_opacity: state.bg_overlay_opacity,
      card_style: state.card_style,
      card_bg_opacity: state.card_bg_opacity,
      card_bg_image_url: state.card_bg_image_url || null,
      card_blur: state.card_blur,
      card_border_radius: state.card_border_radius,
      card_border_color: state.card_border_color || null,
      card_shadow: state.card_shadow,
      card_max_width: state.card_max_width,
      card_padding: state.card_padding,
      accent_color: state.accent_color || null,
      card_bg_override: state.card_bg_override || null,
      card_text_override: state.card_text_override || null,
      button_style: state.button_style,
      button_shape: state.button_shape,
      button_hover_effect: state.button_hover_effect,
      animation_type: state.animation_type,
      cursor_effect: state.cursor_effect,
      font_heading: state.font_heading,
      font_body: state.font_body,
      font_buttons: state.font_buttons,
      avatar_shape: state.avatar_shape,
      avatar_ring_style: state.avatar_ring_style,
      avatar_ring_color: state.avatar_ring_color,
      avatar_effect: state.avatar_effect,
      status_emoji: state.status_emoji || null,
      status_text: state.status_text || null,
      texture_type: state.texture_type,
      texture_opacity: state.texture_opacity,
      spotlight_enabled: state.spotlight_enabled,
      spotlight_color: state.spotlight_color,
      vibe_id: state.vibe_id,
    }).eq("id", profile.id);

    if (error) {
      toast.error("Failed to publish. Please try again.");
    } else {
      toast.success("Profile published!");
      dispatch({ type: "RESET", state: { ...state } });
      // Delete draft after successful publish
      await supabase.from("profile_drafts").delete().eq("user_id", profile.id);
    }
    setIsPublishing(false);
  }, [state, profile.id]);

  const selectedTheme = themes.find((t) => t.id === state.theme_id) ?? null;

  return (
    <StudioContext.Provider value={{
      state,
      originalState: initialState,
      selectedTheme,
      themes,
      profileId: profile.id,
      profileUsername: profile.username,
      profileDisplayName: profile.display_name ?? profile.username,
      profileBio: profile.bio ?? "",
      profileAvatarUrl: profile.avatar_url,
      previewMode,
      activePanel,
      canUndo: historyState.past.length > 0,
      canRedo: historyState.future.length > 0,
      isDirty,
      isSaving,
      isPublishing,
      update,
      applyVibe,
      undo,
      redo,
      discard,
      publish,
      setPreviewMode,
      setActivePanel,
    }}>
      {children}
    </StudioContext.Provider>
  );
}

// Tiny helper to avoid useReducer for simple state
function useSimpleState<T>(initial: T): [T, (v: T) => void] {
  const [state, dispatch] = useReducer((_: T, v: T) => v, initial);
  return [state, dispatch];
}
