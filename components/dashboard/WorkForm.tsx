"use client";

import { FormEvent } from "react";
import { Plus } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import type { WorkMedia } from "@/lib/cards";
import type { WorkFormData } from "./types";

type WorkFormProps = {
  workForm: WorkFormData;
  setWorkForm: (form: WorkFormData) => void;
  selectedCard: { id: string; works: WorkMedia[] } | undefined;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setMessage: (msg: string) => void;
};

export default function WorkForm({
  workForm,
  setWorkForm,
  selectedCard,
  onSubmit,
  setMessage
}: WorkFormProps) {
  return (
    <form className="rounded-box border border-base-300 bg-base-100 p-5" onSubmit={onSubmit}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Project / Work</h2>
        <button className="btn btn-secondary" type="submit" disabled={!selectedCard}>
          <Plus size={18} />
          Add
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="form-control">
          <span className="label-text">Title</span>
          <input
            className="input input-bordered"
            value={workForm.title}
            onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
          />
        </label>
        <label className="form-control">
          <span className="label-text">Media type</span>
          <select
            className="select select-bordered"
            value={workForm.type}
            onChange={(e) => setWorkForm({ ...workForm, type: e.target.value as WorkMedia["type"] })}
          >
            <option value="link">Link</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>
        <label className="form-control md:col-span-2">
          <span className="label-text">URL</span>
          <div className="join w-full">
            <input
              className="input input-bordered join-item w-full"
              value={workForm.url}
              onChange={(e) => setWorkForm({ ...workForm, url: e.target.value })}
              disabled={!!workForm.cloudinaryPublicId}
              placeholder={workForm.cloudinaryPublicId ? "URL auto-filled from upload" : "https://..."}
            />
            {workForm.type !== "link" && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  folder: "cardfoi/works",
                  resourceType: workForm.type === "video" ? "video" : "image",
                  sources: ["local"]
                }}
                onSuccess={(result) => {
                  if (typeof result.info === "object" && "secure_url" in result.info && "public_id" in result.info) {
                    setWorkForm({
                      ...workForm,
                      url: String(result.info.secure_url),
                      cloudinaryPublicId: String(result.info.public_id)
                    });
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
        <label className="form-control md:col-span-2">
          <span className="label-text">Description</span>
          <textarea
            className="textarea textarea-bordered"
            value={workForm.description}
            onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
          />
        </label>
      </div>
    </form>
  );
}
