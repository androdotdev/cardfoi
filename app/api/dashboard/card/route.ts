import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { card, socialLink } from "@/lib/db/schema";
import { publishMediaCleanup } from "@/services/jobs/qstash";
import { normalizeEmail } from "@/lib/utils/normalize";

const themes = new Set(["sage", "blue", "peach"]);
const platforms = new Set(["github", "linkedin", "x", "other"]);

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const value = body as Record<string, unknown>;
  const { name, bio, email, skills, theme, socialLinks } = value;
  if (typeof name !== "string" || !name.trim() || name.trim().length > 80 ||
      typeof bio !== "string" || bio.length > 1000 ||
      typeof email !== "string" || !email.trim() || email.trim().length > 320 ||
      !Array.isArray(skills) || skills.length > 10 ||
      skills.some((skill) => typeof skill !== "string" || !skill.trim() || skill.length > 40) ||
      typeof theme !== "string" || !themes.has(theme)) {
    return NextResponse.json({ error: "Check the card fields and try again." }, { status: 400 });
  }
  if (!Array.isArray(socialLinks) || socialLinks.length > 8 || socialLinks.some((item) => {
    if (!item || typeof item !== "object") return true;
    const link = item as Record<string, unknown>;
    if (typeof link.platform !== "string" || !platforms.has(link.platform) || typeof link.url !== "string") return true;
    if (link.platform === "other" && (typeof link.label !== "string" || !link.label.trim())) return true;
    try { return new URL(link.url).protocol !== "https:"; } catch { return true; }
  })) return NextResponse.json({ error: "Add valid HTTPS social links." }, { status: 400 });

  const [current] = await db.select({ id: card.id }).from(card)
    .where(and(eq(card.ownerId, session.user.id), isNull(card.deletedAt))).limit(1);
  if (!current) return NextResponse.json({ error: "Card not found" }, { status: 404 });
  await db.transaction(async (tx) => {
    await tx.update(card).set({
      name: name.trim(), bio: bio.trim(), email: normalizeEmail(email),
      emailVerified: normalizeEmail(email) === normalizeEmail(session.user.email) && session.user.emailVerified,
      skills: skills.map((skill: string) => skill.trim()), theme,
    }).where(eq(card.id, current.id));
    await tx.delete(socialLink).where(eq(socialLink.cardId, current.id));
    if (socialLinks.length) {
      await tx.insert(socialLink).values(socialLinks.map((item, position) => {
        const link = item as { platform: "github" | "linkedin" | "x" | "other"; label?: string; url: string };
        return { cardId: current.id, platform: link.platform, label: link.platform === "other" ? link.label!.trim() : null, url: link.url.trim(), position };
      }));
    }
  });
  const [[updated], updatedLinks] = await Promise.all([
    db.select().from(card).where(eq(card.id, current.id)).limit(1),
    db.select().from(socialLink).where(eq(socialLink.cardId, current.id)),
  ]);
  return NextResponse.json({ card: updated, socialLinks: updatedLinks });
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [record] = await db.select({ id: card.id, deletedAt: card.deletedAt })
    .from(card)
    .where(eq(card.ownerId, session.user.id))
    .limit(1);
  if (!record) return NextResponse.json({ error: "Card not found" }, { status: 404 });
  if (!record.deletedAt) {
    await db.update(card).set({ deletedAt: new Date() })
      .where(and(eq(card.id, record.id), isNull(card.deletedAt)));
  }
  try {
    const queued = await publishMediaCleanup({ type: "card", id: record.id });
    return NextResponse.json({ success: true, queued: true, messageId: queued.messageId });
  } catch {
    return NextResponse.json({ error: "Card marked for deletion, but cleanup could not be queued." }, { status: 503 });
  }
}
