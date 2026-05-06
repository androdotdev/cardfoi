 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AuthSection from "@/components/dashboard/AuthSection";
import { useStore } from "@nanostores/react";
import { setAuthMode } from "@/lib/stores/authStore";

export default function SignUpPage() {
  const session = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    setAuthMode("signup");
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
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>
        <AuthSection
          session={session}
          onAuthSuccess={() => {
            window.location.href = "/dashboard";
          }}
        />
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-gray-900 underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
