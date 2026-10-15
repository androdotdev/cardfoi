import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";

describe("useDashboardStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useDashboardStore.setState({
      selectedId: "",
      showForgotPassword: false,
      forgotEmail: "",
      message: "",
      loading: { card: false, work: false, password: false },
      mobileSidebarOpen: false,
    });
  });

  it("setSelectedId updates selectedId", () => {
    useDashboardStore.getState().setSelectedId("card-1");
    expect(useDashboardStore.getState().selectedId).toBe("card-1");
  });

  it("setShowForgotPassword updates flag", () => {
    useDashboardStore.getState().setShowForgotPassword(true);
    expect(useDashboardStore.getState().showForgotPassword).toBe(true);
  });

  it("setForgotEmail updates email", () => {
    useDashboardStore.getState().setForgotEmail("a@b.com");
    expect(useDashboardStore.getState().forgotEmail).toBe("a@b.com");
  });

  it("setMessage clears after 5 seconds", () => {
    useDashboardStore.getState().setMessage("Error");
    expect(useDashboardStore.getState().message).toBe("Error");

    vi.advanceTimersByTime(5000);
    expect(useDashboardStore.getState().message).toBe("");
  });

  it("setLoading updates a specific loading key", () => {
    useDashboardStore.getState().setLoading("card", true);
    expect(useDashboardStore.getState().loading).toEqual({
      card: true,
      work: false,
      password: false,
    });
  });

  it("clearState resets to defaults", () => {
    useDashboardStore.getState().setSelectedId("card-1");
    useDashboardStore.getState().setLoading("work", true);

    useDashboardStore.getState().clearState();

    const s = useDashboardStore.getState();
    expect(s.selectedId).toBe("");
    expect(s.showForgotPassword).toBe(false);
    expect(s.forgotEmail).toBe("");
    expect(s.message).toBe("");
    expect(s.loading).toEqual({ card: false, work: false, password: false });
    expect(s.mobileSidebarOpen).toBe(false);
  });

  it("setMobileSidebarOpen updates the flag", () => {
    useDashboardStore.getState().setMobileSidebarOpen(true);
    expect(useDashboardStore.getState().mobileSidebarOpen).toBe(true);
    useDashboardStore.getState().setMobileSidebarOpen(false);
    expect(useDashboardStore.getState().mobileSidebarOpen).toBe(false);
  });

  it("toggleMobileSidebar flips the flag", () => {
    expect(useDashboardStore.getState().mobileSidebarOpen).toBe(false);
    useDashboardStore.getState().toggleMobileSidebar();
    expect(useDashboardStore.getState().mobileSidebarOpen).toBe(true);
    useDashboardStore.getState().toggleMobileSidebar();
    expect(useDashboardStore.getState().mobileSidebarOpen).toBe(false);
  });
});
