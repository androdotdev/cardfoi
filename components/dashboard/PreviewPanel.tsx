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
    <div className="fixed top-0 right-0 h-screen w-[400px] bg-white border-l border-gray-100 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <span className="text-sm font-medium">Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 hover:bg-gray-100 rounded"
            type="button"
            title="Close preview"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Template Selector */}
      <div className="px-4 py-3 border-b border-gray-100">
        <select
          value={currentTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="text-sm border border-gray-100 rounded-lg bg-gray-50 px-3 py-2 w-full"
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
        <div className="scale-[0.85] origin-top-center" style={{ pointerEvents: "none" } as React.CSSProperties}>
          <TemplateComponent card={mockCard} />
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-4 border-t border-gray-100">
        <a
          href={`/${cardId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-200 bg-white text-sm px-3 py-1.5 rounded w-full inline-block text-center no-underline"
        >
          Open full card ↗
        </a>
      </div>
    </div>
  );
}
