"use client";

import { useEffect } from "react";

export function useCardTheme(theme: string) {
  useEffect(() => {
    const docElement = document.documentElement;
    const prevTheme = docElement.dataset.theme;
    docElement.dataset.theme = theme;

    return () => {
      if (prevTheme) {
        docElement.dataset.theme = prevTheme;
      } else {
        delete docElement.dataset.theme;
      }
    };
  }, [theme]);
}
