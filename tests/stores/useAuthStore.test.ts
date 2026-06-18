import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/lib/stores/useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useAuthStore.setState({
      authMode: "signin",
      signingOut: false,
      authMessage: "",
    });
  });

  it("starts with signin mode", () => {
    expect(useAuthStore.getState().authMode).toBe("signin");
  });

  it("setAuthMode toggles mode", () => {
    useAuthStore.getState().setAuthMode("signup");
    expect(useAuthStore.getState().authMode).toBe("signup");
  });

  it("setSigningOut updates signingOut", () => {
    useAuthStore.getState().setSigningOut(true);
    expect(useAuthStore.getState().signingOut).toBe(true);
  });

  it("setAuthMessage clears after 5 seconds", () => {
    useAuthStore.getState().setAuthMessage("Hello");
    expect(useAuthStore.getState().authMessage).toBe("Hello");

    vi.advanceTimersByTime(5000);
    expect(useAuthStore.getState().authMessage).toBe("");
  });

  it("setAuthMessage with empty string does not schedule timeout", () => {
    useAuthStore.getState().setAuthMessage("");
    expect(useAuthStore.getState().authMessage).toBe("");

    vi.advanceTimersByTime(5000);
    expect(useAuthStore.getState().authMessage).toBe("");
  });
});
