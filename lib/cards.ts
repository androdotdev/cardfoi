import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, user, works } from "@/db/schema";

export type WorkMedia = {
  id: string;
  type: "image" | "video" | "link";
  url: string;
  title: string;
  description?: string | null;
  cloudinaryPublicId?: string | null;
};

export type UserCard = {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
  description: string;
  skills: string[];
  theme: string;
  template?: string;
  works: WorkMedia[];
  createdAt: string;
  updatedAt: string;
};

type CardInput = {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  description: string;
  skills: string[];
  theme?: string;
  template?: string;
};

const themes = ["corporate", "business", "emerald", "cupcake", "dracula", "night", "synthwave", "retro", "cyberpunk", "garden", "luxury", "dark", "sunset", "aqua", "black", "lemonade", "fantasy", "wireframe", "cmyk"];
const templates = ["minimal", "cover", "sidebar", "terminal", "glass", "timeline"];

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function toSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `card-${Date.now()}`;
}

async function uniqueSlug(base: string) {
  let slug = base;
  let index = 2;

  while (await getCard(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return slug;
}

function normalizeCard(row: typeof cards.$inferSelect, cardWorks: (typeof works.$inferSelect)[] = []): UserCard {
  return {
    id: row.id,
    ownerId: row.ownerId,
    name: row.name,
    email: row.email,
    phone: row.phone,
    avatar: row.avatar,
    description: row.description,
    skills: row.skills ?? [],
    theme: row.theme,
    template: row.template ?? "minimal",
    works: cardWorks.map((work) => ({
      id: work.id,
      type: work.type as WorkMedia["type"],
      url: work.url,
      title: work.title,
      description: work.description,
      cloudinaryPublicId: work.cloudinaryPublicId
    })),
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt)
  };
}

export function getThemes() {
  return themes;
}

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers()
  });
}

export async function isAdmin(userId: string) {
  const [row] = await db.select({ role: user.role }).from(user).where(eq(user.id, userId)).limit(1);
  return row?.role === "admin";
}

export async function canManageCard(cardId: string, userId: string) {
  const card = await getCard(cardId);
  if (!card) return { allowed: false, card: undefined };

  if (card.ownerId === userId || (await isAdmin(userId))) {
    return { allowed: true, card };
  }

  return { allowed: false, card };
}

export async function listCards(ownerId?: string) {
  const rows = ownerId
    ? await db.select().from(cards).where(eq(cards.ownerId, ownerId)).orderBy(desc(cards.updatedAt))
    : await db.select().from(cards).orderBy(desc(cards.updatedAt));

  const allWorks = await db.select().from(works).orderBy(desc(works.createdAt));

  return rows.map((card) => normalizeCard(card, allWorks.filter((work) => work.cardId === card.id)));
}

export async function getCard(id: string) {
  const [card] = await db.select().from(cards).where(eq(cards.id, id)).limit(1);
  if (!card) return undefined;

  const cardWorks = await db.select().from(works).where(eq(works.cardId, id)).orderBy(desc(works.createdAt));
  return normalizeCard(card, cardWorks);
}

export async function createCard(ownerId: string, input: CardInput) {
  const timestamp = new Date();
  const id = await uniqueSlug(toSlug(input.name));

  const [card] = await db
    .insert(cards)
    .values({
      id,
      ownerId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      avatar: input.avatar,
      description: input.description,
      skills: input.skills,
      theme: input.theme || "corporate",
      template: input.template || "minimal",
      createdAt: timestamp,
      updatedAt: timestamp
    })
    .returning();

  return normalizeCard(card);
}

export async function updateCard(id: string, input: Partial<CardInput>) {
  const [card] = await db
    .update(cards)
    .set({
      ...input,
      skills: input.skills,
      template: input.template,
      updatedAt: new Date()
    })
    .where(eq(cards.id, id))
    .returning();

  return card ? getCard(card.id) : undefined;
}

export async function addWork(cardId: string, input: Omit<WorkMedia, "id">) {
  const [work] = await db
    .insert(works)
    .values({
      id: crypto.randomUUID(),
      cardId,
      type: input.type,
      url: input.url,
      title: input.title,
      description: input.description,
      cloudinaryPublicId: input.cloudinaryPublicId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning();

  return work ? getCard(cardId) : undefined;
}

export async function getWork(cardId: string, workId: string) {
  const [work] = await db
    .select()
    .from(works)
    .where(and(eq(works.id, workId), eq(works.cardId, cardId)))
    .limit(1);

  return work;
}

export async function deleteWork(cardId: string, workId: string) {
  await db.delete(works).where(and(eq(works.id, workId), eq(works.cardId, cardId)));
  return getCard(cardId);
}
