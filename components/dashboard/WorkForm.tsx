"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";
import { workSchema } from "@/lib/validation/dashboardSchemas";
import type { WorkMedia } from "@/lib/cards";
import type { WorkFormData } from "./types";

type WorkFormProps = {
  selectedCard: { id: string; works: WorkMedia[] } | undefined;
  onSubmit: (data: WorkFormData) => void;
  loading?: boolean;
};

export default function WorkForm({
  selectedCard,
  onSubmit,
  loading = false
}: WorkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<WorkFormData>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      type: "link",
      cloudinaryPublicId: ""
    }
  });

  const workType = watch("type");

  return (
    <form className="rounded-box border border-base-300 bg-base-100 p-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Project / Work</h2>
        <button className="btn btn-secondary" type="submit" disabled={!selectedCard || loading}>
          {loading ? <span className="loading loading-spinner loading-sm"></span> : <Plus size={18} />}
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="form-control">
          <span className="label-text">Title</span>
          <input className="input input-bordered" {...register("title")} />
          {errors.title && <span className="text-sm text-error">{errors.title.message}</span>}
        </label>

        <label className="form-control">
          <span className="label-text">Media type</span>
          <select className="select select-bordered" {...register("type")}>
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
              {...register("url")}
              disabled={!!watch("cloudinaryPublicId")}
              placeholder={watch("cloudinaryPublicId") ? "URL auto-filled from upload" : "https://..."}
            />
            {workType !== "link" && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  folder: "cardfoi/works",
                  resourceType: workType === "video" ? "video" : "image",
                  sources: ["local"]
                }}
                onSuccess={(result) => {
                  if (typeof result.info === "object" && "secure_url" in result.info && "public_id" in result.info) {
                    setValue("url", String(result.info.secure_url));
                    setValue("cloudinaryPublicId", String(result.info.public_id));
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
          {errors.url && <span className="text-sm text-error">{errors.url.message}</span>}
        </label>

        <label className="form-control md:col-span-2">
          <span className="label-text">Description</span>
          <textarea className="textarea textarea-bordered" {...register("description")} />
        </label>
      </div>
    </form>
  );
}
