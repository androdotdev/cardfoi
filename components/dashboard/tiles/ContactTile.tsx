"use client";

import { useFormContext } from "react-hook-form";
import type { CardFormData } from "@/components/dashboard/types";

export default function ContactTile() {
  const { register, formState: { errors } } = useFormContext<CardFormData>();

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 col-span-2">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Contact
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="email@example.com"
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("phone")}
            placeholder="+1 234 567 890"
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
