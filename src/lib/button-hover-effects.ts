/**
 * Button hover effect utilities.
 * Returns Framer Motion props + CSS class names for each effect.
 */

export type HoverEffect =
  | "scale"
  | "glow"
  | "shimmer"
  | "fill"
  | "lift"
  | "jelly"
  | "shake"
  | "none";

export interface HoverEffectResult {
  /** Framer Motion whileHover target */
  whileHover?: Record<string, unknown>;
  /** Framer Motion whileTap target */
  whileTap?: Record<string, unknown>;
  /** Framer Motion transition override */
  transition?: Record<string, unknown>;
  /** CSS class(es) to add to the element */
  className?: string;
  /** Inline style additions (non-animated) */
  style?: React.CSSProperties;
}

export function getHoverEffectProps(
  effect: string,
  accentColor: string
): HoverEffectResult {
  switch (effect as HoverEffect) {
    case "scale":
      return {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
        transition: { type: "spring", stiffness: 400, damping: 20 },
      };

    case "glow":
      return {
        whileHover: {
          scale: 1.01,
          boxShadow: `0 0 18px ${accentColor}70, 0 0 36px ${accentColor}30`,
        },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 },
      };

    case "lift":
      return {
        whileHover: {
          y: -4,
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          scale: 1.01,
        },
        whileTap: { y: 0, scale: 0.98 },
        transition: { type: "spring", stiffness: 350, damping: 18 },
      };

    case "jelly":
      return {
        whileHover: { scale: 1.04 },
        whileTap: { scale: 0.92 },
        transition: { type: "spring", stiffness: 500, damping: 10 },
      };

    case "shimmer":
      return {
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 },
        className: "btn-shimmer",
      };

    case "fill":
      return {
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 },
        className: "btn-fill",
      };

    case "shake":
      return {
        whileHover: { x: [0, -4, 4, -3, 3, -1, 1, 0] } as Record<string, unknown>,
        whileTap: { scale: 0.97 },
        transition: { duration: 0.4, ease: "easeInOut" },
      };

    case "none":
    default:
      return {};
  }
}
