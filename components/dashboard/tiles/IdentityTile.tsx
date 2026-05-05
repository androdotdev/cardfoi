"use client";

import { useFormContext } from "react-hook-form";
import type { CardFormData } from "@/components/dashboard/types";
import { CldUploadWidget } from "next-cloudinary";

export default function IdentityTile() {
  const { register, watch, setValue } = useFormContext<CardFormData>();
  const name = watch("name");
  const avatar = watch("avatar");

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Identity
      </p>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-lg overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="" className="w-full h-full object-cover" />
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
          <p className="text-xs text-gray-400 truncate mt-1">
            <a
              href={`https://cardfoi.vercel.app/${name ? name.toLowerCase().replace(/\s+/g, "") : "..."}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              cardfoi.vercel.app/
              {name ? name.toLowerCase().replace(/\s+/g, "") : "..."}
            </a>
          </p>
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
