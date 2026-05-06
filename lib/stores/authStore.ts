import { atom } from "nanostores";

export const authModeStore = atom<"signin" | "signup">("signin");
export const signingOutStore = atom(false);
export const authMessageStore = atom("");

export function setAuthMode(mode: "signin" | "signup") {
  authModeStore.set(mode);
}

export function setSigningOut(value: boolean) {
  signingOutStore.set(value);
}

export function setAuthMessage(msg: string) {
  authMessageStore.set(msg);
  if (msg) {
    setTimeout(() => authMessageStore.set(""), 5000);
  }
}
