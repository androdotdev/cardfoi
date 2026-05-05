"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/lib/validation/dashboardSchemas";
import type { UserCard } from "@/lib/cards";
import type { ApiState } from "./types";

type AuthSectionProps = {
  session: ReturnType<typeof authClient.useSession>;
  onSignOut: () => Promise<void>;
  onAuthSuccess: (cards: UserCard[]) => void;
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  async function onSubmit(data: { name?: string; email: string; password: string }) {
    setMessage("");

    const result =
      authMode === "signup"
        ? await authClient.signUp.email({
            name: data.name || "",
            email: data.email,
            password: data.password
          })
        : await authClient.signIn.email({
            email: data.email,
            password: data.password
          });

    if (result.error) {
      setMessage(result.error.message ?? "Authentication failed.");
      return;
    }

    await session.refetch();
    const res = await fetch("/api/cards", { cache: "no-store" });
    const responseData = await res.json();
    onAuthSuccess(responseData.cards);
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
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
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
        <div>
          <input
            className="input input-bordered input-sm w-full"
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && <span className="text-sm text-error">{errors.name.message}</span>}
        </div>
      ) : null}
      <div>
        <input
          className="input input-bordered input-sm w-full"
          placeholder="Email"
          type="email"
          {...register("email")}
          suppressHydrationWarning
        />
        {errors.email && <span className="text-sm text-error">{errors.email.message}</span>}
      </div>
      <div>
        <input
          className="input input-bordered input-sm w-full"
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && <span className="text-sm text-error">{errors.password.message}</span>}
      </div>
      <button className="btn btn-primary btn-sm w-full" type="submit" disabled={session.isPending}>
        {authMode === "signup" ? "Create account" : "Sign in"}
      </button>
      {authMode === "signin" ? (
        <button
          className="btn btn-link btn-sm w-full"
          type="button"
          onClick={() => {
            setShowForgotPassword(true);
            setForgotEmail(session.data?.user?.email || "");
          }}
        >
          Forgot password?
        </button>
      ) : null}
    </form>
  );
}
