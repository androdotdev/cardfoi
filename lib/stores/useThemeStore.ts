import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

type ThemeState = {
  dashboardTheme: Theme;
  initDashboardTheme: () => void;
  toggleDashboardTheme: () => void;
};

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const el = document.querySelector(".dashboard-bg");
  if (!el) return;
  el.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dashboardTheme: "light",
      initDashboardTheme: () => {
        applyTheme(get().dashboardTheme);
      },
      toggleDashboardTheme: () => {
        const next = get().dashboardTheme === "light" ? "dark" : "light";
        set({ dashboardTheme: next });
        applyTheme(next);
      },
    }),
    { name: "dashboard-theme" },
  ),
);
