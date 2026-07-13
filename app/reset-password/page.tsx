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
      <main className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="rounded-box border border-base-300 bg-base-100 p-8 shadow-sm max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
          <p className="text-base-content/70">This password reset link is invalid or has expired.</p>
          <Link href="/dashboard" className="btn btn-primary mt-6 w-full">Back to Sign In</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200">
      <form className="rounded-box border border-base-300 bg-base-100 p-8 shadow-sm max-w-md w-full space-y-4" onSubmit={handleReset}>
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-sm text-base-content/70">Enter your new password below.</p>

        <div className="form-control">
          <span className="label-text">New Password</span>
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="form-control">
          <span className="label-text">Confirm Password</span>
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {message ? (
          <div className={`alert ${message.includes("successful") ? "alert-success" : "alert-error"} text-sm`}>
            {message}
          </div>
        ) : null}

        <button className="btn btn-primary w-full" type="submit" disabled={loading}>
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
