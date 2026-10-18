export type MediaKind = "image" | "video";

export type UploadTarget =
  | { kind: "avatar"; ownerId: string }
  | { kind: "project-asset"; ownerId: string; projectId: string };

export interface UploadAuthorization {
  token: string;
  signature: string;
  expire: number;
  publicKey: string;
  folder: string;
  fileName: string;
  useUniqueFileName: false;
}

export interface VerifiedMediaFile {
  storageKey: string;
  url: string;
  filePath: string;
  fileName: string;
  sizeBytes: number;
  kind: MediaKind;
}

export interface MediaStorageProvider {
  createUploadAuthorization(input: {
    target: UploadTarget;
    uploadId: string;
    mimeType: string;
    sizeBytes: number;
  }): UploadAuthorization;
  verifyUploadedFile(input: {
    target: UploadTarget;
    uploadId: string;
    mimeType: string;
    sizeBytes: number;
    fileId: string;
  }): Promise<VerifiedMediaFile>;
  deleteFile(storageKey: string): Promise<void>;
}
