"use client";

import { ImageIcon, LinkIcon, Trash2 } from "lucide-react";
import type { WorkMedia } from "@/lib/cards";
import EmptyState from "./EmptyState";

type WorkListProps = {
  works: WorkMedia[];
  onRemove: (workId: string) => void;
  loading?: boolean;
};

export default function WorkList({ works, onRemove, loading = false }: WorkListProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-4 h-6 w-24 animate-pulse rounded bg-gray-100"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div className="rounded-xl border border-gray-100 p-3" key={i}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="h-5 w-5 animate-pulse rounded bg-gray-100"></div>
                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-100"></div>
                    <div className="mt-1 h-4 w-48 animate-pulse rounded bg-gray-100"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Work list</h2>
      {works.length === 0 ? (
        <EmptyState type="no-works" />
      ) : (
        <div className="space-y-3">
          {works.map((work) => (
            <div className="rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50" key={work.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  {work.type === "image" ? <ImageIcon size={18} /> : <LinkIcon size={18} />}
                <div className="min-w-0">
                    <p className="font-medium">{work.title}</p>
                    {work.type === "link" ? (
                      <a className="text-sm text-blue-500 hover:underline truncate" href={work.url} target="_blank">
                        {work.url}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">Media uploaded</span>
                    )}
                  </div>
                </div>
                <button
                  className="text-sm px-2 py-1 hover:bg-red-50 text-red-500 rounded"
                  title="Delete work"
                  onClick={() => onRemove(work.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
