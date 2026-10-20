"use client";

import { useRef, useState } from "react";
import type { ProjectAssetView } from "@/types/project";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4"];

export default function ProjectAssetUploader({
  projectId,
  initialAssets,
}: {
  projectId: string;
  initialAssets: ProjectAssetView[];
}) {
  const [assets, setAssets] = useState(initialAssets);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file?: File) {
    if (!file) return;
    setMessage("");
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setMessage("Choose a JPEG, PNG, WebP, or MP4 file.");
      return;
    }
    const maxBytes = file.type === "video/mp4" ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setMessage(file.type === "video/mp4" ? "Videos can be up to 25 MB." : "Images can be up to 5 MB.");
      return;
    }

    setBusy(true);
    try {
      const authorizationResponse = await fetch("/api/media/upload-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, mimeType: file.type, sizeBytes: file.size }),
      });
      const authorizationResult = await authorizationResponse.json();
      if (!authorizationResponse.ok) throw new Error(authorizationResult.error ?? "Could not authorize upload.");

      const { uploadId, authorization } = authorizationResult;
      const form = new FormData();
      form.set("file", file);
      form.set("fileName", authorization.fileName);
      form.set("publicKey", authorization.publicKey);
      form.set("signature", authorization.signature);
      form.set("token", authorization.token);
      form.set("expire", String(authorization.expire));
      form.set("folder", authorization.folder);
      form.set("useUniqueFileName", "false");
      const imageKitResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: form,
      });
      const uploaded = await imageKitResponse.json();
      if (!imageKitResponse.ok || typeof uploaded.fileId !== "string") {
        throw new Error(uploaded.message ?? "Image upload failed.");
      }

      const completionResponse = await fetch("/api/media/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          uploadId,
          mimeType: file.type,
          sizeBytes: file.size,
          fileId: uploaded.fileId,
        }),
      });
      if (!completionResponse.ok) {
        const error = await completionResponse.json().catch(() => ({}));
        throw new Error(error.error ?? "Could not save uploaded media.");
      }
      const completion = await completionResponse.json();
      setAssets((current) => current.some((asset) => asset.id === completion.asset.id)
        ? current
        : [...current, completion.asset as ProjectAssetView]);
      setMessage("Upload complete.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeAsset(assetId: string) {
    setMessage("");
    try {
      const response = await fetch(`/api/dashboard/assets/${assetId}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not queue asset deletion.");
      setAssets((current) => current.filter((asset) => asset.id !== assetId));
      setMessage("Asset removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not queue asset deletion.");
    }
  }

  return (
    <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7d866f]">Project proof</p>
          <h2 className="mt-1.5 text-sm font-semibold tracking-tight">Add images or video</h2>
        </div>
        <span className="font-mono text-[9px] text-[#a0a297]">{assets.length} / 4</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        aria-label="Choose a project proof file"
        accept="image/jpeg,image/png,image/webp,video/mp4"
        className="sr-only"
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      <button
        type="button"
        aria-label={busy ? "Uploading project proof" : assets.length >= 4 ? "Project proof asset limit reached" : "Choose a project proof file"}
        disabled={busy || assets.length >= 4}
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#dfe2d8] py-3 text-[10px] font-medium text-[#66715a] transition hover:border-[#aeb89f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Uploading…" : assets.length >= 4 ? "Asset limit reached" : "＋ Choose a file"}
      </button>
      <p className="mt-2 text-[9px] leading-4 text-[#92958c]">Images up to 5 MB · MP4 videos up to 25 MB</p>
      {message && <p role="status" className="mt-2 text-[10px] text-[#68725c]">{message}</p>}
      {assets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {assets.map((asset) => (
            <li key={asset.id} className="flex items-center gap-3 rounded-xl bg-[#f7f8f4] p-2.5">
              {asset.type === "image" ? (
                // Remote media is rendered by the provider's public URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.url} alt="" className="h-10 w-12 rounded-lg object-cover" />
              ) : <span className="flex h-10 w-12 items-center justify-center rounded-lg bg-[#e9eddf] text-xs">▶</span>}
              <span className="min-w-0 flex-1 truncate text-[10px] text-[#62695b]">{asset.type === "video" ? "Video proof" : "Image proof"}</span>
              <button type="button" aria-label={`Remove ${asset.type} proof`} onClick={() => void removeAsset(asset.id)} className="text-[9px] text-[#8a8d84] hover:text-[#a25f4a]">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
