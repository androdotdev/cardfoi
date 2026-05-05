"use client";

import { ExternalLink } from "lucide-react";
import type { UserCard } from "@/lib/cards";
import type { PasswordFormData } from "./types";
import PasswordForm from "./PasswordForm";

type CardPreviewProps = {
  selectedCard: UserCard;
  onSubmitPassword: (data: PasswordFormData) => Promise<void>;
  passwordLoading?: boolean;
};

export default function CardPreview({
  selectedCard,
  onSubmitPassword,
  passwordLoading = false
}: CardPreviewProps) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="avatar placeholder">
          <div className="h-20 w-20 rounded-full bg-neutral text-neutral-content shadow-md">
            {selectedCard.avatar ? (
              <img src={selectedCard.avatar} alt="" className="rounded-full" />
            ) : (
              <span className="text-2xl">{selectedCard.name.slice(0, 1)}</span>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold">{selectedCard.name}</h2>
          <p className="truncate text-sm text-base-content/60">{selectedCard.email}</p>
          <a
            className="btn btn-sm btn-outline mt-3 transition-colors hover:border-primary"
            href={`/${selectedCard.id}`}
            target="_blank"
          >
            <ExternalLink size={16} />
            Open /{selectedCard.id}
          </a>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-base-content/80">{selectedCard.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedCard.skills.map((skill) => (
          <span className="badge badge-outline badge-sm" key={skill}>{skill}</span>
        ))}
      </div>

      <PasswordForm
        onSubmit={onSubmitPassword}
        loading={passwordLoading}
      />
    </div>
  );
}
