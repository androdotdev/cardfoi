"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/lib/validation/dashboardSchemas";
import type { UserCard } from "@/lib/cards";
import { useStore } from "@nanostores/react";
import {
  authModeStore,
  authMessageStore,
  setAuthMode,
  setAuthMessage,
} from "@/lib/stores/authStore";
import { FiLoader } from "react-icons/fi";

type AuthSectionProps = {
  session: ReturnType<typeof authClient.useSession>;
  onAuthSuccess: (cards: UserCard[]) => void;
};

export default function AuthSection({
  session,
  onAuthSuccess,
}: AuthSectionProps) {
  const authMode = useStore(authModeStore);
  const message = useStore(authMessageStore);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: {
    name?: string;
    email: string;
    password: string;
  }) {
    setAuthMessage("");
    setLoading(true);

    try {
      if (authMode === "signup") {
        const result = await authClient.signUp.email({
          name: data.name || "",
          email: data.email,
          password: data.password,
        });

        if (result.error) {
          setAuthMessage(result.error.message ?? "Signup failed.");
          return;
        }

        setAuthMessage(
          "Account created! Check your Inbox to verify your account. PLEASE CHECK THE SPAM FOLDER TOO!",
        );
        setAuthMode("signin");
        return;
      }

      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        const msg = result.error.message ?? "";
        if (
          msg.toLowerCase().includes("verify") ||
          msg.toLowerCase().includes("verification")
        ) {
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
          <p className="text-sm text-gray-600">
            Enter your email to receive reset link
          </p>
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
          <p
            className={`text-sm ${message.includes("Check your email") ? "text-green-600" : "text-red-500"}`}
          >
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
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
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
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>
      <div>
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>
      <button
        className="bg-gray-900 text-white text-sm px-4 py-2 rounded w-full disabled:opacity-50 flex items-center justify-center gap-2"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin h-3 w-3" />{" "}
            {authMode === "signup" ? "Creating..." : "Signing in..."}
          </>
        ) : authMode === "signup" ? (
          "Create account"
        ) : (
          "Sign in"
        )}
      </button>

      {authMode === "signin" && (
        <>
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f5f5f3] px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google" })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </>
      )}
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
        <p
          className={`text-sm ${message.includes("Account created") || message.includes("Check your email") ? "text-green-600" : "text-red-500"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
