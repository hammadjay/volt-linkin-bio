"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Undo2, Redo2, Monitor, Tablet, Smartphone,
  Sparkles, Image, Type, Palette, Layers, Square, Wand2,
  Save, Eye, Loader2
} from "lucide-react";
import Link from "next/link";
import { useStudio } from "./studio-context";
import { StudioCanvas } from "./StudioCanvas";
import { VibesPanel } from "./panels/VibesPanel";
import { BackgroundPanel } from "./panels/BackgroundPanel";
import { TypographyPanel } from "./panels/TypographyPanel";
import { ColorsPanel } from "./panels/ColorsPanel";
import { ButtonsPanel } from "./panels/ButtonsPanel";
import { CardPanel } from "./panels/CardPanel";
import { EffectsPanel } from "./panels/EffectsPanel";
import { cn } from "@/lib/utils";

const PANELS = [
  { id: "vibes", label: "Vibes", icon: Wand2 },
  { id: "background", label: "BG", icon: Image },
  { id: "typography", label: "Type", icon: Type },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "buttons", label: "Buttons", icon: Layers },
  { id: "card", label: "Card", icon: Square },
  { id: "effects", label: "Effects", icon: Sparkles },
] as const;

const PREVIEW_MODES = [
  { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
  { id: "tablet" as const, icon: Tablet, label: "Tablet" },
  { id: "desktop" as const, icon: Monitor, label: "Desktop" },
];

function PanelContent({ panelId }: { panelId: string }) {
  switch (panelId) {
    case "vibes": return <VibesPanel />;
    case "background": return <BackgroundPanel />;
    case "typography": return <TypographyPanel />;
    case "colors": return <ColorsPanel />;
    case "buttons": return <ButtonsPanel />;
    case "card": return <CardPanel />;
    case "effects": return <EffectsPanel />;
    default: return null;
  }
}

export function StudioClient() {
  const {
    activePanel, setActivePanel,
    previewMode, setPreviewMode,
    canUndo, canRedo, isDirty,
    isSaving, isPublishing,
    undo, redo, discard, publish,
    profileUsername,
  } = useStudio();

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      if (canUndo) undo();
    }
    if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      if (canRedo) redo();
    }
  }, [canUndo, canRedo, undo, redo]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-[#020203] flex flex-col overflow-hidden" style={{ zIndex: 50 }}>
      {/* ── Header ── */}
      <header className="flex items-center justify-between h-12 px-3 border-b border-white/[0.07] shrink-0 bg-[#020203]/80 backdrop-blur-xl z-10">
        {/* Left */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/appearance"
            className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="w-px h-4 bg-white/[0.07] mx-1" />
          <span className="text-xs font-semibold text-white/80">Appearance Studio</span>
          {isSaving && (
            <span className="flex items-center gap-1 text-[10px] text-white/30">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving…
            </span>
          )}
          {isDirty && !isSaving && (
            <span className="text-[10px] text-amber-400/60">Unsaved changes</span>
          )}
        </div>

        {/* Center — preview mode */}
        <div className="flex items-center gap-0.5 bg-white/[0.04] rounded-lg p-0.5">
          {PREVIEW_MODES.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setPreviewMode(id)}
              title={label}
              className={cn(
                "p-1.5 rounded-md transition-all",
                previewMode === id ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-md text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <div className="w-px h-4 bg-white/[0.07] mx-1" />
          <a
            href={`/${profileUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </a>
          {isDirty && (
            <button
              onClick={discard}
              className="px-2.5 py-1 rounded-md text-[11px] text-white/40 hover:text-white/70 transition-colors"
            >
              Discard
            </button>
          )}
          <button
            onClick={publish}
            disabled={isPublishing || !isDirty}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
              isDirty
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                : "bg-white/[0.06] text-white/30 cursor-not-allowed"
            )}
          >
            {isPublishing ? (
              <><Loader2 className="h-3 w-3 animate-spin" />Publishing…</>
            ) : (
              <><Save className="h-3 w-3" />Publish</>
            )}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: tab bar + content */}
        <div className="flex h-full shrink-0 overflow-hidden border-r border-white/[0.06]" style={{ width: 340 }}>
          {/* Tab icons sidebar */}
          <div className="flex flex-col items-center gap-1 py-3 px-2 border-r border-white/[0.05] bg-[#08080f]" style={{ width: 64 }}>
            {PANELS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActivePanel(id)}
                title={label}
                className={cn(
                  "flex flex-col items-center gap-1 w-12 py-2.5 rounded-xl transition-all text-[9px] font-medium leading-none",
                  activePanel === id
                    ? "bg-violet-500/20 text-violet-400"
                    : "text-white/25 hover:text-white/60 hover:bg-white/[0.05]"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto bg-[#0d0d15]" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
            <div className="p-4 pb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePanel}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <PanelContent panelId={activePanel} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-6 bg-[#020203]">
          {/* Subtle grid backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 w-full flex justify-center">
            <StudioCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}
