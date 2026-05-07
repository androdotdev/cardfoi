import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { cards } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cardfoi.vercel.app";

  // Get all public card slugs from DB
  const allCards = await db.select({ id: cards.id }).from(cards);

  const cardUrls = allCards.map((card) => ({
    url: `${baseUrl}/${card.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...cardUrls,
  ];
}
