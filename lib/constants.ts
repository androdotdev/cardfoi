export const CARD_LIMITS = {
  skills: 10,
  projects: 5,
  projectAssets: 4,
} as const;

export const MEDIA_LIMITS = {
  imageBytes: 5 * 1024 * 1024,
  videoBytes: 25 * 1024 * 1024,
  imageMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  videoMimeTypes: ["video/mp4"],
  uploadAuthorizationSeconds: 10 * 60,
} as const;
