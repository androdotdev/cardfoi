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
      <div className="rounded-box border border-base-300 bg-base-100 p-5">
        <div className="mb-4 h-6 w-24 animate-pulse rounded bg-base-300"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div className="rounded-box border border-base-300 p-3" key={i}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="h-5 w-5 animate-pulse rounded bg-base-300"></div>
                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-32 animate-pulse rounded bg-base-300"></div>
                    <div className="mt-1 h-4 w-48 animate-pulse rounded bg-base-300"></div>
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
    <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Work list</h2>
      {works.length === 0 ? (
        <EmptyState type="no-works" />
      ) : (
        <div className="space-y-3">
          {works.map((work) => (
            <div className="rounded-box border border-base-300 p-3 transition-colors hover:bg-base-200" key={work.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  {work.type === "image" ? <ImageIcon size={18} /> : <LinkIcon size={18} />}
                  <div className="min-w-0">
                    <p className="font-medium">{work.title}</p>
                    <a className="link truncate text-sm" href={work.url} target="_blank">{work.url}</a>
                  </div>
                </div>
                <button
                  className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
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
