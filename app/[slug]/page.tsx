import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import PublicCard from "@/components/card/PublicCard";
import { getAppUrl } from "@/lib/environment";
import { validateSlug } from "@/lib/utils/card";
import { getCardBySlug } from "@/services/card";
import type { PublicCardResponse } from "@/types/card";

/**
 * Per-request memoised, so `generateMetadata` and the page share a single read.
 *
 * This route is intentionally uncached. To add caching later, mark this function
 * (or the page) with `"use cache"` plus `cacheTag(`card:${slug}`)` and call
 * `revalidateTag` from the card write paths.
 */
const loadPublicCard = cache(async (rawSlug: string): Promise<PublicCardResponse | null> => {
  const validation = validateSlug(rawSlug);
  if (!validation.ok) return null;
  return getCardBySlug(validation.slug);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const data = await loadPublicCard(slug);

  if (!data) {
    return {
      title: "Card not found | Cardfoi",
      robots: { index: false, follow: false },
    };
  }

  const url = `${getAppUrl()}/${data.card.slug}`;
  const description =
    data.card.bio.trim() || `${data.card.name} — skills, projects and links, in one card.`;
  const images = data.card.avatarUrl ? [{ url: data.card.avatarUrl }] : undefined;

  return {
    title: `${data.card.name} | Cardfoi`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${data.card.name} on Cardfoi`,
      description,
      url,
      type: "profile",
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: `${data.card.name} on Cardfoi`,
      description,
      images: data.card.avatarUrl ? [data.card.avatarUrl] : undefined,
    },
  };
}

/**
 * `connection()` marks both the metadata and the page as request-time reads.
 * `instant = false` is required because this page reads uncached data outside of
 * `<Suspense>`; without it the build fails with "uncached data during
 * prerendering".
 *
 * Note on status codes: Next.js streams page responses, and a streamed response
 * is locked to `200` once the shell is flushed. So a missing slug renders the
 * 404 UI with a `200` status plus an automatic `noindex` (see Next.js docs,
 * "Streaming page responses begin with a 200 status code"). `next dev` returns a
 * real `404`. A hard `404` in production requires a slug check in Proxy.
 */
export const instant = false;

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const data = await loadPublicCard(slug);
  if (!data) notFound();
  return <PublicCard data={data} />;
}
