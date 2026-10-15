"use client";

import { useState } from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { useSaveSocial, useDeleteSocial } from "@/lib/hooks/useDashboardQuery";
import type { SocialLink } from "@/lib/cards";

const platformConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  github: { icon: FaGithub, label: "GitHub" },
  twitter: { icon: FaTwitter, label: "Twitter" },
  linkedin: { icon: FaLinkedin, label: "LinkedIn" },
  youtube: { icon: FaYoutube, label: "YouTube" },
  instagram: { icon: FaInstagram, label: "Instagram" },
  website: { icon: FaGlobe, label: "Website" },
};

type SocialLinksTileProps = {
  socialLinks: SocialLink[];
  cardId: string;
};

export default function SocialLinksTile({ socialLinks, cardId }: SocialLinksTileProps) {
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("github");
  const [url, setUrl] = useState("");

  const saveSocial = useSaveSocial();
  const deleteSocial = useDeleteSocial();

  async function handleAdd() {
    if (!url.trim()) return;
    try {
      await saveSocial.mutateAsync({
        cardId,
        social: { platform: platform as SocialLink["platform"], url },
      });
      setUrl("");
      setPlatform("github");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add social link:", error);
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 h-full">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Social Links
      </p>

      {socialLinks.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 py-2">No social links yet</p>
      )}

      {socialLinks.map((link) => {
        const config = platformConfig[link.platform];
        const Icon = config?.icon;
        return (
          <div
            key={link.id}
            className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0"
          >
            {Icon && <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />}
            <span className="text-sm text-gray-700 flex-1 truncate">
              {config?.label ?? link.platform}
            </span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600 truncate max-w-[120px]"
            >
              {link.url.replace(/^https?:\/\//, "")}
            </a>
            <button
              type="button"
              onClick={() => deleteSocial.mutate({ cardId, socialId: link.id })}
              className="text-gray-300 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}

      {showForm && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full cursor-pointer"
          >
            {Object.entries(platformConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saveSocial.isPending || !url.trim()}
              className="bg-gray-900 text-white text-sm px-5 py-2 rounded-full font-medium disabled:opacity-50"
            >
              {saveSocial.isPending ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setUrl(""); }}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <p
          className="text-xs text-gray-400 mt-2 cursor-pointer hover:text-gray-600"
          onClick={() => setShowForm(true)}
        >
          + Add social link
        </p>
      )}
    </div>
  );
}
