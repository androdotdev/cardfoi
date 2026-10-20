export type SlugValidationResult =
  | { ok: true; slug: string }
  | { ok: false; reason: string };

export interface CardLimitCounts {
  skills?: number;
  projects?: number;
  assetsPerProject?: number;
}

export type SocialPlatform = "github" | "linkedin" | "x" | "other";
export type ProjectAssetKind = "image" | "video" | "site";

export interface PublicCardAsset {
  id: string;
  type: ProjectAssetKind;
  url: string;
  position: number;
}

export interface PublicCardProject {
  id: string;
  title: string;
  description: string | null;
  position: number;
  assets: PublicCardAsset[];
}

export interface PublicCardSocialLink {
  id: string;
  platform: SocialPlatform;
  label: string | null;
  url: string;
  position: number;
}

/**
 * Public projection of a card. Deliberately excludes owner ids, provider file
 * identifiers, and soft-delete bookkeeping.
 */
export interface PublicCardResponse {
  card: {
    slug: string;
    name: string;
    bio: string;
    avatarUrl: string | null;
    email: string;
    emailVerified: boolean;
    skills: string[];
    theme: string;
    updatedAt: Date;
  };
  projects: PublicCardProject[];
  socialLinks: PublicCardSocialLink[];
}
