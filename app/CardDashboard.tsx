"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cardSchema } from "@/lib/validation/dashboardSchemas";
import type { CardFormData } from "@/components/dashboard/types";
import type { UserCard } from "@/lib/cards";
import { authClient } from "@/lib/auth-client";

import { useCards, useSaveCard } from "@/lib/hooks/useDashboardQuery";
import { useDashboardState } from "@/lib/hooks/useDashboardState";

import BentoTopbar from "@/components/dashboard/BentoTopbar";
import IdentityTile from "@/components/dashboard/tiles/IdentityTile";
import ContactTile from "@/components/dashboard/tiles/ContactTile";
import BioTile from "@/components/dashboard/tiles/BioTile";
import ThemeTile from "@/components/dashboard/tiles/ThemeTile";
import SkillsTile from "@/components/dashboard/tiles/SkillsTile";
import ProjectsTile from "@/components/dashboard/tiles/ProjectsTile";
import PasswordTile from "@/components/dashboard/tiles/PasswordTile";

import ForgotPasswordForm from "@/components/dashboard/ForgotPasswordForm";
import AuthSection from "@/components/dashboard/AuthSection";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import PreviewPanel from "@/components/dashboard/PreviewPanel";
import EmptyState from "@/components/dashboard/EmptyState";

export default function CardDashboard() {
  const session = authClient.useSession();

  const { data: cardsData, isLoading: cardsLoading } = useCards();
  const cards = cardsData?.cards || [];
  const themes = cardsData?.themes || [];

  const { mutate: saveCard, isPending: cardSaving } = useSaveCard();

  const {
    selectedId,
    showForgotPassword,
    forgotEmail,
    message,
    showPreview,
    setShowPreview,
    setSelectedId,
    setShowForgotPassword,
    setForgotEmail,
    setMessage,
    clearState,
  } = useDashboardState();

  const selectedCard = cards.find((card) => card.id === selectedId);

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: selectedCard
      ? {
          name: selectedCard.name,
          email: selectedCard.email,
          phone: selectedCard.phone,
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
    // Reset form with selected card values
    form.reset({
      name: card.name,
      email: card.email,
      phone: card.phone,
      avatar: card.avatar ?? "",
      description: card.description,
      skills: card.skills.join(", "),
      theme: card.theme,
      template: card.template ?? "minimal",
    });
  }

  // Watch form values for preview panel
  const previewName = watch("name");
  const previewEmail = watch("email");
  const previewPhone = watch("phone");
  const previewAvatar = watch("avatar");
  const previewDescription = watch("description");
  const previewSkills = watch("skills");
  const previewTheme = watch("theme");
  const previewTemplate = watch("template") || "minimal";

  async function handleCardSubmit(data: CardFormData) {
    try {
      await saveCard({ card: data, selectedCard });
      form.reset(data); // mark as clean
      setMessage("Card saved.");
    } catch (error: any) {
      setMessage(error.message ?? "Unable to save card.");
    }
  }

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

      {showForgotPassword ? (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-md mx-auto mt-20">
            <ForgotPasswordForm
              onBack={() => {
                setShowForgotPassword(false);
                setForgotEmail("");
                setMessage("");
              }}
              setMessage={setMessage}
            />
          </div>
        </div>
      ) : cardsLoading ? (
        <DashboardSkeleton />
      ) : !selectedCard ? (
        <div className="min-h-screen bg-gray-50 p-6">
          {cards.length === 0 ? (
            <div className="max-w-md mx-auto mt-20">
              <AuthSection
                session={session}
                onSignOut={async () => {
                  clearState();
                }}
                onAuthSuccess={(loadedCards) => {
                  if (loadedCards[0]) applyCard(loadedCards[0]);
                }}
                setMessage={setMessage}
                setShowForgotPassword={setShowForgotPassword}
                setForgotEmail={setForgotEmail}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <EmptyState type="no-selection" />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => applyCard(card)}
                    className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-gray-300 transition-colors"
                  >
                    <p className="text-sm font-medium">{card.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {card.email}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-screen">
          {/* Main Content - reflows when preview is open */}
          <div className={`transition-all duration-300 ${showPreview ? 'w-[calc(100%-280px)]' : 'w-full'} min-h-screen bg-gray-50 p-4 sm:p-6`}>
            <FormProvider {...form}>
              <BentoTopbar
                onSave={form.handleSubmit(handleCardSubmit)}
                loading={cardSaving}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <IdentityTile />
                <ContactTile />
                <ThemeTile themes={themes} />
                <BioTile />
                <SkillsTile />
                <ProjectsTile
                  works={selectedCard.works}
                  cardId={selectedCard.id}
                />
                <PasswordTile />
              </div>
            </FormProvider>
          </div>

              {/* Preview Panel */}
              {showPreview && (
                <PreviewPanel
                  onClose={() => setShowPreview(false)}
                  cardId={selectedCard.id}
                  name={previewName || ""}
                  email={previewEmail || ""}
                  phone={previewPhone || ""}
                  avatar={previewAvatar || ""}
                  description={previewDescription || ""}
                  skills={previewSkills || ""}
                  theme={previewTheme || "corporate"}
                  template={previewTemplate || "minimal"}
                  onTemplateChange={(newTemplate) => setValue("template", newTemplate, { shouldDirty: true })}
                />
              )}
        </div>
      )}
    </>
  );
}
