import type { Metadata } from "next";
import { connection } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { and, asc, eq, isNull } from "drizzle-orm";
import DashboardEditor from "@/components/dashboard/DashboardEditor";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { card, project, projectAsset, socialLink } from "@/lib/db/schema";
import { normalizeSlug } from "@/lib/utils/normalize";
import { randomUUID } from "node:crypto";
import type { DashboardBootstrapResponse } from "@/types/project";
import { getAppUrl } from "@/lib/environment";

export const metadata: Metadata = {
  title: "Your card | Cardfoi",
  description: "Create and edit your shareable Cardfoi card.",
};

async function DashboardPageContent() {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

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
  if (!userCard) throw new Error("Could not initialize card.");

  let [firstProject] = await db.select().from(project)
    .where(and(eq(project.cardId, userCard.id), isNull(project.deletedAt))).orderBy(project.position).limit(1);
  if (!firstProject) {
    const [createdProject] = await db.insert(project).values({ cardId: userCard.id, title: "My first project", position: 0 }).returning();
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
    db.select().from(socialLink).where(eq(socialLink.cardId, userCard.id)).orderBy(asc(socialLink.position)),
  ]);
  const initialWorkspace: DashboardBootstrapResponse = {
    card: userCard,
    projects: projectsWithAssets,
    selectedProjectId: firstProject.id,
    socialLinks: links,
  };
  const appUrl = getAppUrl();

  return (
    <DashboardEditor
      userName={session.user.name}
      userEmail={session.user.email}
      appUrl={appUrl}
      initialWorkspace={initialWorkspace}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f5f5f0] px-5 py-8" aria-busy="true">
          <div className="mx-auto max-w-[1440px]">
            <div className="h-8 w-32 animate-pulse rounded-full bg-[#e8e9e1]" />
            <div className="mt-12 h-16 w-72 max-w-full animate-pulse rounded-2xl bg-[#e8e9e1]" />
            <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
              <div className="h-[620px] animate-pulse rounded-[26px] bg-white" />
              <div className="space-y-5">
                <div className="h-52 animate-pulse rounded-[24px] bg-white" />
                <div className="h-64 animate-pulse rounded-[24px] bg-white" />
              </div>
            </div>
          </div>
          <span className="sr-only">Loading your card editor…</span>
        </main>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}
