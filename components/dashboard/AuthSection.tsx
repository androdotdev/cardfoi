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
          <p className="truncate text-[#5c5c5a] text-sm">{session.data.user.email}</p>
        </div>
        <button className="border border-gray-200 text-sm px-4 py-2 rounded w-full hover:bg-gray-50" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full rounded overflow-hidden">
        <button
          type="button"
          onClick={() => setAuthMode("signin")}
          className={`flex-1 text-sm px-4 py-2 border ${
            authMode === "signin"
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("signup")}
          className={`flex-1 text-sm px-4 py-2 border ${
            authMode === "signup"
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          Sign up
        </button>
      </div>
      {authMode === "signup" ? (
        <div>
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
        </div>
      ) : null}
      <div>
        <input
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            placeholder="Email"
            type="email"
            {...register("email")}
            suppressHydrationWarning
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
        </div>
      <div>
        <input
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
        </div>
      <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded w-full disabled:opacity-50" type="submit" disabled={session.isPending}>
        {authMode === "signup" ? "Create account" : "Sign in"}
      </button>
      {authMode === "signin" ? (
        <button
          className="text-sm text-gray-500 hover:text-gray-700 no-underline"
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
