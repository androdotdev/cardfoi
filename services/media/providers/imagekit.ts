import "server-only";

import { createHmac } from "node:crypto";
import { MEDIA_LIMITS } from "@/lib/constants";
import { mediaRootFolder } from "@/lib/environment";
import type {
  MediaKind,
  MediaStorageProvider,
  UploadAuthorization,
  UploadTarget,
  VerifiedMediaFile,
} from "../types";
import type { ImageKitFileDetails } from "@/types/imagekit";

function getImageKitConfig() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, "");

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT are required.");
  }

  return { publicKey, privateKey, urlEndpoint };
}

function extensionForMimeType(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "video/mp4":
      return ".mp4";
    default:
      throw new Error("Unsupported media type.");
  }
}

function getKindAndValidateSize(mimeType: string, sizeBytes: number): MediaKind {
  if (!Number.isSafeInteger(sizeBytes) || sizeBytes <= 0) {
    throw new Error("File size must be a positive integer.");
  }

  if ((MEDIA_LIMITS.imageMimeTypes as readonly string[]).includes(mimeType)) {
    if (sizeBytes > MEDIA_LIMITS.imageBytes) {
      throw new Error("Images must be 5 MB or smaller.");
    }
    return "image";
  }

  if ((MEDIA_LIMITS.videoMimeTypes as readonly string[]).includes(mimeType)) {
    if (sizeBytes > MEDIA_LIMITS.videoBytes) {
      throw new Error("Videos must be 25 MB or smaller.");
    }
    return "video";
  }

  throw new Error("Unsupported media type. Use JPEG, PNG, WebP, or MP4.");
}

function safePathSegment(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function folderForTarget(target: UploadTarget): string {
  if (target.kind === "avatar") {
    return `${mediaRootFolder}/avatars/${safePathSegment(target.ownerId)}`;
  }
  return `${mediaRootFolder}/project-assets/${safePathSegment(target.ownerId)}/${target.projectId}`;
}

function validateUploadId(uploadId: string): void {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uploadId)) {
    throw new Error("uploadId must be a UUID.");
  }
}

function fileTypeMatches(kind: MediaKind, fileType: string | undefined): boolean {
  return kind === "image" ? fileType === "image" : fileType === "non-image";
}

async function imageKitRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { privateKey } = getImageKitConfig();
  const response = await fetch(`https://api.imagekit.io/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw Object.assign(new Error("ImageKit file not found."), { status: 404 });
    }
    const body = await response.text();
    throw Object.assign(new Error(`ImageKit request failed (${response.status}): ${body}`), {
      status: response.status,
    });
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const imageKitMediaProvider: MediaStorageProvider = {
  createUploadAuthorization({ target, uploadId, mimeType, sizeBytes }): UploadAuthorization {
    validateUploadId(uploadId);
    getKindAndValidateSize(mimeType, sizeBytes);

    const { publicKey, privateKey } = getImageKitConfig();
    const expire = Math.floor(Date.now() / 1000) + MEDIA_LIMITS.uploadAuthorizationSeconds;
    const signature = createHmac("sha1", privateKey)
      .update(`${uploadId}${expire}`)
      .digest("hex");

    return {
      token: uploadId,
      signature,
      expire,
      publicKey,
      folder: folderForTarget(target),
      fileName: `${uploadId}${extensionForMimeType(mimeType)}`,
      useUniqueFileName: false,
    };
  },

  async verifyUploadedFile({ target, uploadId, mimeType, sizeBytes, fileId }): Promise<VerifiedMediaFile> {
    validateUploadId(uploadId);
    const kind = getKindAndValidateSize(mimeType, sizeBytes);
    if (!fileId || fileId.length > 200) throw new Error("Invalid ImageKit file ID.");

    const { urlEndpoint } = getImageKitConfig();
    const expectedFolder = folderForTarget(target);
    const expectedName = `${uploadId}${extensionForMimeType(mimeType)}`;
    const details = await imageKitRequest<ImageKitFileDetails>(
      `/files/${encodeURIComponent(fileId)}/details`,
    );

    if (
      details.fileId !== fileId ||
      details.name !== expectedName ||
      details.filePath !== `${expectedFolder}/${expectedName}` ||
      !fileTypeMatches(kind, details.fileType) ||
      details.mime !== mimeType ||
      typeof details.size !== "number" ||
      details.size !== sizeBytes ||
      typeof details.url !== "string"
    ) {
      throw new Error("Uploaded file metadata does not match the authorized upload.");
    }

    const url = new URL(details.url);
    const endpoint = new URL(urlEndpoint);
    const endpointBasePath = endpoint.pathname.replace(/\/$/, "");
    const mediaPath = url.pathname.startsWith(`${endpointBasePath}/`)
      ? url.pathname.slice(endpointBasePath.length)
      : url.pathname;
    if (url.origin !== endpoint.origin || !mediaPath.startsWith(`${expectedFolder}/`)) {
      throw new Error("Uploaded file URL is outside the configured ImageKit media root.");
    }

    return {
      storageKey: details.fileId,
      url: details.url,
      filePath: details.filePath,
      fileName: details.name,
      sizeBytes: details.size,
      kind,
    };
  },

  async deleteFile(storageKey): Promise<void> {
    if (!storageKey || storageKey.length > 200) throw new Error("Invalid media storage key.");
    try {
      await imageKitRequest<void>(`/files/${encodeURIComponent(storageKey)}`, { method: "DELETE" });
    } catch (error) {
      if (typeof error === "object" && error !== null && "status" in error && error.status === 404) {
        return;
      }
      throw error;
    }
  },
};
