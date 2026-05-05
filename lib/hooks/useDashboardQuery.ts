"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserCard } from "@/lib/cards";
import type {
  CardFormData,
  WorkFormData,
  PasswordFormData,
} from "@/components/dashboard/types";

export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await fetch("/api/cards", { cache: "no-store" });
      const data = await res.json();
      return {
        cards: data.cards as UserCard[],
        themes: data.themes as string[],
      };
    },
  });
}

export function useSaveCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      card,
      selectedCard,
    }: {
      card: CardFormData;
      selectedCard: UserCard | undefined;
    }) => {
      const endpoint = selectedCard
        ? `/api/cards/${selectedCard.id}`
        : "/api/cards";
      const res = await fetch(endpoint, {
        method: selectedCard ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });
      return res.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useSaveWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cardId,
      work,
    }: {
      cardId: string;
      work: WorkFormData;
    }) => {
      const res = await fetch(`/api/cards/${cardId}/works`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(work),
      });
      return res.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useDeleteWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cardId,
      workId,
    }: {
      cardId: string;
      workId: string;
    }) => {
      await fetch(`/api/cards/${cardId}/works/${workId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          revokeOtherSessions: true,
        }),
      });
      return res.json();
    },
  });
}
