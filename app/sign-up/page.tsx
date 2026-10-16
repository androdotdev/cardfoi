import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import SignUp from "@/components/Auth/SignUp";
import {
  isEmailPasswordEnabled,
  isOAuthEnabled,
} from "@/lib/auth/environment";

export const metadata: Metadata = {
  title: "Create account | Cardfoi",
  description: "Create an account and make your Cardfoi profile card.",
};

async function SignUpPageContent() {
  await connection();
  return (
    <SignUp
      allowEmailPassword={isEmailPasswordEnabled()}
      allowOAuth={isOAuthEnabled()}
    />
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f8f5]" aria-busy="true">
          <span className="sr-only">Loading sign up…</span>
        </div>
      }
    >
      <SignUpPageContent />
    </Suspense>
  );
}
