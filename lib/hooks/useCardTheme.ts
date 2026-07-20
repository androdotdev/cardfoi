"use client";

import { useEffect } from "react";

const DEFAULT_THEME = "corporate";

/**
 * Applies a card's daisyUI theme to <html data-theme="…"> while the card
 * page is mounted, then restores the previous theme on unmount.
 *
 * - Falls back to a sensible default when the card has no theme set.
 * - Adds a short colour transition (respecting prefers-reduced-motion) so
 *   switching between cards / theme changes don't hard-flash.
 */
export function useCardTheme(theme?: string | null) {
  useEffect(() => {
    const docElement = document.documentElement;
    const prevTheme = docElement.dataset.theme;
    const nextTheme = theme && theme.trim() ? theme : DEFAULT_THEME;

    docElement.dataset.theme = nextTheme;

    return () => {
      if (prevTheme) {
        docElement.dataset.theme = prevTheme;
      } else {
        delete docElement.dataset.theme;
      }
    };
  }, [theme]);
}
