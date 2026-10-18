import "server-only";

import { randomUUID } from "node:crypto";
import { imageKitMediaProvider } from "./providers/imagekit";
import type { UploadTarget } from "./types";

export const mediaProvider = imageKitMediaProvider;

export function createUploadId(): string {
  return randomUUID();
}

export function createUploadAuthorization(input: {
  target: UploadTarget;
  uploadId: string;
  mimeType: string;
  sizeBytes: number;
}) {
  return mediaProvider.createUploadAuthorization(input);
}

export function verifyUploadedMedia(input: {
  target: UploadTarget;
  uploadId: string;
  mimeType: string;
  sizeBytes: number;
  fileId: string;
}) {
  return mediaProvider.verifyUploadedFile(input);
}

export function deleteMedia(storageKey: string) {
  return mediaProvider.deleteFile(storageKey);
}
