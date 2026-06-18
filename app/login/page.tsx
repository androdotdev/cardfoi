 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AuthSection from "@/components/dashboard/AuthSection";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export default function LoginPage() {
  const session = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    useAuthStore.getState().setAuthMode("signin");
  }, []);

  useEffect(() => {
    if (!session.isPending && session.data) {
      router.push("/dashboard");
    }
  }, [session.isPending, session.data, router]);

  if (session.isPending) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (session.data) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <a href="/" className="font-medium text-2xl">Cardfoi</a>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        <AuthSection
          session={session}
          onAuthSuccess={() => {
            window.location.href = "/dashboard";
          }}
        />
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-gray-900 underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
