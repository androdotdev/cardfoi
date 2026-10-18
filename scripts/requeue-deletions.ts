import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { card, project, projectAsset } from "@/lib/db/schema";
import { publishMediaCleanup } from "@/services/jobs/qstash";

async function main() {
  const jobs: Array<{ type: "asset" | "project" | "card"; id: string }> = [];
  const deletedCards = await db.select({ id: card.id }).from(card).where(isNotNull(card.deletedAt));
  for (const row of deletedCards) jobs.push({ type: "card", id: row.id });

  const deletedProjects = await db.select({ id: project.id }).from(project)
    .innerJoin(card, eq(project.cardId, card.id))
    .where(and(isNotNull(project.deletedAt), isNull(card.deletedAt)));
  for (const row of deletedProjects) jobs.push({ type: "project", id: row.id });

  const deletedAssets = await db.select({ id: projectAsset.id }).from(projectAsset)
    .innerJoin(project, eq(projectAsset.projectId, project.id))
    .innerJoin(card, eq(project.cardId, card.id))
    .where(and(isNotNull(projectAsset.deletedAt), isNull(project.deletedAt), isNull(card.deletedAt)));
  for (const row of deletedAssets) jobs.push({ type: "asset", id: row.id });

  let queued = 0;
  for (const job of jobs) {
    await publishMediaCleanup(job);
    queued += 1;
  }
  console.log(`Queued ${queued} pending cleanup job(s).`);
}

main().then(() => process.exit(0)).catch((error: unknown) => {
  console.error("Could not requeue pending deletions.", error);
  process.exit(1);
});
