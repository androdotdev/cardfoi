export type SlugValidationResult =
  | { ok: true; slug: string }
  | { ok: false; reason: string };

export interface CardLimitCounts {
  skills?: number;
  projects?: number;
  assetsPerProject?: number;
}
