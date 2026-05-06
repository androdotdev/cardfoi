"use client";

import { useFormContext } from "react-hook-form";
import type { CardFormData } from "@/components/dashboard/types";

export default function BioTile() {
  const { register, formState: { errors } } = useFormContext<CardFormData>();

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Bio
      </p>
      <textarea
        {...register("description")}
        rows={4}
        placeholder="Tell people about yourself..."
        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-500 resize-none"
      />
      {errors.description && (
        <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
      )}
    </div>
  );
}
