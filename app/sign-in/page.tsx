import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import SignIn from "@/components/Auth/SignIn";
import {
  isEmailPasswordEnabled,
  isOAuthEnabled,
} from "@/lib/auth/environment";

export const metadata: Metadata = {
  title: "Sign in | Cardfoi",
  description: "Sign in to manage your Cardfoi profile card.",
};

async function SignInPageContent() {
  await connection();
  return (
    <SignIn
      allowEmailPassword={isEmailPasswordEnabled()}
      allowOAuth={isOAuthEnabled()}
    />
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f8f5]" aria-busy="true">
          <span className="sr-only">Loading sign in…</span>
        </div>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}
