import { and, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { CARD_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { card, project, projectAsset } from "@/lib/db/schema";
import { createUploadAuthorization, createUploadId } from "@/services/media";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { projectId, mimeType, sizeBytes } = body as Record<string, unknown>;
  if (typeof projectId !== "string" || typeof mimeType !== "string" || typeof sizeBytes !== "number") {
    return NextResponse.json({ error: "projectId, mimeType, and sizeBytes are required" }, { status: 400 });
  }

  const [ownedProject] = await db.select({ id: project.id })
    .from(project)
    .innerJoin(card, eq(project.cardId, card.id))
    .where(and(eq(project.id, projectId), eq(card.ownerId, session.user.id), isNull(project.deletedAt), isNull(card.deletedAt)))
    .limit(1);
  if (!ownedProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
    .from(projectAsset)
    .where(and(eq(projectAsset.projectId, projectId), isNull(projectAsset.deletedAt)));
  if (count >= CARD_LIMITS.projectAssets) return NextResponse.json({ error: "Project asset limit reached" }, { status: 409 });

  try {
    const uploadId = createUploadId();
    const authorization = createUploadAuthorization({
      target: { kind: "project-asset", ownerId: session.user.id, projectId },
      uploadId,
      mimeType,
      sizeBytes,
    });
    return NextResponse.json({ uploadId, authorization });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload is not allowed" }, { status: 400 });
  }
}
