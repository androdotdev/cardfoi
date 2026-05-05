"use client";

import { useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { useSaveWork, useDeleteWork } from "@/lib/hooks/useDashboardQuery";
import { useQueryClient } from "@tanstack/react-query";
import type { WorkMedia } from "@/lib/cards";

type ProjectsTileProps = {
  works: WorkMedia[];
  cardId: string;
};

export default function ProjectsTile({ works, cardId }: ProjectsTileProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"link" | "image" | "video">("link");

  const saveWork = useSaveWork();
  const deleteWork = useDeleteWork();
  const queryClient = useQueryClient();

  async function handleAdd() {
    if (!title.trim()) return;
    try {
      await saveWork.mutateAsync({
        cardId,
        work: { title, url, description: "", type, cloudinaryPublicId: "" },
      });
      setTitle("");
      setUrl("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add work:", error);
    }
  }

  function handleRemove(workId: string) {
    deleteWork.mutate({ cardId, workId });
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 col-span-3">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
        Projects
      </p>

      {works.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 py-2">No projects yet</p>
      )}

      {works.map((work) => (
        <div
          key={work.id}
          className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-sm flex-1">{work.title}</span>
          {work.url && (
            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
            >
              {work.url.replace(/^https?:\/\//, "")} <ExternalLink size={12} />
            </a>
          )}
          <button
            type="button"
            onClick={() => handleRemove(work.id)}
            className="text-gray-300 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {showForm && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
            autoFocus
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
          />
          <div className="flex items-center gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm cursor-pointer"
            >
              <option value="link">Link</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <button
              type="button"
              onClick={handleAdd}
              disabled={saveWork.isPending || !title.trim()}
              className="bg-gray-900 text-white text-sm px-5 py-2 rounded-full font-medium disabled:opacity-50"
            >
              {saveWork.isPending ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setTitle("");
                setUrl("");
              }}
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
          + Add project
        </p>
      )}
    </div>
  );
}
