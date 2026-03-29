export interface FontOption {
  name: string;
  label: string;
  category: "sans" | "display" | "mono" | "serif" | "handwritten" | "techy";
  googleFamily?: string; // exact Google Fonts family name
}

export const FONTS: FontOption[] = [
  { name: "Inter", label: "Inter", category: "sans" },
  { name: "Space Grotesk", label: "Space Grotesk", category: "sans", googleFamily: "Space+Grotesk:wght@400;500;600;700" },
  { name: "DM Sans", label: "DM Sans", category: "sans", googleFamily: "DM+Sans:wght@400;500;600;700" },
  { name: "Outfit", label: "Outfit", category: "sans", googleFamily: "Outfit:wght@400;500;600;700" },
  { name: "Plus Jakarta Sans", label: "Plus Jakarta Sans", category: "sans", googleFamily: "Plus+Jakarta+Sans:wght@400;500;600;700" },
  { name: "Syne", label: "Syne", category: "display", googleFamily: "Syne:wght@400;700;800" },
  { name: "Bebas Neue", label: "Bebas Neue", category: "display", googleFamily: "Bebas+Neue" },
  { name: "Archivo Black", label: "Archivo Black", category: "display", googleFamily: "Archivo+Black" },
  { name: "Raleway", label: "Raleway", category: "display", googleFamily: "Raleway:wght@400;600;700;900" },
  { name: "Playfair Display", label: "Playfair Display", category: "serif", googleFamily: "Playfair+Display:wght@400;600;700" },
  { name: "DM Serif Display", label: "DM Serif Display", category: "serif", googleFamily: "DM+Serif+Display" },
  { name: "JetBrains Mono", label: "JetBrains Mono", category: "mono", googleFamily: "JetBrains+Mono:wght@400;500" },
  { name: "Space Mono", label: "Space Mono", category: "mono", googleFamily: "Space+Mono:wght@400;700" },
  { name: "Orbitron", label: "Orbitron", category: "techy", googleFamily: "Orbitron:wght@400;700;900" },
  { name: "Rajdhani", label: "Rajdhani", category: "techy", googleFamily: "Rajdhani:wght@400;500;600;700" },
  { name: "Caveat", label: "Caveat", category: "handwritten", googleFamily: "Caveat:wght@400;700" },
  { name: "Pacifico", label: "Pacifico", category: "handwritten", googleFamily: "Pacifico" },
];

export const FONT_CATEGORY_LABELS: Record<FontOption["category"], string> = {
  sans: "Sans-Serif",
  display: "Display",
  mono: "Monospace",
  serif: "Serif",
  handwritten: "Handwritten",
  techy: "Techy / Sci-Fi",
};

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string): void {
  if (typeof window === "undefined") return;
  if (loadedFonts.has(fontName)) return;
  const font = FONTS.find((f) => f.name === fontName);
  if (!font?.googleFamily) return;
  const id = `gfont-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.googleFamily}&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontName);
}
