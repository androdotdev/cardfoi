import { CARD_LIMITS } from "@/lib/constants";
import type { CardLimitCounts, SlugValidationResult } from "@/types/card";
import { normalizeEmail, normalizeSlug } from "./normalize";

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "dashboard",
  "login",
  "logout",
  "register",
  "settings",
  "sign-in",
  "sign-up",
  "www",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(normalizeSlug(slug));
}

export function validateSlug(value: string): SlugValidationResult {
  const slug = normalizeSlug(value);
  if (slug.length < 3 || slug.length > 40) {
    return { ok: false, reason: "Slug must be between 3 and 40 characters." };
  }
  if (isReservedSlug(slug)) {
    return { ok: false, reason: "This slug is reserved." };
  }
  return { ok: true, slug };
}

export function validateUrl(value: string, protocols: string[] = ["https:"]): boolean {
  try {
    const url = new URL(value);
    return protocols.includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function getEmailBadgeStatus(cardEmail: string, userEmail: string, userEmailVerified: boolean): boolean {
  return userEmailVerified && normalizeEmail(cardEmail) === normalizeEmail(userEmail);
}

export function validateCardLimits(input: CardLimitCounts): string[] {
  const errors: string[] = [];
  if (input.skills !== undefined && input.skills > CARD_LIMITS.skills) {
    errors.push(`A card can have at most ${CARD_LIMITS.skills} skills.`);
  }
  if (input.projects !== undefined && input.projects > CARD_LIMITS.projects) {
    errors.push(`A card can have at most ${CARD_LIMITS.projects} projects.`);
  }
  if (input.assetsPerProject !== undefined && input.assetsPerProject > CARD_LIMITS.projectAssets) {
    errors.push(`A project can have at most ${CARD_LIMITS.projectAssets} assets.`);
  }
  return errors;
}
