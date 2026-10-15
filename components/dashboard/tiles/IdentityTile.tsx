"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { cardSchema } from "@/lib/validation/dashboardSchemas";
import type { CardFormData } from "@/components/dashboard/types";
import type { UserCard } from "@/lib/cards";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useSaveCard } from "@/lib/hooks/useDashboardQuery";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";
import { authClient } from "@/lib/auth-client";

type IdentityTileProps = {
  selectedCard: UserCard;
};

export default function IdentityTile({ selectedCard }: IdentityTileProps) {
  const { register, watch, setValue, handleSubmit, formState: { errors, isDirty }, reset } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: selectedCard.name,
      slug: selectedCard.id,
      email: selectedCard.email,
      avatar: selectedCard.avatar ?? "",
      description: selectedCard.description,
      skills: selectedCard.skills.join(", "),
      theme: selectedCard.theme,
      template: selectedCard.template ?? "minimal",
    },
  });

  const { mutateAsync: saveCard, isPending: saving } = useSaveCard();
  const setSelectedId = useDashboardStore((s) => s.setSelectedId);
  const setMessage = useDashboardStore((s) => s.setMessage);

  const name = watch("name");
  const avatar = watch("avatar");
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const currentSlug = watch("slug") || "";

  useEffect(() => {
    reset({
      name: selectedCard.name,
      slug: selectedCard.id,
      email: selectedCard.email,
      avatar: selectedCard.avatar ?? "",
      description: selectedCard.description,
      skills: selectedCard.skills.join(", "),
      theme: selectedCard.theme,
      template: selectedCard.template ?? "minimal",
    });
  }, [selectedCard, reset]);

  async function onSubmit(data: CardFormData) {
    try {
      const result = await saveCard({ card: data, selectedCard });

      if (data.name !== selectedCard.name) {
        try {
          await authClient.updateUser({ name: data.name });
        } catch (syncError: unknown) {
          console.error("Failed to sync user name:", syncError);
        }
      }

      if (result?.card?.id) {
        const newId = result.card.id;
        if (newId !== selectedCard.id) {
          setSelectedId(newId);
          reset({ ...data, slug: newId });
        } else {
          reset(data);
        }
      }
      setMessage("Card saved.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Unable to save card.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white border border-[#ebebea] rounded-xl p-7">
        <p className="text-[11px] uppercase tracking-[0.1em] text-[#9a9a97] mb-5">
          Profile
        </p>

        {/* Avatar + Name */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#fafaf8] border border-[#ebebea] flex items-center justify-center text-[#5c5c5a] font-medium text-lg overflow-hidden shrink-0">
            {avatar ? (
              <Image width={56} height={56} alt="" className="w-full h-full object-cover" src={avatar} />
            ) : (
              <span>{name ? name.slice(0, 1).toUpperCase() : "?"}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <input
              {...register("name")}
              className="text-lg font-medium bg-transparent border-none p-0 focus:outline-none w-full text-[#0a0a0a]"
              placeholder="Your name"
            />
          </div>
        </div>

        {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              folder: "cardfoi/avatars",
              resourceType: "image",
              sources: ["local"],
            }}
            onSuccess={(result) => {
              if (
                typeof result.info === "object" &&
                "secure_url" in result.info
              ) {
                setValue("avatar", String(result.info.secure_url), {
                  shouldDirty: true,
                });
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="mt-2 text-[11px] text-[#9a9a97] hover:text-[#5c5c5a] transition-colors"
              >
                Change avatar
              </button>
            )}
          </CldUploadWidget>
        )}

        {/* Card URL */}
        <div className="mt-5 pt-5 border-t border-[#ebebea]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#0a0a0a]">Card URL</p>
            {!isEditingSlug && (
              <button
                onClick={() => {
                  setNewSlug(currentSlug);
                  setIsEditingSlug(true);
                }}
                className="text-[11px] text-[#9a9a97] hover:text-[#5c5c5a] transition-colors"
                type="button"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingSlug ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#9a9a97]">cardfoi.vercel.app/</span>
                <input
                  className="border border-[#ebebea] rounded-lg px-3 py-2 text-sm flex-1 bg-[#fafaf8] text-[#0a0a0a]"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  onBlur={() => {
                    setValue("newSlug", newSlug, { shouldDirty: true });
                  }}
                  placeholder="your-slug"
                />
              </div>
              <p className="text-[11px] text-[#9a9a97] mt-1">Can only be changed once per month. Click outside to confirm, then use Save.</p>
              <button
                onClick={() => {
                  setValue("newSlug", undefined);
                  setIsEditingSlug(false);
                }}
                className="text-[11px] border border-[#ebebea] px-3 py-1 rounded mt-2 text-[#5c5c5a]"
                type="button"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <code className="text-sm bg-[#fafaf8] border border-[#ebebea] px-2 py-1 rounded text-[#5c5c5a]">{currentSlug}</code>
              <a
                href={`https://cardfoi.vercel.app/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#9a9a97] hover:text-[#5c5c5a] transition-colors"
              >
                cardfoi.vercel.app/{currentSlug}
              </a>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mt-5">
          <label className="text-[11px] uppercase tracking-[0.1em] text-[#9a9a97] mb-2 block">Bio</label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Tell people about yourself..."
            className="w-full bg-[#fafaf8] border border-[#ebebea] rounded-lg px-4 py-2.5 text-sm text-[#5c5c5a] resize-none focus:border-[#d4d4d2] transition-colors"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Skills */}
        <div className="mt-4">
          <label className="text-[11px] uppercase tracking-[0.1em] text-[#9a9a97] mb-2 block">Skills</label>
          <input
            {...register("skills")}
            placeholder="Next.js, TypeScript, PostgreSQL..."
            className="bg-[#fafaf8] border border-[#ebebea] rounded-lg px-4 py-2.5 text-sm w-full text-[#5c5c5a] focus:border-[#d4d4d2] transition-colors"
          />
          <p className="text-[11px] text-[#9a9a97] mt-1">Comma-separated</p>
        </div>

        {/* Email (merged into Profile card) */}
        <div className="mt-4">
          <label className="text-[11px] uppercase tracking-[0.1em] text-[#9a9a97] mb-2 block">Email on card</label>
          <p className="text-[11px] text-[#9a9a97] mb-2">This is for your card only, separate from your account email</p>
          <input
            {...register("email")}
            type="email"
            placeholder="email@example.com"
            className="bg-[#fafaf8] border border-[#ebebea] rounded-lg px-4 py-2.5 text-sm w-full text-[#5c5c5a] focus:border-[#d4d4d2] transition-colors"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Save button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="bg-[#0a0a0a] text-white text-sm px-5 py-2 rounded-full font-medium disabled:opacity-40 transition-opacity"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
