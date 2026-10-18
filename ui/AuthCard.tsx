"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthMethods, type ActiveProvider } from "@/ui/AuthMethods";

export type AuthMode = "sign-in" | "sign-up";

export interface AuthCardProps {
  mode: AuthMode;
  allowEmailPassword: boolean;
  allowOAuth: boolean;
}

function safeCallbackURL(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }

  try {
    const destination = new URL(value, window.location.origin);
    if (destination.origin !== window.location.origin) {
      return "/";
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/";
  }
}

export function AuthCard({
  mode,
  allowEmailPassword,
  allowOAuth,
}: AuthCardProps) {
  const searchParams = useSearchParams();
  const callbackURL = safeCallbackURL(searchParams.get("callbackURL"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSignUp = mode === "sign-up";

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("email");
    setErrorMessage(null);

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL,
          })
        : await authClient.signIn.email({ email, password, callbackURL });

      if (result.error) {
        setErrorMessage(result.error.message ?? "Unable to authenticate. Please try again.");
        setPending(null);
      }
    } catch {
      setErrorMessage("Unable to authenticate. Please try again.");
      setPending(null);
    }
  }

  async function handleOAuth(provider: ActiveProvider) {
    setPending(provider);
    setErrorMessage(null);

    try {
      const result = await authClient.signIn.social({ provider, callbackURL });
      if (result.error) {
        setErrorMessage(result.error.message ?? "Unable to continue with that provider.");
        setPending(null);
      }
    } catch {
      setErrorMessage("Unable to continue with that provider. Please try again.");
      setPending(null);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f2] px-5 py-12 text-[#25291f] sm:px-8">
      <section className="grid min-h-[680px] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#e6e9df] bg-white shadow-[0_24px_80px_-40px_rgba(38,47,31,0.25)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#283321] p-10 text-white md:flex lg:p-14">
          <div aria-hidden="true" className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#3b4a30]" />
          <Link href="/" className="relative z-10 flex items-center gap-3 text-sm font-semibold tracking-tight" aria-label="Cardfoi home">
            <Image src="/icon.svg" alt="" width={36} height={36} />
            cardfoi
          </Link>
          <div className="relative z-10 py-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bdc8ad]">Your work, together</p>
            <h1 className="mt-5 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] lg:text-5xl">
              One card for everything you make.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              Bring your skills, projects, and links into one simple page that is ready to share.
            </p>
          </div>
          <p className="relative z-10 text-[10px] tracking-wide text-white/45">INSTANT · PERSONAL · SHAREABLE</p>
        </div>

        <div className="px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <Link href="/" className="mb-9 inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-[#283321] md:hidden">
            <Image src="/icon.svg" alt="" width={32} height={32} />
            cardfoi
          </Link>

          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#788663]">
              {isSignUp ? "Get started" : "Welcome back"}
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] sm:text-4xl">
              {isSignUp ? "Create your account" : "Sign in to Cardfoi"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#73786d]">
              {isSignUp
                ? "Start building a card that makes your work easy to share."
                : "Pick up where you left off and keep your card up to date."}
            </p>
          </div>

          <AuthMethods
            mode={mode}
            allowEmailPassword={allowEmailPassword}
            allowOAuth={allowOAuth}
            pending={pending}
            errorMessage={errorMessage}
            name={name}
            email={email}
            password={password}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onEmailSubmit={(event) => void handleEmailSubmit(event)}
            onOAuth={(provider) => void handleOAuth(provider)}
          />

          <p className="mt-7 text-center text-sm text-[#73786d]">
            {isSignUp ? "Already have an account?" : "New to Cardfoi?"}{" "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="font-semibold text-[#45543a] underline decoration-[#b5bea8] underline-offset-4 transition hover:text-[#283321]"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
          <p className="mt-5 text-center text-[11px] leading-5 text-[#a0a49a]">
            By continuing, you agree to use Cardfoi responsibly.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AuthCard;
