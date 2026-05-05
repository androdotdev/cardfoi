"use client";

import { useCallback } from "react";
import { useStore } from "@nanostores/react";
import {
  selectedIdStore,
  showForgotPasswordStore,
  forgotEmailStore,
  messageStore,
  loadingStore,
  setLoading
} from "@/lib/stores/dashboardStore";

export function useDashboardState() {
  const selectedId = useStore(selectedIdStore);
  const showForgotPassword = useStore(showForgotPasswordStore);
  const forgotEmail = useStore(forgotEmailStore);
  const message = useStore(messageStore);
  const loading = useStore(loadingStore);

  const setSelectedId = useCallback((id: string) => {
    selectedIdStore.set(id);
  }, []);

  const setShowForgotPassword = useCallback((show: boolean) => {
    showForgotPasswordStore.set(show);
  }, []);

  const setForgotEmail = useCallback((email: string) => {
    forgotEmailStore.set(email);
  }, []);

  const setMessage = useCallback((msg: string) => {
    messageStore.set(msg);
    if (msg) {
      setTimeout(() => messageStore.set(""), 5000);
    }
  }, []);

  const setLoadingState = useCallback((type: "card" | "work" | "password", value: boolean) => {
    setLoading(type, value);
  }, []);

  const clearState = useCallback(() => {
    selectedIdStore.set("");
    showForgotPasswordStore.set(false);
    forgotEmailStore.set("");
    messageStore.set("");
    loadingStore.set({ card: false, work: false, password: false });
  }, []);

  return {
    selectedId,
    showForgotPassword,
    forgotEmail,
    message,
    loading,
    setSelectedId,
    setShowForgotPassword,
    setForgotEmail,
    setMessage,
    setLoadingState,
    clearState
  };
}
