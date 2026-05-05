"use client";

import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

type ForgotPasswordFormProps = {
  onBack: () => void;
  setMessage: (msg: string) => void;
};

export default function ForgotPasswordForm({
  onBack,
  setMessage
}: ForgotPasswordFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({
    defaultValues: { email: "" }
  });

  async function onSubmit(data: { email: string }) {
    if (!data.email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const check = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email })
      });
      const { exists } = await check.json();
      if (!exists) {
        setMessage("Email not found.");
        return;
      }
    } catch {
      // proceed if check fails
    }

    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password"
    });

    if (error) {
      setMessage(error.message ?? "Failed to send reset email.");
    } else {
      setMessage("Password reset email sent! Check your inbox.");
      onBack();
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm">Enter your email to receive a password reset link.</p>
      <div>
        <input
          className="input input-bordered input-sm w-full"
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span className="text-sm text-error">{errors.email.message}</span>}
      </div>
      <button className="btn btn-primary btn-sm w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <span className="loading loading-spinner"></span> : "Send reset link"}
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
