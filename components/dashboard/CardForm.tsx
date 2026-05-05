"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import type { UserCard } from "@/lib/cards";
import type { ApiState, CardFormData } from "./types";

type CardFormProps = {
  cardForm: CardFormData;
  setCardForm: (form: CardFormData) => void;
  selectedCard: UserCard | undefined;
  themes: string[];
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setMessage: (msg: string) => void;
};

export default function CardForm({
  cardForm,
  setCardForm,
  selectedCard,
  themes,
  onSubmit,
  setMessage
}: CardFormProps) {
  return (
    <form className="rounded-box border border-base-300 bg-base-100 p-5" onSubmit={onSubmit}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Profile details</h2>
          <p className="text-sm text-base-content/60">Slug is generated from the card name.</p>
        </div>
        <button className="btn btn-primary" type="submit">
          <Save size={18} />
          Save
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="form-control">
          <span className="label-text">Name</span>
          <input
            className="input input-bordered"
            value={cardForm.name}
            onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Email</span>
          <input
            className="input input-bordered"
            type="email"
            value={cardForm.email}
            onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })}
            required
            suppressHydrationWarning
          />
        </label>
        <label className="form-control">
          <span className="label-text">Phone</span>
          <input
            className="input input-bordered"
            value={cardForm.phone}
            onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })}
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Avatar URL</span>
          <div className="join w-full">
            <input
              className="input input-bordered join-item w-full"
              value={cardForm.avatar}
              onChange={(e) => setCardForm({ ...cardForm, avatar: e.target.value })}
            />
            {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{ folder: "cardfoi/avatars", resourceType: "image", sources: ["local"] }}
                onSuccess={(result) => {
                  if (typeof result.info === "object" && "secure_url" in result.info) {
                    setCardForm({ ...cardForm, avatar: String(result.info.secure_url) });
                  }
                }}
              >
                {({ open }) => (
                  <button className="btn join-item" type="button" onClick={() => open()}>
                    Upload
                  </button>
                )}
              </CldUploadWidget>
            ) : null}
          </div>
        </label>
        <label className="form-control">
          <span className="label-text">Tech stack / skills</span>
          <input
            className="input input-bordered"
            value={cardForm.skills}
            onChange={(e) => setCardForm({ ...cardForm, skills: e.target.value })}
            placeholder="Next.js, Prisma, PostgreSQL"
          />
        </label>
        <label className="form-control">
          <span className="label-text">Theme</span>
          <select
            className="select select-bordered"
            value={cardForm.theme}
            onChange={(e) => setCardForm({ ...cardForm, theme: e.target.value })}
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </label>
        <label className="form-control">
          <span className="label-text">Template</span>
          <select
            className="select select-bordered"
            value={cardForm.template || "minimal"}
            onChange={(e) => setCardForm({ ...cardForm, template: e.target.value })}
          >
            <option value="minimal">Minimal</option>
            <option value="cover">Cover Card</option>
            <option value="sidebar">Sidebar Layout</option>
            <option value="terminal">Terminal/Dev</option>
            <option value="glass">Glass Morphism</option>
            <option value="timeline">Timeline</option>
          </select>
        </label>
        <label className="form-control md:col-span-2">
          <span className="label-text">Description</span>
          <textarea
            className="textarea textarea-bordered min-h-28"
            value={cardForm.description}
            onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
            required
          />
        </label>
      </div>
    </form>
  );
}
