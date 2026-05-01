"use client";

import { ExternalLink, ImageIcon, LinkIcon, Plus, Save, Trash2, UserRound } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { UserCard, WorkMedia } from "@/lib/cards";

type ApiState = {
  cards: UserCard[];
  themes: string[];
};

const blankCard = {
  name: "",
  email: "",
  phone: "",
  avatar: "",
  description: "",
  skills: "",
  theme: "corporate"
};

const blankWork = {
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
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({
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
      theme: card.theme
    });
    document.documentElement.setAttribute("data-theme", card.theme);
  }

  async function loadCards() {
    const response = await fetch("/api/cards", { cache: "no-store" });
    const data = (await response.json()) as ApiState;
    setState(data);
    return data;
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const result =
      authMode === "signup"
        ? await authClient.signUp.email({
            name: authForm.name,
            email: authForm.email,
            password: authForm.password
          })
        : await authClient.signIn.email({
            email: authForm.email,
            password: authForm.password
          });

    if (result.error) {
      setMessage(result.error.message ?? "Authentication failed.");
      return;
    }

    await session.refetch();
    const data = await loadCards();
    if (data.cards[0]) applyCard(data.cards[0]);
    setMessage(authMode === "signup" ? "Account created." : "Signed in.");
  }

  async function signOut() {
    await authClient.signOut();
    setSelectedId("");
    setCardForm(blankCard);
    setState({ cards: [], themes: state.themes });
    await session.refetch();
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
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

  async function submitSettings() {
    if (!selectedCard) return;

    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedCard.id,
        name: cardForm.name,
        avatar: cardForm.avatar
      })
    });
    const data = await response.json();

    setMessage(response.ok ? "Settings updated." : data.error ?? "Unable to update settings.");
    const nextState = await loadCards();
    const updated = nextState.cards.find((card) => card.id === selectedCard.id);
    if (updated) applyCard(updated);
  }

  async function submitWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCard) return;

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
    const nextState = await loadCards();
    const updated = nextState.cards.find((card) => card.id === selectedCard.id);
    if (updated) applyCard(updated);
  }

  async function removeWork(workId: string) {
    if (!selectedCard) return;

    await fetch(`/api/cards/${selectedCard.id}/works/${workId}`, { method: "DELETE" });
    setMessage("Work removed.");
    const nextState = await loadCards();
    const updated = nextState.cards.find((card) => card.id === selectedCard.id);
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

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-box border border-base-300 bg-base-100 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Andro Card</h1>
            <button
              className="btn btn-sm btn-ghost"
              title="Create new card"
              onClick={() => {
                setSelectedId("");
                setCardForm(blankCard);
              }}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="mb-4 rounded-box bg-base-200 p-3 text-sm">
            {session.data ? (
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{session.data.user.name}</p>
                  <p className="truncate text-base-content/60">{session.data.user.email}</p>
                  <span className="badge badge-outline mt-2">{session.data.user.role ?? "user"}</span>
                </div>
                <button className="btn btn-sm btn-outline w-full" onClick={signOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={submitAuth}>
                <div className="join w-full">
                  <button className={`btn join-item btn-sm flex-1 ${authMode === "signin" ? "btn-active" : ""}`} type="button" onClick={() => setAuthMode("signin")}>
                    Sign in
                  </button>
                  <button className={`btn join-item btn-sm flex-1 ${authMode === "signup" ? "btn-active" : ""}`} type="button" onClick={() => setAuthMode("signup")}>
                    Sign up
                  </button>
                </div>
                {authMode === "signup" ? (
                  <input className="input input-bordered input-sm w-full" placeholder="Name" value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} />
                ) : null}
                <input className="input input-bordered input-sm w-full" placeholder="Email" type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} suppressHydrationWarning />
                <input className="input input-bordered input-sm w-full" placeholder="Password" type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} />
                <button className="btn btn-primary btn-sm w-full" type="submit" disabled={session.isPending}>
                  {authMode === "signup" ? "Create account" : "Sign in"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-2">
            {state.cards.map((card) => (
              <button
                className={`btn w-full justify-start ${card.id === selectedCard?.id ? "btn-primary" : "btn-ghost"}`}
                key={card.id}
                onClick={() => applyCard(card)}
              >
                <UserRound size={18} />
                <span className="truncate">{card.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <form className="rounded-box border border-base-300 bg-base-100 p-5" onSubmit={submitCard}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Profile details</h2>
                  <p className="text-sm text-base-content/60">Slug is generated from the card name.</p>
                </div>
                <button className="btn btn-primary" type="submit">
                  <Save size={18} />
                  Save
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                  <span className="label-text">Name</span>
                  <input className="input input-bordered" value={cardForm.name} onChange={(event) => setCardForm({ ...cardForm, name: event.target.value })} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Email</span>
                  <input className="input input-bordered" type="email" value={cardForm.email} onChange={(event) => setCardForm({ ...cardForm, email: event.target.value })} required suppressHydrationWarning />
                </label>
                <label className="form-control">
                  <span className="label-text">Phone</span>
                  <input className="input input-bordered" value={cardForm.phone} onChange={(event) => setCardForm({ ...cardForm, phone: event.target.value })} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Avatar URL</span>
                  <div className="join w-full">
                    <input className="input input-bordered join-item w-full" value={cardForm.avatar} onChange={(event) => setCardForm({ ...cardForm, avatar: event.target.value })} />
                    {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
                      <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{ folder: "andro-card/avatars", resourceType: "image", sources: ["local"] }}
                        onSuccess={(result) => {
                          if (typeof result.info === "object" && "secure_url" in result.info) {
                            setCardForm({ ...cardForm, avatar: String(result.info.secure_url) });
                          }
                        }}
                      >
                        {({ open }) => (
                          <button className="btn join-item" type="button" onClick={() => open()}>
                            Upload
                          </button>
                        )}
                      </CldUploadWidget>
                    ) : null}
                  </div>
                </label>
                <label className="form-control">
                  <span className="label-text">Tech stack / skills</span>
                  <input className="input input-bordered" value={cardForm.skills} onChange={(event) => setCardForm({ ...cardForm, skills: event.target.value })} placeholder="Next.js, Prisma, PostgreSQL" />
                </label>
                <label className="form-control">
                  <span className="label-text">Theme</span>
                  <select className="select select-bordered" value={cardForm.theme} onChange={(event) => setCardForm({ ...cardForm, theme: event.target.value })}>
                    {state.themes.map((theme) => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text">Description</span>
                  <textarea className="textarea textarea-bordered min-h-28" value={cardForm.description} onChange={(event) => setCardForm({ ...cardForm, description: event.target.value })} required />
                </label>
              </div>
            </form>

            <form className="rounded-box border border-base-300 bg-base-100 p-5" onSubmit={submitWork}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Project / Work</h2>
                <button className="btn btn-secondary" type="submit" disabled={!selectedCard}>
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                  <span className="label-text">Title</span>
                  <input className="input input-bordered" value={workForm.title} onChange={(event) => setWorkForm({ ...workForm, title: event.target.value })} />
                </label>
                <label className="form-control">
                  <span className="label-text">Media type</span>
                  <select className="select select-bordered" value={workForm.type} onChange={(event) => setWorkForm({ ...workForm, type: event.target.value as WorkMedia["type"] })}>
                    <option value="link">Link</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </label>
                <label className="form-control">
                  <span className="label-text">URL</span>
                  <div className="join w-full">
                    <input className="input input-bordered join-item w-full" value={workForm.url} onChange={(event) => setWorkForm({ ...workForm, url: event.target.value })} />
                    {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
                      <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{
                          folder: "andro-card/works",
                          resourceType: workForm.type === "video" ? "video" : "image",
                          sources: ["local"]
                        }}
                        onSuccess={(result) => {
                          if (typeof result.info === "object" && "secure_url" in result.info && "public_id" in result.info) {
                            setWorkForm({
                              ...workForm,
                              url: String(result.info.secure_url),
                              cloudinaryPublicId: String(result.info.public_id)
                            });
                          }
                        }}
                      >
                        {({ open }) => (
                          <button className="btn join-item" type="button" onClick={() => open()}>
                            Upload
                          </button>
                        )}
                      </CldUploadWidget>
                    ) : null}
                  </div>
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text">Description</span>
                  <textarea className="textarea textarea-bordered" value={workForm.description} onChange={(event) => setWorkForm({ ...workForm, description: event.target.value })} />
                </label>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            {selectedCard ? (
              <div className="rounded-box border border-base-300 bg-base-100 p-5">
                <div className="flex items-start gap-4">
                  <div className="avatar placeholder">
                    <div className="h-20 w-20 rounded-full bg-neutral text-neutral-content">
                      {selectedCard.avatar ? <img src={selectedCard.avatar} alt="" /> : <span className="text-2xl">{selectedCard.name.slice(0, 1)}</span>}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold">{selectedCard.name}</h2>
                    <p className="truncate text-sm text-base-content/60">{selectedCard.email}</p>
                    <a className="btn btn-sm btn-outline mt-3" href={`/${selectedCard.id}`} target="_blank">
                      <ExternalLink size={16} />
                      Open /{selectedCard.id}
                    </a>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6">{selectedCard.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCard.skills.map((skill) => <span className="badge badge-outline" key={skill}>{skill}</span>)}
                </div>
                <button className="btn btn-sm btn-neutral mt-5" onClick={submitSettings}>
                  <Save size={16} />
                  Update name/avatar only
                </button>

                <form className="mt-6 border-t border-base-300 pt-5" onSubmit={updatePassword}>
                  <h3 className="mb-3 font-semibold">Password</h3>
                  <div className="space-y-3">
                    <input
                      className="input input-bordered w-full"
                      type="password"
                      placeholder="Current password"
                      value={passwordForm.currentPassword}
                      onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
                    />
                    <input
                      className="input input-bordered w-full"
                      type="password"
                      placeholder="New password"
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
                    />
                    <input
                      className="input input-bordered w-full"
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })}
                    />
                    <button className="btn btn-outline btn-sm" type="submit">
                      Update password
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            <div className="rounded-box border border-base-300 bg-base-100 p-5">
              <h2 className="mb-4 text-lg font-semibold">Work list</h2>
              <div className="space-y-3">
                {selectedCard?.works.map((work) => (
                  <div className="rounded-box border border-base-300 p-3" key={work.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        {work.type === "image" ? <ImageIcon size={18} /> : <LinkIcon size={18} />}
                        <div className="min-w-0">
                          <p className="font-medium">{work.title}</p>
                          <a className="link truncate text-sm" href={work.url} target="_blank">{work.url}</a>
                        </div>
                      </div>
                      <button className="btn btn-square btn-ghost btn-sm" title="Delete work" onClick={() => removeWork(work.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
