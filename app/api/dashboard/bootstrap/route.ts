import { and, asc, eq, isNull } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { card, project, projectAsset, socialLink } from "@/lib/db/schema";
import { normalizeSlug } from "@/lib/utils/normalize";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let [userCard] = await db.select().from(card)
    .where(and(eq(card.ownerId, session.user.id), isNull(card.deletedAt))).limit(1);

  if (!userCard) {
    const suffix = randomUUID().slice(0, 8);
    const base = normalizeSlug(session.user.name) || "card";
    const [created] = await db.insert(card).values({
      ownerId: session.user.id,
      slug: `${base.slice(0, 31)}-${suffix}`,
      name: session.user.name,
      bio: "",
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      skills: [],
      theme: "sage",
      template: "default",
    }).onConflictDoNothing({ target: card.ownerId }).returning();
    userCard = created ?? (await db.select().from(card)
      .where(and(eq(card.ownerId, session.user.id), isNull(card.deletedAt))).limit(1))[0];
  }

  if (!userCard) return NextResponse.json({ error: "Could not initialize card" }, { status: 500 });

  let [firstProject] = await db.select().from(project)
    .where(and(eq(project.cardId, userCard.id), isNull(project.deletedAt))).orderBy(project.position).limit(1);
  if (!firstProject) {
    const [createdProject] = await db.insert(project).values({
      cardId: userCard.id,
      title: "My first project",
      position: 0,
    }).returning();
    firstProject = createdProject;
  }

  const projects = await db.select().from(project)
    .where(and(eq(project.cardId, userCard.id), isNull(project.deletedAt)))
    .orderBy(asc(project.position));
  const [projectsWithAssets, links] = await Promise.all([
    Promise.all(projects.map(async (item) => ({
      ...item,
      assets: await db.select().from(projectAsset)
        .where(and(eq(projectAsset.projectId, item.id), isNull(projectAsset.deletedAt)))
        .orderBy(asc(projectAsset.position)),
    }))),
    db.select().from(socialLink)
      .where(eq(socialLink.cardId, userCard.id)).orderBy(asc(socialLink.position)),
  ]);

  return NextResponse.json({ card: userCard, projects: projectsWithAssets, selectedProjectId: firstProject.id, socialLinks: links });
}
