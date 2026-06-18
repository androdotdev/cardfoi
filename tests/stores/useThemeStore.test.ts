import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "@/lib/stores/useThemeStore";

describe("useThemeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    const el = document.createElement("div");
    el.className = "dashboard-bg";
    document.body.innerHTML = "";
    document.body.appendChild(el);
    useThemeStore.setState({ dashboardTheme: "light" });
  });

  it("starts with light theme", () => {
    expect(useThemeStore.getState().dashboardTheme).toBe("light");
  });

  it("toggleDashboardTheme switches to dark", () => {
    useThemeStore.getState().toggleDashboardTheme();
    expect(useThemeStore.getState().dashboardTheme).toBe("dark");
  });

  it("toggleDashboardTheme toggles back to light", () => {
    useThemeStore.getState().toggleDashboardTheme();
    useThemeStore.getState().toggleDashboardTheme();
    expect(useThemeStore.getState().dashboardTheme).toBe("light");
  });

  it("toggleDashboardTheme applies dark class to .dashboard-bg", () => {
    useThemeStore.getState().toggleDashboardTheme();
    const el = document.querySelector(".dashboard-bg");
    expect(el?.classList.contains("dark")).toBe(true);
  });

  it("initDashboardTheme applies current theme class", () => {
    useThemeStore.getState().toggleDashboardTheme();
    useThemeStore.getState().initDashboardTheme();
    const el = document.querySelector(".dashboard-bg");
    expect(el?.classList.contains("dark")).toBe(true);
  });
});
