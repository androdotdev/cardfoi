"use client";

import { useEffect } from "react";
import type { UserCard } from "@/lib/cards";
import { authClient } from "@/lib/auth-client";

import { useCards, useSaveCard } from "@/lib/hooks/useDashboardQuery";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";
import { useThemeStore } from "@/lib/stores/useThemeStore";

import DashboardShell from "@/components/dashboard/DashboardShell";
import IdentityTile from "@/components/dashboard/tiles/IdentityTile";
import ProjectsTile from "@/components/dashboard/tiles/ProjectsTile";
import SocialLinksTile from "@/components/dashboard/tiles/SocialLinksTile";
import ThemeTile from "@/components/dashboard/tiles/ThemeTile";
import SecurityTile from "@/components/dashboard/tiles/SecurityTile";
import AdminTile from "@/components/dashboard/tiles/AdminTile";

export default function CardDashboard() {
  const session = authClient.useSession();

  const { data: cardsData, isLoading: cardsLoading } = useCards();
  const cards = cardsData?.cards || [];

  const selectedId = useDashboardStore((s) => s.selectedId);
  const message = useDashboardStore((s) => s.message);
  const setSelectedId = useDashboardStore((s) => s.setSelectedId);
  const setMessage = useDashboardStore((s) => s.setMessage);

  const selectedCard = cards.find((card) => card.id === selectedId);

  function applyCard(card: UserCard) {
    setSelectedId(card.id);
  }

  useEffect(() => {
    document.body.classList.remove("preload");
    useThemeStore.getState().initDashboardTheme();
    if (cards.length > 0) {
      const currentCard = cards.find((card) => card.id === selectedId);
      if (!currentCard) {
        applyCard(cards[0]);
      } else if (!selectedId) {
        applyCard(cards[0]);
      }
    }
  }, [cards, selectedId]);

  if (session.isPending) {
    return <div className="min-h-screen flex items-center justify-center text-[#5c5c5a]">Loading...</div>;
  }

  if (!session.data) return null;

  if (cardsLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#5c5c5a]">Loading...</div>;
  }

  if (cards.length === 0) {
    return <NoCardsView />;
  }

  if (!selectedCard) return null;

  const isAdmin = session.data?.user?.role === "admin";

  const sections: { id: string; component: React.ReactNode }[] = [
    { id: "identity", component: <IdentityTile selectedCard={selectedCard} /> },
    { id: "projects", component: <ProjectsTile works={selectedCard.works} cardId={selectedCard.id} /> },
    { id: "socials", component: <SocialLinksTile socialLinks={selectedCard.socialLinks} cardId={selectedCard.id} /> },
    { id: "theme", component: <ThemeTile selectedCard={selectedCard} /> },
    { id: "security", component: <SecurityTile /> },
  ];

  if (isAdmin) {
    sections.push({ id: "admin", component: <AdminTile /> });
  }

  return (
    <>
      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-[#fafaf8] border border-[#ebebea] text-[#0a0a0a] max-w-sm shadow-lg rounded-xl p-4 flex items-center gap-3">
            <span className="text-sm">{message}</span>
            <button
              className="text-[11px] px-2 py-1 hover:bg-[#f5f5f3] rounded ml-auto text-[#9a9a97]"
              onClick={() => setMessage("")}
              type="button"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <DashboardShell sections={sections} slug={selectedCard.id} />
    </>
  );
}

function NoCardsView() {
  const session = authClient.useSession();
  const { mutateAsync: saveCard, isPending } = useSaveCard();
  const setMessage = useDashboardStore((s) => s.setMessage);

  async function handleCreateCard() {
    try {
      const result = await saveCard({
        card: {
          name: session.data?.user?.name || "New Card",
          email: session.data?.user?.email || "",
          avatar: "",
          description: "Brief description about yourself",
          skills: "",
          theme: "corporate",
          template: "minimal",
        },
        selectedCard: undefined,
      });
      if (result?.card?.id) {
        useDashboardStore.getState().setSelectedId(result.card.id);
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Failed to create card.");
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-[#5c5c5a] mb-4">You don&apos;t have any cards yet.</p>
        <button
          onClick={handleCreateCard}
          disabled={isPending}
          className="bg-[#0a0a0a] text-white px-4 py-2 rounded-full text-sm font-medium disabled:opacity-40"
        >
          {isPending ? "Creating..." : "Create Card"}
        </button>
      </div>
    </div>
  );
}
