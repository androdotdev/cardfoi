"use client";

import { ImageIcon, LinkIcon, Trash2 } from "lucide-react";
import type { WorkMedia } from "@/lib/cards";

type WorkListProps = {
  works: WorkMedia[];
  onRemove: (workId: string) => void;
};

export default function WorkList({ works, onRemove }: WorkListProps) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <h2 className="mb-4 text-lg font-semibold">Work list</h2>
      <div className="space-y-3">
        {works.map((work) => (
          <div className="rounded-box border border-base-300 p-3" key={work.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                {work.type === "image" ? <ImageIcon size={18} /> : <LinkIcon size={18} />}
                <div className="min-w-0">
                  <p className="font-medium">{work.title}</p>
                  <a className="link truncate text-sm" href={work.url} target="_blank">{work.url}</a>
                </div>
              </div>
              <button
                className="btn btn-square btn-ghost btn-sm"
                title="Delete work"
                onClick={() => onRemove(work.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
