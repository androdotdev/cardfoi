"use client";

import { useCallback, useEffect, useRef } from "react";
import type { StoreApi } from "zustand/vanilla";
import { saveCardSnapshot } from "@/components/dashboard/useDashboardActions";
import type { DashboardEditorState } from "@/components/dashboard/dashboardEditorStore";

const AUTOSAVE_DELAY_MS = 800;

/**
 * Keeps card edits local while someone is typing, then sends one current
 * snapshot after a short pause. A later edit always wins over an older save.
 */
export function useCardAutosave(store: StoreApi<DashboardEditorState>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const needsAnotherSaveRef = useRef(false);
  const flushRef = useRef<() => Promise<void>>(async () => {});

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const flush = useCallback(async () => {
    clearTimer();

    if (savingRef.current) {
      needsAnotherSaveRef.current = true;
      return;
    }

    const snapshot = store.getState();
    if (!snapshot.dirtySections.profile && !snapshot.dirtySections.appearance) return;

    const revision = snapshot.cardRevision;
    savingRef.current = true;
    snapshot.setCardSaveStatus("saving");
    snapshot.setPageError("");

    try {
      await saveCardSnapshot(snapshot);
      const wasCurrent = store.getState().markCardSaved(revision);
      if (!wasCurrent) needsAnotherSaveRef.current = true;
    } catch (error) {
      const latest = store.getState();
      latest.setCardSaveStatus("failed");
      latest.setPageError(error instanceof Error ? error.message : "Could not save your card.");
    } finally {
      savingRef.current = false;
      if (needsAnotherSaveRef.current) {
        needsAnotherSaveRef.current = false;
        void flushRef.current();
      }
    }
  }, [clearTimer, store]);

  useEffect(() => {
    flushRef.current = flush;
  });

  const markDirty = useCallback((section: "profile" | "appearance") => {
    store.getState().markCardDirty(section);
    clearTimer();
    timerRef.current = setTimeout(() => void flush(), AUTOSAVE_DELAY_MS);
  }, [clearTimer, flush, store]);

  useEffect(() => clearTimer, [clearTimer]);

  return { markDirty, flush };
}
