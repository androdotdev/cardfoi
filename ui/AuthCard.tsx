"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export type AuthMode = "sign-in" | "sign-up";

export interface AuthCardProps {
  mode: AuthMode;
  allowEmailPassword: boolean;
  allowOAuth: boolean;
}

type ActiveProvider = "google" | "github";

function getCallbackURL(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function AuthCard({
  mode,
  allowEmailPassword,
  allowOAuth,
}: AuthCardProps) {
  const searchParams = useSearchParams();
  const callbackURL = getCallbackURL(searchParams.get("callbackURL"));
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

          {allowOAuth && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => void handleOAuth("google")}
                disabled={pending !== null}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dfe2d9] px-4 py-3 text-sm font-medium text-[#30352b] transition hover:border-[#aeb69f] hover:bg-[#fafbf8] disabled:cursor-wait disabled:opacity-60"
              >
                <span aria-hidden="true" className="font-bold text-base text-[#4285f4]">G</span>
                {pending === "google" ? "Connecting…" : "Continue with Google"}
              </button>
              <button
                type="button"
                onClick={() => void handleOAuth("github")}
                disabled={pending !== null}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dfe2d9] px-4 py-3 text-sm font-medium text-[#30352b] transition hover:border-[#aeb69f] hover:bg-[#fafbf8] disabled:cursor-wait disabled:opacity-60"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.16 1.71 1.16 1 1.7 2.62 1.21 3.26.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.29-2.62 5.24-5.11 5.51.4.35.76 1.03.76 2.08v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
                {pending === "github" ? "Connecting…" : "Continue with GitHub"}
              </button>
            </div>
          )}

          {allowOAuth && allowEmailPassword && (
            <div className="my-6 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.16em] text-[#a0a49a]">
              <span className="h-px flex-1 bg-[#e9ebe5]" />
              or with email
              <span className="h-px flex-1 bg-[#e9ebe5]" />
            </div>
          )}

          {allowEmailPassword && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isSignUp && (
                <label className="block space-y-2 text-xs font-medium text-[#4a5043]">
                  Name
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-[#dfe2d9] bg-white px-4 py-3 text-sm font-normal text-[#25291f] outline-none transition placeholder:text-[#a0a49a] focus:border-[#788663] focus:ring-4 focus:ring-[#788663]/10"
                  />
                </label>
              )}
              <label className="block space-y-2 text-xs font-medium text-[#4a5043]">
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#dfe2d9] bg-white px-4 py-3 text-sm font-normal text-[#25291f] outline-none transition placeholder:text-[#a0a49a] focus:border-[#788663] focus:ring-4 focus:ring-[#788663]/10"
                />
              </label>
              <label className="block space-y-2 text-xs font-medium text-[#4a5043]">
                Password
                <input
                  type="password"
                  name="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-[#dfe2d9] bg-white px-4 py-3 text-sm font-normal text-[#25291f] outline-none transition placeholder:text-[#a0a49a] focus:border-[#788663] focus:ring-4 focus:ring-[#788663]/10"
                />
              </label>
              <button
                type="submit"
                disabled={pending !== null}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#283321] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#3b4a30] disabled:cursor-wait disabled:opacity-60"
              >
                {pending === "email"
                  ? "Please wait…"
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>
          )}

          {!allowEmailPassword && !allowOAuth && (
            <p className="rounded-xl border border-[#ead7c4] bg-[#fcf7f1] p-4 text-sm leading-6 text-[#765b42]">
              Sign in is not available in this environment yet.
            </p>
          )}

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-xl border border-[#f0d1cd] bg-[#fff7f6] px-4 py-3 text-sm leading-5 text-[#a33f35]">
              {errorMessage}
            </p>
          )}

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
