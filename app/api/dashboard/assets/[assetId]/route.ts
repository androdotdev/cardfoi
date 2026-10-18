import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { card, project, projectAsset } from "@/lib/db/schema";
import { publishMediaCleanup } from "@/services/jobs/qstash";

export async function DELETE(_request: Request, context: { params: Promise<{ assetId: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { assetId } = await context.params;
  const [asset] = await db.select({ id: projectAsset.id, deletedAt: projectAsset.deletedAt })
    .from(projectAsset)
    .innerJoin(project, eq(projectAsset.projectId, project.id))
    .innerJoin(card, eq(project.cardId, card.id))
    .where(and(eq(projectAsset.id, assetId), eq(card.ownerId, session.user.id), isNull(card.deletedAt), isNull(project.deletedAt)))
    .limit(1);
  if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  if (!asset.deletedAt) {
    await db.update(projectAsset).set({ deletedAt: new Date() })
      .where(and(eq(projectAsset.id, assetId), isNull(projectAsset.deletedAt)));
  }
  try {
    const queued = await publishMediaCleanup({ type: "asset", id: assetId });
    return NextResponse.json({ success: true, queued: true, messageId: queued.messageId });
  } catch {
    return NextResponse.json({ error: "Asset marked for deletion, but cleanup could not be queued." }, { status: 503 });
  }
}
