"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@/lib/validation/dashboardSchemas";
import { useChangePassword } from "@/lib/hooks/useDashboardQuery";
import type { PasswordFormData } from "@/components/dashboard/types";

export default function PasswordTile() {
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  }

  if (!showForm) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Password
        </p>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Change password
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Change Password
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input
            {...register("currentPassword")}
            type="password"
            placeholder="Current password"
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
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
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm password"
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="bg-gray-900 text-white text-sm px-5 py-2 rounded-full font-medium disabled:opacity-50"
          >
            {changePassword.isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              reset();
            }}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
