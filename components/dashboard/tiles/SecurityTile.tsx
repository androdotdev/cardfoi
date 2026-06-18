"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@/lib/validation/dashboardSchemas";
import { useChangePassword } from "@/lib/hooks/useDashboardQuery";
import type { PasswordFormData } from "@/components/dashboard/types";

export default function SecurityTile() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormData) {
    try {
      await changePassword.mutateAsync(data);
      reset();
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  }

  async function handleDeleteSelf() {
    const confirmed = window.confirm(
      "Are you sure you want to delete YOUR account? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/";
      } else {
        alert(data.error ?? "Failed to delete account.");
        setIsDeleting(false);
      }
    } catch {
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="bg-white border border-[#ebebea] rounded-xl p-7">
      <p className="text-[11px] uppercase tracking-[0.1em] text-[#9a9a97] mb-5">
        Security
      </p>

      {/* Change password */}
      <div className="border border-[#ebebea] rounded-xl p-5 mb-6">
        <p className="text-[13px] font-medium text-[#0a0a0a] mb-1">Password</p>
        <p className="text-[12px] text-[#5c5c5a] mb-4">Update your account password</p>
        {!showPasswordForm ? (
          <button
            type="button"
            onClick={() => setShowPasswordForm(true)}
            className="border border-[#ebebea] text-sm px-4 py-2 rounded-full text-[#5c5c5a] hover:text-[#0a0a0a] hover:border-[#d4d4d2] transition-colors"
          >
            Update password
          </button>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <input
                {...register("currentPassword")}
                type="password"
                placeholder="Current password"
                className="bg-[#fafaf8] border border-[#ebebea] rounded-lg px-4 py-2.5 text-sm w-full text-[#5c5c5a] focus:border-[#d4d4d2] transition-colors"
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("newPassword")}
                type="password"
                placeholder="New password"
                className="bg-[#fafaf8] border border-[#ebebea] rounded-lg px-4 py-2.5 text-sm w-full text-[#5c5c5a] focus:border-[#d4d4d2] transition-colors"
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm new password"
                className="bg-[#fafaf8] border border-[#ebebea] rounded-lg px-4 py-2.5 text-sm w-full text-[#5c5c5a] focus:border-[#d4d4d2] transition-colors"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={changePassword.isPending}
                className="bg-[#0a0a0a] text-white text-sm px-5 py-2 rounded-full font-medium disabled:opacity-40 transition-opacity"
              >
                {changePassword.isPending ? "Saving..." : "Update password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  reset();
                }}
                className="text-sm text-[#9a9a97] hover:text-[#5c5c5a] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Danger zone */}
      <div className="border border-red-200 rounded-xl p-5">
        <p className="text-[13px] font-medium text-red-500 mb-1">Delete account</p>
        <p className="text-[12px] text-[#5c5c5a] mb-3">
          Permanently removes your account, cards, works, sessions, and all associated data. This cannot be undone.
        </p>
        <button
          onClick={handleDeleteSelf}
          disabled={isDeleting}
          className="border border-red-200 text-red-500 text-sm px-4 py-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
          type="button"
        >
          {isDeleting ? "Deleting..." : "Delete my account"}
        </button>
      </div>
    </div>
  );
}
