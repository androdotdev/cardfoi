"use client";

import type { CardFormData } from "@/components/dashboard/types";
import type { UserCard } from "@/lib/cards";

import MinimalTemplate from "@/components/templates/MinimalTemplate";
import CoverTemplate from "@/components/templates/CoverTemplate";
import SidebarTemplate from "@/components/templates/SidebarTemplate";
import TerminalTemplate from "@/components/templates/TerminalTemplate";
import GlassTemplate from "@/components/templates/GlassTemplate";
import TimelineTemplate from "@/components/templates/TimelineTemplate";

const templateMap: Record<string, React.ComponentType<{ card: UserCard }>> = {
  minimal: MinimalTemplate,
  cover: CoverTemplate,
  sidebar: SidebarTemplate,
  terminal: TerminalTemplate,
  glass: GlassTemplate,
  timeline: TimelineTemplate,
};

type PreviewPanelProps = {
  onClose: () => void;
  cardId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  description: string;
  skills: string;
  theme: string;
  template: string;
  onTemplateChange: (template: string) => void;
};

export default function PreviewPanel({
  onClose,
  cardId,
  name,
  email,
  phone,
  avatar,
  description,
  skills,
  theme,
  template,
  onTemplateChange,
}: PreviewPanelProps) {
  const currentTemplate = template || "minimal";

  const mockCard: UserCard = {
    id: cardId,
    ownerId: "",
    name: name || "Your Name",
    email: email || "you@example.com",
    phone: phone || "",
    avatar: avatar || undefined,
    description: description || "Tell visitors about yourself...",
    skills: typeof skills === "string" ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
    theme: theme || "corporate",
    template: currentTemplate,
    works: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const TemplateComponent = templateMap[currentTemplate] || MinimalTemplate;

  return (
    <div className="fixed top-0 right-0 h-screen w-[280px] bg-base-100 border-l border-base-300 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <span className="text-sm font-medium">Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs"
            type="button"
            title="Close preview"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Template Selector */}
      <div className="px-4 py-3 border-b border-base-300">
        <select
          value={currentTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="select select-sm w-full bg-base-200"
        >
          <option value="minimal">Minimal</option>
          <option value="cover">Cover Card</option>
          <option value="sidebar">Sidebar Layout</option>
          <option value="terminal">Terminal/Dev</option>
          <option value="glass">Glass Morphism</option>
          <option value="timeline">Timeline</option>
        </select>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4" data-theme={theme || "corporate"}>
        <div className="scale-[0.6] origin-top-center" style={{ pointerEvents: "none" } as React.CSSProperties}>
          <TemplateComponent card={mockCard} />
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-4 border-t border-base-300">
        <a
          href={`/${cardId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline w-full no-underline"
        >
          Open full card ↗
        </a>
      </div>
    </div>
  );
}
