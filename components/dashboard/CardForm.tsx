"use client";

import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";
import { cardSchema } from "@/lib/validation/dashboardSchemas";
import type { UserCard } from "@/lib/cards";
import type { CardFormData } from "./types";

type CardFormProps = {
  selectedCard: UserCard | undefined;
  themes: string[];
  onSubmit: (data: CardFormData) => void;
  loading?: boolean;
};

export default function CardForm({
  selectedCard,
  themes,
  onSubmit,
  loading = false
}: CardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: selectedCard ? {
      name: selectedCard.name,
      email: selectedCard.email,
      phone: selectedCard.phone,
      avatar: selectedCard.avatar ?? "",
      description: selectedCard.description,
      skills: selectedCard.skills.join(", "),
      theme: selectedCard.theme,
      template: selectedCard.template ?? "minimal"
    } : undefined
  });

  return (
    <form className="rounded-box border border-base-300 bg-base-100 p-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Profile details</h2>
          <p className="text-sm text-base-content/60">Slug is generated from the card name.</p>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm"></span> : <Save size={18} />}
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="form-control">
          <span className="label-text">Name</span>
          <input className="input input-bordered" {...register("name")} />
          {errors.name && <span className="text-sm text-error">{errors.name.message}</span>}
        </label>

        <label className="form-control">
          <span className="label-text">Email</span>
          <input className="input input-bordered" type="email" {...register("email")} />
          {errors.email && <span className="text-sm text-error">{errors.email.message}</span>}
        </label>

        <label className="form-control">
          <span className="label-text">Phone</span>
          <input className="input input-bordered" {...register("phone")} />
          {errors.phone && <span className="text-sm text-error">{errors.phone.message}</span>}
        </label>

        <label className="form-control">
          <span className="label-text">Avatar URL</span>
          <div className="join w-full">
            <input className="input input-bordered join-item w-full" {...register("avatar")} />
            {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{ folder: "cardfoi/avatars", resourceType: "image", sources: ["local"] }}
                onSuccess={(result) => {
                  if (typeof result.info === "object" && "secure_url" in result.info) {
                    setValue("avatar", String(result.info.secure_url));
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
          <input className="input input-bordered" {...register("skills")} placeholder="Next.js, Prisma, PostgreSQL" />
        </label>

        <label className="form-control">
          <span className="label-text">Theme</span>
          <select className="select select-bordered" {...register("theme")}>
            {themes.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text">Template</span>
          <select className="select select-bordered" {...register("template")}>
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
          <textarea className="textarea textarea-bordered min-h-28" {...register("description")} />
          {errors.description && <span className="text-sm text-error">{errors.description.message}</span>}
        </label>
      </div>
    </form>
  );
}
