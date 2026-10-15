"use client";

import { authClient } from "@/lib/auth-client";
import CardDashboard from "../CardDashboard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const session = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.isPending && !session.data) {
      router.push("/login");
    }
  }, [session.isPending, session.data, router]);

  if (session.isPending) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session.data) return null;

  return <CardDashboard />;
}
