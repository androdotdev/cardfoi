import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { card, project } from "@/lib/db/schema";
import { publishMediaCleanup } from "@/services/jobs/qstash";

export async function PATCH(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [{ projectId }, body]: [
    { projectId: string },
    unknown,
  ] = await Promise.all([
    context.params,
    request.json().catch(() => null),
  ]);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const value = body as Record<string, unknown>;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const description = typeof value.description === "string" ? value.description.trim() : "";
  if (!title || title.length > 100 || description.length > 500) {
    return NextResponse.json({ error: "A title is required; description must be 500 characters or fewer." }, { status: 400 });
  }
  const [owned] = await db.select({ id: project.id }).from(project).innerJoin(card, eq(project.cardId, card.id))
    .where(and(eq(project.id, projectId), eq(card.ownerId, session.user.id), isNull(project.deletedAt), isNull(card.deletedAt))).limit(1);
  if (!owned) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  const [updated] = await db.update(project).set({ title, description: description || null })
    .where(eq(project.id, projectId)).returning();
  return NextResponse.json({ project: updated });
}

export async function DELETE(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await context.params;
  const [record] = await db.select({ id: project.id, deletedAt: project.deletedAt })
    .from(project)
    .innerJoin(card, eq(project.cardId, card.id))
    .where(and(eq(project.id, projectId), eq(card.ownerId, session.user.id), isNull(card.deletedAt)))
    .limit(1);
  if (!record) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (!record.deletedAt) {
    await db.update(project).set({ deletedAt: new Date() })
      .where(and(eq(project.id, projectId), isNull(project.deletedAt)));
  }
  try {
    const queued = await publishMediaCleanup({ type: "project", id: projectId });
    return NextResponse.json({ success: true, queued: true, messageId: queued.messageId });
  } catch {
    return NextResponse.json({ error: "Project marked for deletion, but cleanup could not be queued." }, { status: 503 });
  }
}
