import { atom } from "nanostores";

export const selectedIdStore = atom("");
export const showForgotPasswordStore = atom(false);
export const forgotEmailStore = atom("");
export const messageStore = atom("");
export const loadingStore = atom({
  card: false,
  work: false,
  password: false
});

export function setLoading(type: "card" | "work" | "password", value: boolean) {
  const current = loadingStore.get();
  loadingStore.set({ ...current, [type]: value });
}
