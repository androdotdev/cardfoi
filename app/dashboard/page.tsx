import type { Metadata } from "next";
import { connection } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardEditor from "@/components/dashboard/DashboardEditor";
import { auth } from "@/lib/auth";

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

  return (
    <DashboardEditor
      userName={session.user.name}
      userEmail={session.user.email}
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
