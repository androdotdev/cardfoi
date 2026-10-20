export const CARD_THEMES = [
  { id: "sage", name: "Field notes", color: "#dce5c9", ink: "#34442d" },
  { id: "blue", name: "Blue hour", color: "#d9e5ed", ink: "#304654" },
  { id: "peach", name: "Warm paper", color: "#f0dfd2", ink: "#624638" },
] as const;

export type CardTheme = (typeof CARD_THEMES)[number];
export type CardThemeId = CardTheme["id"];

/** Falls back to the first theme so unknown/stale values never break rendering. */
export function resolveCardTheme(theme: string): CardTheme {
  return CARD_THEMES.find((item) => item.id === theme) ?? CARD_THEMES[0];
}
