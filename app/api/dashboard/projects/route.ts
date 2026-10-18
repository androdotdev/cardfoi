import { and, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { CARD_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { card, project } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  const value = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const title = typeof value.title === "string" ? value.title.trim() : "";
  if (!title || title.length > 100) return NextResponse.json({ error: "Project title is required (100 characters max)." }, { status: 400 });
  const [ownedCard] = await db.select({ id: card.id }).from(card)
    .where(and(eq(card.ownerId, session.user.id), isNull(card.deletedAt))).limit(1);
  if (!ownedCard) return NextResponse.json({ error: "Card not found" }, { status: 404 });
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(project)
    .where(and(eq(project.cardId, ownedCard.id), isNull(project.deletedAt)));
  if (count >= CARD_LIMITS.projects) return NextResponse.json({ error: `You can add up to ${CARD_LIMITS.projects} projects.` }, { status: 409 });
  const [created] = await db.insert(project).values({
    cardId: ownedCard.id,
    title,
    description: typeof value.description === "string" ? value.description.trim().slice(0, 500) : null,
    position: count,
  }).returning();
  return NextResponse.json({ project: created }, { status: 201 });
}
