"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

type ForgotPasswordFormProps = {
  forgotEmail: string;
  setForgotEmail: (email: string) => void;
  onBack: () => void;
  setMessage: (msg: string) => void;
};

export default function ForgotPasswordForm({
  forgotEmail,
  setForgotEmail,
  onBack,
  setMessage
}: ForgotPasswordFormProps) {
  const [resetLoading, setResetLoading] = useState(false);

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!forgotEmail) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setResetLoading(true);
      const check = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const { exists } = await check.json();
      if (!exists) {
        setMessage("Email not found.");
        setResetLoading(false);
        return;
      }
    } catch {
      // proceed anyway if check fails
    }

    const { error } = await authClient.requestPasswordReset({
      email: forgotEmail,
      redirectTo: "/reset-password"
    });

    setResetLoading(false);
    if (error) {
      setMessage(error.message ?? "Failed to send reset email.");
    } else {
      setMessage("Password reset email sent! Check your inbox.");
      onBack();
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleReset}>
      <p className="text-sm">Enter your email to receive a password reset link.</p>
      <input
        className="input input-bordered input-sm w-full"
        placeholder="Email"
        type="email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
      />
      <button className="btn btn-primary btn-sm w-full" type="submit" disabled={resetLoading}>
        {resetLoading ? <span className="loading loading-spinner"></span> : "Send reset link"}
      </button>
      <button
        className="btn btn-ghost btn-sm w-full"
        type="button"
        onClick={onBack}
      >
        Back to sign in
      </button>
    </form>
  );
}
