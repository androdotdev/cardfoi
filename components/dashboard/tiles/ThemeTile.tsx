"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { UserCard } from "@/lib/cards";
import { useSaveCard, useCards } from "@/lib/hooks/useDashboardQuery";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";

type ThemeTileProps = {
  selectedCard: UserCard;
};

const themeColors: Record<string, string> = {
  corporate: "#1b2a4a",
  night: "#0d0d0d",
  business: "#185fa5",
  luxury: "#d85a30",
  dracula: "#282a36",
  synthwave: "#2d1b69",
  cmyk: "#1d9e75",
  emerald: "#065f46",
};

const layoutOptions = [
  { value: "minimal", label: "Minimal" },
  { value: "cover", label: "Cover Card" },
  { value: "sidebar", label: "Sidebar" },
  { value: "terminal", label: "Terminal" },
  { value: "glass", label: "Glass" },
  { value: "timeline", label: "Timeline" },
];

export default function ThemeTile({ selectedCard }: ThemeTileProps) {
  const { data: cardsData } = useCards();
  const themes = cardsData?.themes ?? [];

  const { watch, setValue, handleSubmit, formState: { isDirty }, reset } = useForm({
    defaultValues: {
      theme: selectedCard.theme,
      template: selectedCard.template ?? "minimal",
    },
  });

  const { mutateAsync: saveCard, isPending: saving } = useSaveCard();
  const setMessage = useDashboardStore((s) => s.setMessage);

  const currentTheme = watch("theme");
  const currentTemplate = watch("template");

  useEffect(() => {
    reset({
      theme: selectedCard.theme,
      template: selectedCard.template ?? "minimal",
    });
  }, [selectedCard, reset]);

  async function onSubmit(data: { theme: string; template: string }) {
    try {
      await saveCard({
        card: {
          name: selectedCard.name,
          slug: selectedCard.id,
          email: selectedCard.email,
          avatar: selectedCard.avatar ?? "",
          description: selectedCard.description,
          skills: selectedCard.skills.join(", "),
          theme: data.theme,
          template: data.template,
        },
        selectedCard,
      });
      setMessage("Theme saved.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Unable to save theme.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white border border-[#ebebea] rounded-xl p-7">
        <p className="text-[11px] uppercase tracking-[0.1em] text-[#9a9a97] mb-5">
          Theme
        </p>

        {/* Color swatches */}
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#9a9a97] mb-3">Color accent</p>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setValue("theme", theme, { shouldDirty: true })}
                style={{ background: themeColors[theme] || "#888" }}
                className={`w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                  currentTheme === theme ? "ring-2 ring-offset-2 ring-[#0a0a0a]" : ""
                }`}
                title={theme}
              />
            ))}
          </div>
        </div>

        {/* Layout style selector */}
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#9a9a97] mb-3">Layout style</p>
          <div className="grid grid-cols-3 gap-2">
            {layoutOptions.map((opt) => {
              const isActive = currentTemplate === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("template", opt.value, { shouldDirty: true })}
                  className={`text-[12px] px-3 py-2.5 rounded-lg border transition-colors text-center ${
                    isActive
                      ? "border-[#0a0a0a] bg-[#fafaf8] text-[#0a0a0a] font-medium"
                      : "border-[#ebebea] text-[#5c5c5a] hover:border-[#d4d4d2]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={!isDirty || saving}
          style={{ backgroundColor: themeColors[currentTheme] || "#0a0a0a" }}
          className="text-white text-sm px-5 py-2 rounded-full font-medium disabled:opacity-40 transition-opacity"
        >
          {saving ? "Saving..." : "Save theme"}
        </button>
      </div>
    </form>
  );
}
