import "server-only";

import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { card, project, projectAsset, socialLink } from "@/lib/db/schema";
import type {
  PublicCardAsset,
  PublicCardProject,
  PublicCardResponse,
  PublicCardSocialLink,
} from "@/types/card";

/**
 * Reads the public projection of a card by its slug.
 *
 * This is the single read seam for the public page. When page caching is added,
 * the cache directives belong here (or on the page boundary) — callers never
 * change. Until then every visit runs these queries.
 *
 * Round trips: 1 (card) + 1 (projects/links, parallel) + 1 (assets) — no N+1.
 */
export async function getCardBySlug(slug: string): Promise<PublicCardResponse | null> {
  const [record] = await db
    .select({
      id: card.id,
      slug: card.slug,
      name: card.name,
      bio: card.bio,
      avatarUrl: card.avatarUrl,
      email: card.email,
      emailVerified: card.emailVerified,
      skills: card.skills,
      theme: card.theme,
      updatedAt: card.updatedAt,
    })
    .from(card)
    .where(and(eq(card.slug, slug), isNull(card.deletedAt)))
    .limit(1);

  if (!record) return null;

  const [projectRows, linkRows] = await Promise.all([
    db
      .select({
        id: project.id,
        title: project.title,
        description: project.description,
        position: project.position,
      })
      .from(project)
      .where(and(eq(project.cardId, record.id), isNull(project.deletedAt)))
      .orderBy(asc(project.position)),
    db
      .select({
        id: socialLink.id,
        platform: socialLink.platform,
        label: socialLink.label,
        url: socialLink.url,
        position: socialLink.position,
      })
      .from(socialLink)
      .where(eq(socialLink.cardId, record.id))
      .orderBy(asc(socialLink.position)),
  ]);

  const projectIds = projectRows.map((item) => item.id);
  const assetRows = projectIds.length
    ? await db
        .select({
          id: projectAsset.id,
          projectId: projectAsset.projectId,
          type: projectAsset.type,
          url: projectAsset.url,
          position: projectAsset.position,
        })
        .from(projectAsset)
        .where(and(inArray(projectAsset.projectId, projectIds), isNull(projectAsset.deletedAt)))
        .orderBy(asc(projectAsset.position))
    : [];

  const assetsByProject = new Map<string, PublicCardAsset[]>();
  for (const asset of assetRows) {
    const bucket = assetsByProject.get(asset.projectId) ?? [];
    bucket.push({ id: asset.id, type: asset.type, url: asset.url, position: asset.position });
    assetsByProject.set(asset.projectId, bucket);
  }

  const projects: PublicCardProject[] = projectRows.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    position: item.position,
    assets: assetsByProject.get(item.id) ?? [],
  }));

  const socialLinks: PublicCardSocialLink[] = linkRows;

  return {
    card: {
      slug: record.slug,
      name: record.name,
      bio: record.bio,
      avatarUrl: record.avatarUrl,
      email: record.email,
      emailVerified: record.emailVerified,
      skills: record.skills,
      theme: record.theme,
      updatedAt: record.updatedAt,
    },
    projects,
    socialLinks,
  };
}
