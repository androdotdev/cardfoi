"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/lib/validation/dashboardSchemas";
import type { UserCard } from "@/lib/cards";
import { useStore } from "@nanostores/react";
import { authModeStore, authMessageStore, setAuthMode, setAuthMessage } from "@/lib/stores/authStore";
import { FiLoader } from "react-icons/fi";

type AuthSectionProps = {
  session: ReturnType<typeof authClient.useSession>;
  onAuthSuccess: (cards: UserCard[]) => void;
};

export default function AuthSection({
  session,
  onAuthSuccess
}: AuthSectionProps) {
  const authMode = useStore(authModeStore);
  const message = useStore(authMessageStore);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  async function onSubmit(data: { name?: string; email: string; password: string }) {
    setAuthMessage("");
    setLoading(true);

    try {
      if (authMode === "signup") {
        const result = await authClient.signUp.email({
          name: data.name || "",
          email: data.email,
          password: data.password
        });

        if (result.error) {
          setAuthMessage(result.error.message ?? "Signup failed.");
          return;
        }

        setAuthMessage("Account created! Check your email to verify your account.");
        setAuthMode("signin");
        return;
      }

      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password
      });

      if (result.error) {
        const msg = result.error.message ?? "";
        if (msg.toLowerCase().includes("verify") || msg.toLowerCase().includes("verification")) {
          setAuthMessage("Please verify your email before signing in.");
        } else {
          setAuthMessage(msg);
        }
        return;
      }

      await session.refetch();
      const res = await fetch("/api/cards", { cache: "no-store" });
      const responseData = await res.json();
      onAuthSuccess(responseData.cards);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setAuthMessage("");

    const { error } = await authClient.requestPasswordReset({
      email: resetEmail,
      redirectTo: "/reset-password",
    });

    setResetLoading(false);

    if (error) {
      setAuthMessage(error.message ?? "Failed to send reset email.");
    } else {
      setAuthMessage("Check your email for password reset link!");
      setShowForgotPassword(false);
      setResetEmail("");
    }
  }

  if (showForgotPassword) {
    return (
      <form className="space-y-3" onSubmit={handleForgotPassword}>
        <div className="text-center mb-4">
          <h3 className="font-medium">Reset Password</h3>
          <p className="text-sm text-gray-600">Enter your email to receive reset link</p>
        </div>
        <div>
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={resetLoading}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {resetLoading ? "Sending..." : "Send Reset Link"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForgotPassword(false);
            setResetEmail("");
          }}
          className="text-sm text-gray-500 hover:text-gray-700 w-full text-center"
        >
          Back to Sign In
        </button>
        {message && (
          <p className={`text-sm ${message.includes("Check your email") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </form>
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
      <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded w-full disabled:opacity-50 flex items-center justify-center gap-2" type="submit" disabled={loading}>
        {loading ? (
          <><FiLoader className="animate-spin h-3 w-3" /> {authMode === "signup" ? "Creating..." : "Signing in..."}</>
        ) : (
          authMode === "signup" ? "Create account" : "Sign in"
        )}
      </button>
      {authMode === "signin" && !showForgotPassword && (
        <button
          type="button"
          onClick={() => {
            setShowForgotPassword(true);
            setResetEmail("");
          }}
          className="text-sm text-gray-500 hover:text-gray-700 no-underline w-full text-center"
        >
          Forgot password?
        </button>
      )}
      {message && (
        <p className={`text-sm ${message.includes("Account created") || message.includes("Check your email") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
