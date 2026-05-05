"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { UserCard, WorkMedia } from "@/lib/cards";
import type { ApiState, CardFormData, WorkFormData, PasswordFormData } from "@/components/dashboard/types";

import AuthSection from "@/components/dashboard/AuthSection";
import ForgotPasswordForm from "@/components/dashboard/ForgotPasswordForm";
import CardForm from "@/components/dashboard/CardForm";
import WorkForm from "@/components/dashboard/WorkForm";
import WorkList from "@/components/dashboard/WorkList";
import CardPreview from "@/components/dashboard/CardPreview";
import Sidebar from "@/components/dashboard/Sidebar";

const blankCard: CardFormData = {
  name: "",
  email: "",
  phone: "",
  avatar: "",
  description: "",
  skills: "",
  theme: "corporate",
  template: "minimal"
};

const blankWork: WorkFormData = {
  title: "",
  url: "",
  description: "",
  type: "link" as WorkMedia["type"],
  cloudinaryPublicId: ""
};

export default function CardDashboard() {
  const session = authClient.useSession();
  const [state, setState] = useState<ApiState>({ cards: [], themes: [] });
  const [selectedId, setSelectedId] = useState("");
  const [cardForm, setCardForm] = useState(blankCard);
  const [workForm, setWorkForm] = useState(blankWork);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");

  const selectedCard = useMemo(
    () => state.cards.find((card) => card.id === selectedId),
    [selectedId, state.cards]
  );

  useEffect(() => {
    if (session.isPending) return;
    void loadCards().then((data) => {
      if (data.cards[0]) applyCard(data.cards[0]);
    });
  }, [session.isPending, session.data]);

  function applyCard(card: UserCard) {
    setSelectedId(card.id);
    setCardForm({
      name: card.name,
      email: card.email,
      phone: card.phone,
      avatar: card.avatar ?? "",
      description: card.description,
      skills: card.skills.join(", "),
      theme: card.theme,
      template: card.template ?? "minimal"
    });
    document.documentElement.setAttribute("data-theme", card.theme);
  }

  function onAuthSuccess(cards: ApiState) {
    setState(cards);
    if (cards.cards[0]) applyCard(cards.cards[0]);
  }

  async function loadCards() {
    const response = await fetch("/api/cards", { cache: "no-store" });
    const data = (await response.json()) as ApiState;
    setState(data);
    return data;
  }

  async function signOut() {
    await authClient.signOut();
    setSelectedId("");
    setCardForm(blankCard);
    setState({ cards: [], themes: state.themes });
    await session.refetch();
  }

  async function submitCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const endpoint = selectedCard ? `/api/cards/${selectedCard.id}` : "/api/cards";
    const response = await fetch(endpoint, {
      method: selectedCard ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardForm)
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Unable to save card.");
      return;
    }

    setMessage("Card saved.");
    await loadCards();
    applyCard(data.card);
  }

  async function submitWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCard) return;

    if (workForm.url && !/^https?:\/\//i.test(workForm.url)) {
      setMessage("Please enter a valid URL starting with http:// or https://");
      return;
    }

    const response = await fetch(`/api/cards/${selectedCard.id}/works`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workForm)
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Unable to add work.");
      return;
    }

    setWorkForm(blankWork);
    setMessage("Work added.");
    refreshCard();
  }

  async function removeWork(workId: string) {
    if (!selectedCard) return;
    await fetch(`/api/cards/${selectedCard.id}/works/${workId}`, { method: "DELETE" });
    setMessage("Work removed.");
    refreshCard();
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        revokeOtherSessions: true
      })
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? "Unable to update password.");
      return;
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage("Password updated.");
  }

  async function refreshCard() {
    const nextState = await loadCards();
    const updated = nextState.cards.find((card) => card.id === selectedId);
    if (updated) applyCard(updated);
  }

  return (
    <main className="min-h-screen bg-base-200">
      {message ? (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-info max-w-sm shadow-lg">
            <span>{message}</span>
            <button className="btn btn-ghost btn-xs" onClick={() => setMessage("")} type="button">
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar
          cards={state.cards}
          selectedCardId={selectedId}
          onSelectCard={applyCard}
          onNewCard={() => {
            setSelectedId("");
            setCardForm(blankCard);
          }}
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            {showForgotPassword ? (
              <div className="rounded-box border border-base-300 bg-base-100 p-5">
                <ForgotPasswordForm
                  forgotEmail={forgotEmail}
                  setForgotEmail={setForgotEmail}
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
                <div className="rounded-box border border-base-300 bg-base-100 p-4">
                  <AuthSection
                    session={session}
                    onSignOut={signOut}
                    onAuthSuccess={onAuthSuccess}
                    setMessage={setMessage}
                    setShowForgotPassword={setShowForgotPassword}
                    setForgotEmail={setForgotEmail}
                  />
                </div>
                <CardForm
                  cardForm={cardForm}
                  setCardForm={setCardForm}
                  selectedCard={selectedCard}
                  themes={state.themes}
                  onSubmit={submitCard}
                  setMessage={setMessage}
                />
                <WorkForm
                  workForm={workForm}
                  setWorkForm={setWorkForm}
                  selectedCard={selectedCard}
                  onSubmit={submitWork}
                  setMessage={setMessage}
                />
              </>
            )}
          </div>

          <aside className="space-y-6">
            {selectedCard ? (
              <>
                <CardPreview
                  selectedCard={selectedCard}
                  passwordForm={passwordForm}
                  setPasswordForm={setPasswordForm}
                  onSubmitPassword={submitPassword}
                  onRemoveWork={removeWork}
                />
                <WorkList works={selectedCard.works} onRemove={removeWork} />
              </>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}
