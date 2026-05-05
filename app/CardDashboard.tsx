"use client";

import {
  useCards,
  useSaveCard,
  useSaveWork,
  useDeleteWork,
  useChangePassword,
} from "@/lib/hooks/useDashboardQuery";
import { useDashboardState } from "@/lib/hooks/useDashboardState";
import type {
  CardFormData,
  WorkFormData,
  PasswordFormData,
} from "@/components/dashboard/types";
import type { UserCard } from "@/lib/cards";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import AuthSection from "@/components/dashboard/AuthSection";
import ForgotPasswordForm from "@/components/dashboard/ForgotPasswordForm";
import CardForm from "@/components/dashboard/CardForm";
import WorkForm from "@/components/dashboard/WorkForm";
import WorkList from "@/components/dashboard/WorkList";
import CardPreview from "@/components/dashboard/CardPreview";
import EmptyState from "@/components/dashboard/EmptyState";

const blankWork: WorkFormData = {
  title: "",
  url: "",
  description: "",
  type: "link",
  cloudinaryPublicId: "",
};

export default function CardDashboard() {
  const { data: cardsData, isLoading: cardsLoading } = useCards();
  const cards = cardsData?.cards || [];
  const themes = cardsData?.themes || [];

  const { mutate: saveCard, isPending: cardSaving } = useSaveCard();
  const { mutate: saveWork, isPending: workSaving } = useSaveWork();
  const { mutate: deleteWork } = useDeleteWork();
  const { mutate: changePassword, isPending: passwordChanging } =
    useChangePassword();

  const {
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
    clearState,
  } = useDashboardState();

  const selectedCard = cards.find((card) => card.id === selectedId);

  function applyCard(card: UserCard) {
    setSelectedId(card.id);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", card.theme);
    }
  }

  async function handleCardSubmit(data: CardFormData) {
    setLoadingState("card", true);
    try {
      await saveCard({ card: data, selectedCard });
      setMessage("Card saved.");
    } catch (error: any) {
      setMessage(error.message ?? "Unable to save card.");
    } finally {
      setLoadingState("card", false);
    }
  }

  async function handleWorkSubmit(data: WorkFormData) {
    if (!selectedCard) return;
    setLoadingState("work", true);
    try {
      await saveWork({ cardId: selectedCard.id, work: data });
      setMessage("Work added.");
    } catch (error: any) {
      setMessage(error.message ?? "Unable to add work.");
    } finally {
      setLoadingState("work", false);
    }
  }

  async function handlePasswordSubmit(data: PasswordFormData) {
    setLoadingState("password", true);
    try {
      await changePassword(data);
      setMessage("Password updated.");
    } catch (error: any) {
      setMessage(error.message ?? "Unable to update password.");
    } finally {
      setLoadingState("password", false);
    }
  }

  return (
    <>
      {message && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-info max-w-sm shadow-lg">
            <span>{message}</span>
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => setMessage("")}
              type="button"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <DashboardLayout
        sidebar={
          <Sidebar
            cards={cards}
            selectedCardId={selectedId}
            onSelectCard={applyCard}
            onNewCard={() => {
              setSelectedId("");
              clearState();
            }}
          />
        }
        header={
          <DashboardHeader
            selectedCard={selectedCard}
            onNewCard={() => {
              setSelectedId("");
              clearState();
            }}
          />
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            {showForgotPassword ? (
              <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
                <ForgotPasswordForm
                  onBack={() => {
                    setShowForgotPassword(false);
                    setForgotEmail("");
                    setMessage("");
                  }}
                  setMessage={setMessage}
                />
              </div>
            ) : (
              <>
                {cardsLoading ? (
                  <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
                    <div className="h-6 w-32 animate-pulse rounded bg-base-300"></div>
                  </div>
                ) : (
                  <>
                    <CardForm
                      selectedCard={selectedCard}
                      themes={themes}
                      onSubmit={handleCardSubmit}
                      loading={cardSaving}
                    />
                    <WorkForm
                      selectedCard={selectedCard}
                      onSubmit={handleWorkSubmit}
                      loading={workSaving}
                    />
                  </>
                )}
              </>
            )}
          </div>

          <aside className="space-y-6">
            {selectedCard ? (
              <>
                <CardPreview
                  selectedCard={selectedCard}
                  onSubmitPassword={handlePasswordSubmit}
                  passwordLoading={passwordChanging}
                />
                <WorkList
                  works={selectedCard.works}
                  onRemove={(workId) =>
                    deleteWork({ cardId: selectedCard.id, workId })
                  }
                />
              </>
            ) : (
              <EmptyState
                type={cards.length > 0 ? "no-selection" : "no-card"}
              />
            )}
          </aside>
        </div>
      </DashboardLayout>
    </>
  );
}
