"use client";

import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@/lib/validation/dashboardSchemas";
import type { PasswordFormData } from "./types";

type PasswordFormProps = {
  onSubmit: (data: PasswordFormData) => void;
  loading?: boolean;
};

export default function PasswordForm({ onSubmit, loading = false }: PasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  return (
    <form className="mt-6 border-t border-base-300 pt-5" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="mb-3 font-semibold">Password</h3>
      <div className="space-y-3">
        <div>
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Current password"
            {...register("currentPassword")}
          />
          {errors.currentPassword && <span className="text-sm text-error">{errors.currentPassword.message}</span>}
        </div>
        <div>
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="New password"
            {...register("newPassword")}
          />
          {errors.newPassword && <span className="text-sm text-error">{errors.newPassword.message}</span>}
        </div>
        <div>
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Confirm new password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <span className="text-sm text-error">{errors.confirmPassword.message}</span>}
        </div>
        <button className="btn btn-outline btn-sm" type="submit" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-xs"></span> : <Save size={14} />}
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </div>
    </form>
  );
}
