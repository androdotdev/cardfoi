"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

type WorkUploadButtonProps = {
  type: "image" | "video";
  cardId: string;
  currentUrl?: string;
  onUploadSuccess: (url: string, publicId: string) => void;
};

export default function WorkUploadButton({
  type,
  cardId,
  currentUrl,
  onUploadSuccess,
}: WorkUploadButtonProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{
        folder: `cardfoi/projects/${cardId}`,
        resourceType: type,
        sources: ["local"],
      }}
      onOpen={() => setUploading(true)}
      onUpload={() => setUploading(false)}
      onSuccess={(result) => {
        if (
          typeof result.info === "object" &&
          "secure_url" in result.info &&
          "public_id" in result.info
        ) {
          const url = String(result.info.secure_url);
          const publicId = String(result.info.public_id);
          onUploadSuccess(url, publicId);
          setUploading(false);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          disabled={uploading}
          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm text-left hover:border-gray-300 transition-colors disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : currentUrl
              ? "Change file"
              : `Upload ${type}`}
        </button>
      )}
    </CldUploadWidget>
  );
}
