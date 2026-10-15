"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error } = await authClient.resetPassword({
      token,
      newPassword: password
    });
    setLoading(false);

        if (error) {
          setMessage(error.message ?? "Failed to reset password.");
        } else {
          setMessage("Password reset successful! Redirecting to sign in...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted">
        <div className="border border-muted bg-surface p-8 shadow-sm max-w-md w-full rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
          <p className="text-content-70">This password reset link is invalid or has expired.</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-content transition-colors hover:opacity-90"
          >
            Back to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <form className="border border-muted bg-surface p-8 shadow-sm max-w-md w-full rounded-2xl space-y-4" onSubmit={handleReset}>
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-sm text-content-70">Enter your new password below.</p>

        <div>
          <span className="text-sm font-medium text-content-dim">New Password</span>
          <input
            className="mt-1 block w-full rounded-lg border border-muted bg-surface px-4 py-2.5 text-sm text-content transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-[color:var(--clr-accent)]/30"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div>
          <span className="text-sm font-medium text-content-dim">Confirm Password</span>
          <input
            className="mt-1 block w-full rounded-lg border border-muted bg-surface px-4 py-2.5 text-sm text-content transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-[color:var(--clr-accent)]/30"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {message ? (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              message.includes("successful")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        ) : null}

        <button
          className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-content transition-colors hover:opacity-90 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
