import { create } from "zustand";

type AuthState = {
  authMode: "signin" | "signup";
  signingOut: boolean;
  authMessage: string;
  setAuthMode: (mode: "signin" | "signup") => void;
  setSigningOut: (value: boolean) => void;
  setAuthMessage: (msg: string) => void;
};

let messageTimeout: ReturnType<typeof setTimeout> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  authMode: "signin",
  signingOut: false,
  authMessage: "",
  setAuthMode: (mode) => set({ authMode: mode }),
  setSigningOut: (value) => set({ signingOut: value }),
  setAuthMessage: (msg) => {
    if (messageTimeout) clearTimeout(messageTimeout);
    set({ authMessage: msg });
    if (msg) {
      messageTimeout = setTimeout(() => set({ authMessage: "" }), 5000);
    }
  },
}));
