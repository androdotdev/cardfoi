import { and, eq, isNotNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { card, project, projectAsset } from "@/lib/db/schema";
import { deleteMedia } from "@/services/media";
import { verifyQStashRequest } from "@/services/jobs/verify-qstash";
import type { MediaCleanupJob } from "@/types/jobs";

async function deleteStoredFiles(storageKeys: Array<string | null>, extraKey?: string | null) {
  const keys = [...storageKeys, extraKey].filter((key): key is string => Boolean(key));
  const results = await Promise.allSettled(keys.map((key) => deleteMedia(key)));
  const failure = results.find((result) => result.status === "rejected");
  if (failure?.status === "rejected") throw failure.reason;
}

async function cleanup(job: MediaCleanupJob): Promise<void> {
  if (job.type === "asset") {
    const [asset] = await db.select().from(projectAsset)
      .where(and(eq(projectAsset.id, job.id), isNotNull(projectAsset.deletedAt))).limit(1);
    if (!asset) return;
    if (asset.storageKey) await deleteMedia(asset.storageKey);
    await db.delete(projectAsset).where(and(eq(projectAsset.id, asset.id), isNotNull(projectAsset.deletedAt)));
    return;
  }

  if (job.type === "project") {
    const [deletedProject] = await db.select().from(project)
      .where(and(eq(project.id, job.id), isNotNull(project.deletedAt))).limit(1);
    if (!deletedProject) return;
    const assets = await db.select({ storageKey: projectAsset.storageKey }).from(projectAsset)
      .where(eq(projectAsset.projectId, job.id));
    await deleteStoredFiles(assets.map((asset) => asset.storageKey));
    await db.delete(project).where(and(eq(project.id, job.id), isNotNull(project.deletedAt)));
    return;
  }

  const [deletedCard] = await db.select().from(card)
    .where(and(eq(card.id, job.id), isNotNull(card.deletedAt))).limit(1);
  if (!deletedCard) return;
  const assets = await db.select({ storageKey: projectAsset.storageKey })
    .from(projectAsset)
    .innerJoin(project, eq(projectAsset.projectId, project.id))
    .where(eq(project.cardId, job.id));
  await deleteStoredFiles(assets.map((asset) => asset.storageKey), deletedCard.avatarId);
  await db.delete(card).where(and(eq(card.id, job.id), isNotNull(card.deletedAt)));
}

export async function POST(request: Request) {
  const body = await request.text();
  if (!verifyQStashRequest({
    signature: request.headers.get("Upstash-Signature"),
    body,
    url: request.url,
  })) {
    return NextResponse.json({ error: "Invalid QStash signature" }, { status: 401 });
  }

  let job: unknown;
  try {
    job = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid job payload" }, { status: 400 });
  }
  if (!job || typeof job !== "object" || !["asset", "project", "card"].includes((job as { type?: string }).type ?? "") || typeof (job as { id?: unknown }).id !== "string") {
    return NextResponse.json({ error: "Invalid job payload" }, { status: 400 });
  }

  try {
    await cleanup(job as MediaCleanupJob);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media cleanup job failed", error);
    return NextResponse.json({ error: "Cleanup failed; QStash may retry this job." }, { status: 500 });
  }
}
