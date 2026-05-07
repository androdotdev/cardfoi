import { atom } from "nanostores";

type Theme = "light" | "dark";

export const dashboardThemeStore = atom<Theme>("light");

const COOKIE_NAME = "dashboard-theme";

function getCookie(): Theme {
  if (typeof document === "undefined") return "light";
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  return match && match[2] === "dark" ? "dark" : "light";
}

function setCookie(theme: Theme) {
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

export function initDashboardTheme() {
  const theme = getCookie();
  dashboardThemeStore.set(theme);
  applyTheme(theme);
}

export function toggleDashboardTheme() {
  const current = dashboardThemeStore.get();
  const next = current === "light" ? "dark" : "light";
  dashboardThemeStore.set(next);
  setCookie(next);
  applyTheme(next);
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const dashboardEl = document.querySelector(".dashboard-bg");
  if (!dashboardEl) return;
  if (theme === "dark") {
    dashboardEl.classList.add("dark");
  } else {
    dashboardEl.classList.remove("dark");
  }
}
