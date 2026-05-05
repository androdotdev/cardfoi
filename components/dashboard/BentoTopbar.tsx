"use client";

import { useFormContext } from "react-hook-form";
import type { CardFormData } from "@/components/dashboard/types";

type BentoTopbarProps = {
  onSave: () => void;
  loading?: boolean;
};

export default function BentoTopbar({ onSave, loading = false }: BentoTopbarProps) {
  const { formState: { isDirty }, watch } = useFormContext<CardFormData>();
  const name = watch("name");

  return (
    <div className="flex items-center gap-3 mb-5">
      <a href="/" className="font-medium text-base hover:opacity-70 transition-opacity">Cardfoi</a>
      {name && (
        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
          {name}
        </span>
      )}
      {isDirty && (
        <span className="text-xs text-gray-400">● Unsaved</span>
      )}
      <button
        className="ml-auto bg-gray-900 text-white text-sm px-5 py-2 rounded-full font-medium disabled:opacity-50"
        disabled={!isDirty || loading}
        onClick={onSave}
        type="button"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
