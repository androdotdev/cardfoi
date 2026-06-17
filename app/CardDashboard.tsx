"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cardSchema } from "@/lib/validation/dashboardSchemas";
import type { CardFormData } from "@/components/dashboard/types";
import type { UserCard } from "@/lib/cards";
import { authClient } from "@/lib/auth-client";

import { useCards, useSaveCard } from "@/lib/hooks/useDashboardQuery";
import { useDashboardState } from "@/lib/hooks/useDashboardState";
import { initDashboardTheme } from "@/lib/stores/dashboardThemeStore";

import BentoTopbar from "@/components/dashboard/BentoTopbar";
import IdentityTile from "@/components/dashboard/tiles/IdentityTile";
import ContactSkillsTile from "@/components/dashboard/tiles/ContactSkillsTile";
import SocialLinksTile from "@/components/dashboard/tiles/SocialLinksTile";
import BioTile from "@/components/dashboard/tiles/BioTile";
import ThemeTile from "@/components/dashboard/tiles/ThemeTile";
import ProjectsTile from "@/components/dashboard/tiles/ProjectsTile";
import SecurityTile from "@/components/dashboard/tiles/SecurityTile";
import AdminTile from "@/components/dashboard/tiles/AdminTile";

import PreviewPanel from "@/components/dashboard/PreviewPanel";

export default function CardDashboard() {
  const session = authClient.useSession();

  const { data: cardsData, isLoading: cardsLoading } = useCards();
  const cards = cardsData?.cards || [];
  const themes = cardsData?.themes || [];

  const { mutateAsync: saveCard, isPending: cardSaving } = useSaveCard();

  const {
    selectedId,
    showPreview,
    setShowPreview,
    setSelectedId,
    setMessage,
    message,
  } = useDashboardState();

  const selectedCard = cards.find((card) => card.id === selectedId);

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: selectedCard
      ? {
          name: selectedCard.name,
          slug: selectedCard.id,
          email: selectedCard.email,
          avatar: selectedCard.avatar ?? "",
          description: selectedCard.description,
          skills: selectedCard.skills.join(", "),
          theme: selectedCard.theme,
          template: selectedCard.template ?? "minimal",
        }
      : undefined,
  });

  const { watch, setValue } = form;

  function applyCard(card: UserCard) {
    setSelectedId(card.id);
    form.reset({
      name: card.name,
      slug: card.id,
      email: card.email,
      avatar: card.avatar ?? "",
      description: card.description,
      skills: card.skills.join(", "),
      theme: card.theme,
      template: card.template ?? "minimal",
    });
  }

  useEffect(() => {
    initDashboardTheme();
    if (cards.length > 0) {
      const currentCard = cards.find((card) => card.id === selectedId);
      if (!currentCard) {
        // selectedId is stale (e.g., slug changed), select first valid card
        applyCard(cards[0]);
      } else if (!selectedId) {
        applyCard(cards[0]);
      }
    }
  }, [cards, selectedId]);

  const previewName = watch("name");
  const previewEmail = watch("email");
  const previewAvatar = watch("avatar");
  const previewDescription = watch("description");
  const previewSkills = watch("skills");
  const previewTheme = watch("theme");
  const previewTemplate = watch("template") || "minimal";

  async function handleCardSubmit(data: CardFormData) {
    try {
      const result = await saveCard({ card: data, selectedCard });

      // Sync user.name with cards.name (one user = one card)
      if (data.name !== session.data?.user?.name) {
        try {
          await authClient.updateUser({ name: data.name });
        } catch (syncError: any) {
          console.error("Failed to sync user name:", syncError);
        }
      }

      if (result?.card?.id) {
        const newId = result.card.id;
        if (newId !== selectedId) {
          setSelectedId(newId);
          form.reset({
            ...data,
            slug: newId,
          });
        } else {
          form.reset(data);
        }
      }
      setMessage("Card saved.");
    } catch (error: any) {
      setMessage(error.message ?? "Unable to save card.");
    }
  }

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
        applyCard(result.card);
      }
    } catch (error: any) {
      setMessage(error.message ?? "Failed to create card.");
    }
  }

  if (session.isPending) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session.data) return null;

  return (
    <>
      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 max-w-sm shadow-lg rounded-lg p-4 flex items-center gap-3">
            <span>{message}</span>
            <button
              className="text-xs px-2 py-1 hover:bg-blue-100 rounded ml-auto"
              onClick={() => setMessage("")}
              type="button"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {cardsLoading ? (
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      ) : cards.length === 0 ? (
        <div className="min-h-screen bg-gray-50 p-6 dashboard-bg">
          <div className="max-w-md mx-auto mt-20 text-center">
            <p className="text-gray-600 mb-4">You don't have any cards yet.</p>
            <button
              onClick={handleCreateCard}
              disabled={cardSaving}
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
            >
              {cardSaving ? "Creating..." : "Create Card"}
            </button>
          </div>
        </div>
      ) : selectedCard ? (
        <div className="flex min-h-screen">
          <div
            className={`transition-all duration-300 ${showPreview ? "w-[calc(100%-400px)]" : "w-full"} min-h-screen bg-[#f5f5f3] p-4 sm:p-6 dashboard-bg`}
          >
            <FormProvider {...form}>
              <BentoTopbar
                onSave={form.handleSubmit(handleCardSubmit)}
                loading={cardSaving}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
                user={session.data?.user ?? null}
              />

              {cards.length > 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-400 py-1">Switch card:</span>
                  {cards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => applyCard(card)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        selectedId === card.id
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {card.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <IdentityTile />
                <ThemeTile themes={themes} />
                <div className="sm:col-span-2">
                  <ProjectsTile
                    works={selectedCard.works}
                    cardId={selectedCard.id}
                  />
                </div>
                <div className="sm:col-span-2">
                  <BioTile />
                </div>
                <ContactSkillsTile />
                <SocialLinksTile
                  socialLinks={selectedCard.socialLinks}
                  cardId={selectedCard.id}
                />
                <SecurityTile />
                <div className="sm:col-span-2">
                  <AdminTile />
                </div>
              </div>
            </FormProvider>
          </div>

          {showPreview && (
            <PreviewPanel
              onClose={() => setShowPreview(false)}
              cardId={selectedCard.id}
              name={previewName || ""}
              email={previewEmail || ""}
              avatar={previewAvatar || ""}
              description={previewDescription || ""}
              skills={previewSkills || ""}
              theme={previewTheme || "corporate"}
              template={previewTemplate || "minimal"}
              onTemplateChange={(newTemplate) =>
                setValue("template", newTemplate, { shouldDirty: true })
              }
            />
          )}
        </div>
      ) : null}
    </>
  );
}
