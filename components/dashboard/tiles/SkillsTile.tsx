"use client";

import { useFormContext } from "react-hook-form";
import type { CardFormData } from "@/components/dashboard/types";

export default function SkillsTile() {
  const { register } = useFormContext<CardFormData>();

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Skills
      </p>
      <input
        {...register("skills")}
        placeholder="Next.js, Prisma, PostgreSQL"
        className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
      />
      <p className="text-xs text-gray-400 mt-2">Comma-separated</p>
    </div>
  );
}
