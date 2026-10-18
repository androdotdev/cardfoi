import { and, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { CARD_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { card, project, projectAsset } from "@/lib/db/schema";
import { deleteMedia, verifyUploadedMedia } from "@/services/media";
import type { VerifiedMediaFile } from "@/services/media/types";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { projectId, uploadId, mimeType, sizeBytes, fileId } = body as Record<string, unknown>;
  if ([projectId, uploadId, mimeType, fileId].some((value) => typeof value !== "string") || typeof sizeBytes !== "number") {
    return NextResponse.json({ error: "Invalid upload metadata" }, { status: 400 });
  }

  const [ownedProject] = await db.select({ id: project.id })
    .from(project)
    .innerJoin(card, eq(project.cardId, card.id))
    .where(and(eq(project.id, projectId as string), eq(card.ownerId, session.user.id), isNull(project.deletedAt), isNull(card.deletedAt)))
    .limit(1);
  if (!ownedProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const [existing] = await db.select().from(projectAsset).where(eq(projectAsset.uploadId, uploadId as string)).limit(1);
  if (existing) {
    if (existing.projectId !== projectId) return NextResponse.json({ error: "Upload ID already used" }, { status: 409 });
    return NextResponse.json({ asset: existing, reused: true });
  }

  let verified: VerifiedMediaFile | undefined;
  try {
    const verifiedFile = await verifyUploadedMedia({
      target: { kind: "project-asset", ownerId: session.user.id, projectId: projectId as string },
      uploadId: uploadId as string,
      mimeType: mimeType as string,
      sizeBytes,
      fileId: fileId as string,
    });
    verified = verifiedFile;
    const result = await db.transaction(async (tx) => {
      const [lockedProject] = await tx.select({ id: project.id }).from(project)
        .where(eq(project.id, projectId as string)).for("update").limit(1);
      if (!lockedProject) throw new Error("Project not found");

      const [reusedAsset] = await tx.select().from(projectAsset)
        .where(eq(projectAsset.uploadId, uploadId as string)).limit(1);
      if (reusedAsset) {
        if (reusedAsset.projectId !== projectId) throw new Error("Upload ID already used");
        return { asset: reusedAsset, reused: true };
      }

      const [{ count }] = await tx.select({ count: sql<number>`count(*)::int` })
        .from(projectAsset)
        .where(and(eq(projectAsset.projectId, projectId as string), isNull(projectAsset.deletedAt)));
      if (count >= CARD_LIMITS.projectAssets) return null;

      const [asset] = await tx.insert(projectAsset).values({
        projectId: projectId as string,
        type: verifiedFile.kind,
        url: verifiedFile.url,
        storageKey: verifiedFile.storageKey,
        uploadId: uploadId as string,
        position: count,
      }).returning();
      return { asset, reused: false };
    });
    if (!result) {
      await deleteMedia(verifiedFile.storageKey).catch(() => undefined);
      return NextResponse.json({ error: "Project asset limit reached" }, { status: 409 });
    }
    return NextResponse.json({ asset: result.asset, reused: result.reused }, { status: result.reused ? 200 : 201 });
  } catch (error) {
    const [savedAsset] = await db.select().from(projectAsset).where(eq(projectAsset.uploadId, uploadId as string)).limit(1);
    if (savedAsset?.projectId === projectId) return NextResponse.json({ asset: savedAsset, reused: true });
    if (verified) await deleteMedia(verified.storageKey).catch(() => undefined);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save uploaded media" }, { status: 400 });
  }
}
