"use client";

import { useFormContext } from "react-hook-form";
import type { CardFormData } from "@/components/dashboard/types";

type ThemeTileProps = {
  themes: string[];
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

export default function ThemeTile({ themes }: ThemeTileProps) {
  const { watch, setValue } = useFormContext<CardFormData>();
  const currentTheme = watch("theme");
  const currentTemplate = watch("template");

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 h-full flex flex-col">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Theme
      </p>
      <div className="bg-gray-50 rounded-lg p-3 mb-5 flex-1 flex items-center">
        <div className="flex flex-wrap gap-3">
          {themes.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => setValue("theme", theme, { shouldDirty: true })}
              style={{ background: themeColors[theme] || "#888" }}
              className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                currentTheme === theme ? "ring-2 ring-offset-2 ring-gray-800" : ""
              }`}
              title={theme}
            />
          ))}
        </div>
      </div>
      <select
        value={currentTemplate}
        onChange={(e) => setValue("template", e.target.value, { shouldDirty: true })}
        className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full cursor-pointer"
      >
        <option value="minimal">Minimal</option>
        <option value="cover">Cover Card</option>
        <option value="sidebar">Sidebar Layout</option>
        <option value="terminal">Terminal/Dev</option>
        <option value="glass">Glass Morphism</option>
        <option value="timeline">Timeline</option>
      </select>
    </div>
  );
}
