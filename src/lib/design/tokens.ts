/**
 * THE HOUSE OF GRAILS — Design Tokens (JS side)
 * Single source of truth shared with globals.css. Keep values in sync.
 */

export const palette = {
  void: "#050506",
  obsidian: "#0a0a0d",
  carbon: "#101014",
  graphite: "#17171c",
  smoke: "#23232b",
  slate: "#34343e",

  ash: "#6b6b76",
  silver: "#a8a8b3",
  platinum: "#e8e8ec",
  pearl: "#f6f6f4",

  grail: "#d4af6a",
  grailBright: "#ecc788",
  grailDeep: "#a67c3d",
  ion: "#7db4ff",
  ionDeep: "#3f74d6",
  plasma: "#b98cff",
  ember: "#ff5c39",
} as const;

/** Cubic-bezier easings mirrored from CSS custom properties. */
export const easing = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutCubic: [0.65, 0, 0.35, 1],
  silk: [0.22, 1, 0.36, 1],
} as const;

/** Standard motion durations (seconds). */
export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.4,
} as const;

/** Reusable spring configs for physics-based interactions. */
export const spring = {
  soft: { stiffness: 120, damping: 20, mass: 0.6 },
  snappy: { stiffness: 300, damping: 26, mass: 0.5 },
  magnetic: { stiffness: 220, damping: 18, mass: 0.4 },
} as const;

export type Palette = typeof palette;
