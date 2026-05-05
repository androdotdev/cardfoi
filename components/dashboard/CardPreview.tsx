"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import { FormEvent } from "react";
import type { UserCard, WorkMedia } from "@/lib/cards";
import type { PasswordFormData } from "./types";

type CardPreviewProps = {
  selectedCard: UserCard;
  passwordForm: PasswordFormData;
  setPasswordForm: (form: PasswordFormData) => void;
  onSubmitPassword: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onRemoveWork: (workId: string) => void;
};

export default function CardPreview({
  selectedCard,
  passwordForm,
  setPasswordForm,
  onSubmitPassword,
  onRemoveWork
}: CardPreviewProps) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <div className="flex items-start gap-4">
        <div className="avatar placeholder">
          <div className="h-20 w-20 rounded-full bg-neutral text-neutral-content">
            {selectedCard.avatar ? (
              <img src={selectedCard.avatar} alt="" />
            ) : (
              <span className="text-2xl">{selectedCard.name.slice(0, 1)}</span>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold">{selectedCard.name}</h2>
          <p className="truncate text-sm text-base-content/60">{selectedCard.email}</p>
          <a className="btn btn-sm btn-outline mt-3" href={`/${selectedCard.id}`} target="_blank">
            <ExternalLink size={16} />
            Open /{selectedCard.id}
          </a>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6">{selectedCard.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedCard.skills.map((skill) => (
          <span className="badge badge-outline" key={skill}>{skill}</span>
        ))}
      </div>

      <form className="mt-6 border-t border-base-300 pt-5" onSubmit={onSubmitPassword}>
        <h3 className="mb-3 font-semibold">Password</h3>
        <div className="space-y-3">
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          />
          <button className="btn btn-outline btn-sm" type="submit">
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}
