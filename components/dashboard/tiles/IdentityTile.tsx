"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import type { CardFormData } from "@/components/dashboard/types";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function IdentityTile() {
  const { register, watch, setValue } = useFormContext<CardFormData>();
  const name = watch("name");
  const avatar = watch("avatar");
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const currentSlug = watch("slug") || "";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Identity
      </p>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-lg overflow-hidden">
          {avatar ? (
            <Image src={avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>{name ? name.slice(0, 1).toUpperCase() : "?"}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            {...register("name")}
            className="text-lg font-medium bg-transparent border-none p-0 focus:outline-none w-full"
            placeholder="Your name"
          />
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#0a0a0a]">Card URL</h3>
            {!isEditingSlug && (
              <button
                onClick={() => {
                  setNewSlug(currentSlug);
                  setIsEditingSlug(true);
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
                type="button"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingSlug ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">cardfoi.vercel.app/</span>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  onBlur={() => {
                    setValue("newSlug", newSlug, { shouldDirty: true });
                  }}
                  placeholder="your-slug"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Can only be changed once per month. Click outside to confirm, then use the Save button above.</p>
              <button
                onClick={() => {
                  setValue("newSlug", undefined);
                  setIsEditingSlug(false);
                }}
                className="text-xs border border-gray-200 px-3 py-1 rounded mt-2"
                type="button"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <code className="text-sm bg-gray-50 px-2 py-1 rounded">{currentSlug}</code>
              <a
                href={`https://cardfoi.vercel.app/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                cardfoi.vercel.app/{currentSlug}
              </a>
            </div>
          )}
        </div>
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
              className="mt-3 text-[10px] text-gray-400 hover:text-gray-600"
            >
              Change avatar
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
