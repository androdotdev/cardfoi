"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { ApiState } from "./types";

type AuthSectionProps = {
  session: ReturnType<typeof authClient.useSession>;
  onSignOut: () => Promise<void>;
  onAuthSuccess: (cards: ApiState) => void;
  setMessage: (msg: string) => void;
  setShowForgotPassword: (show: boolean) => void;
  setForgotEmail: (email: string) => void;
};

export default function AuthSection({
  session,
  onSignOut,
  onAuthSuccess,
  setMessage,
  setShowForgotPassword,
  setForgotEmail
}: AuthSectionProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

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
    const res = await fetch("/api/cards", { cache: "no-store" });
    const data = (await res.json()) as ApiState;
    onAuthSuccess(data);
    setMessage(authMode === "signup" ? "Account created." : "Signed in.");
  }

  if (session.data) {
    return (
      <div className="space-y-3">
        <div>
          <p className="font-medium">{session.data.user.name}</p>
          <p className="truncate text-base-content/60">{session.data.user.email}</p>
          <span className="badge badge-outline mt-2">{session.data.user.role ?? "user"}</span>
        </div>
        <button className="btn btn-sm btn-outline w-full" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={submitAuth}>
      <div className="join w-full">
        <button
          className={`btn join-item btn-sm flex-1 ${authMode === "signin" ? "btn-active" : ""}`}
          type="button"
          onClick={() => setAuthMode("signin")}
        >
          Sign in
        </button>
        <button
          className={`btn join-item btn-sm flex-1 ${authMode === "signup" ? "btn-active" : ""}`}
          type="button"
          onClick={() => setAuthMode("signup")}
        >
          Sign up
        </button>
      </div>
      {authMode === "signup" ? (
        <input
          className="input input-bordered input-sm w-full"
          placeholder="Name"
          value={authForm.name}
          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
        />
      ) : null}
      <input
        className="input input-bordered input-sm w-full"
        placeholder="Email"
        type="email"
        value={authForm.email}
        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
        suppressHydrationWarning
      />
      <input
        className="input input-bordered input-sm w-full"
        placeholder="Password"
        type="password"
        value={authForm.password}
        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
      />
      <button className="btn btn-primary btn-sm w-full" type="submit" disabled={session.isPending}>
        {authMode === "signup" ? "Create account" : "Sign in"}
      </button>
      {authMode === "signin" ? (
        <button
          className="btn btn-link btn-sm w-full"
          type="button"
          onClick={() => {
            setShowForgotPassword(true);
            setForgotEmail(authForm.email);
          }}
        >
          Forgot password?
        </button>
      ) : null}
    </form>
  );
}
