import type { FormEvent } from "react";
import type { AuthMode } from "@/ui/AuthCard";

type ActiveProvider = "google" | "github";

export function AuthMethods({
  mode,
  allowEmailPassword,
  allowOAuth,
  pending,
  errorMessage,
  name,
  email,
  password,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onEmailSubmit,
  onOAuth,
}: {
  mode: AuthMode;
  allowEmailPassword: boolean;
  allowOAuth: boolean;
  pending: string | null;
  errorMessage: string | null;
  name: string;
  email: string;
  password: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEmailSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onOAuth: (provider: ActiveProvider) => void;
}) {
  const isSignUp = mode === "sign-up";

  return (
    <>
      {allowOAuth && (
        <div className="space-y-3">
          <button type="button" onClick={() => onOAuth("google")} disabled={pending !== null} className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dfe2d9] px-4 py-3 text-sm font-medium text-[#30352b] transition hover:border-[#aeb69f] hover:bg-[#fafbf8] disabled:cursor-wait disabled:opacity-60">
            <span aria-hidden="true" className="font-bold text-base text-[#4285f4]">G</span>
            {pending === "google" ? "Connecting…" : "Continue with Google"}
          </button>
          <button type="button" onClick={() => onOAuth("github")} disabled={pending !== null} className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dfe2d9] px-4 py-3 text-sm font-medium text-[#30352b] transition hover:border-[#aeb69f] hover:bg-[#fafbf8] disabled:cursor-wait disabled:opacity-60">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.16 1.71 1.16 1 1.7 2.62 1.21 3.26.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.29-2.62 5.24-5.11 5.51.4.35.76 1.03.76 2.08v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>
            {pending === "github" ? "Connecting…" : "Continue with GitHub"}
          </button>
        </div>
      )}
      {allowOAuth && allowEmailPassword && <div className="my-6 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.16em] text-[#a0a49a]"><span className="h-px flex-1 bg-[#e9ebe5]" />or with email<span className="h-px flex-1 bg-[#e9ebe5]" /></div>}
      {allowEmailPassword && (
        <form onSubmit={onEmailSubmit} className="space-y-4">
          {isSignUp && <label className="block space-y-2 text-xs font-medium text-[#4a5043]">Name<input type="text" name="name" autoComplete="name" required value={name} onChange={(event) => onNameChange(event.target.value)} placeholder="Your name" className="w-full rounded-xl border border-[#dfe2d9] bg-white px-4 py-3 text-sm font-normal text-[#25291f] outline-none transition placeholder:text-[#a0a49a] focus:border-[#788663] focus:ring-4 focus:ring-[#788663]/10" /></label>}
          <label className="block space-y-2 text-xs font-medium text-[#4a5043]">Email<input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => onEmailChange(event.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-[#dfe2d9] bg-white px-4 py-3 text-sm font-normal text-[#25291f] outline-none transition placeholder:text-[#a0a49a] focus:border-[#788663] focus:ring-4 focus:ring-[#788663]/10" /></label>
          <label className="block space-y-2 text-xs font-medium text-[#4a5043]">Password<input type="password" name="password" autoComplete={isSignUp ? "new-password" : "current-password"} minLength={8} required value={password} onChange={(event) => onPasswordChange(event.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-[#dfe2d9] bg-white px-4 py-3 text-sm font-normal text-[#25291f] outline-none transition placeholder:text-[#a0a49a] focus:border-[#788663] focus:ring-4 focus:ring-[#788663]/10" /></label>
          <button type="submit" disabled={pending !== null} className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#283321] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#3b4a30] disabled:cursor-wait disabled:opacity-60">{pending === "email" ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}</button>
        </form>
      )}
      {!allowEmailPassword && !allowOAuth && <p className="rounded-xl border border-[#ead7c4] bg-[#fcf7f1] p-4 text-sm leading-6 text-[#765b42]">Sign in is not available in this environment yet.</p>}
      {errorMessage && <p role="alert" className="mt-4 rounded-xl border border-[#f0d1cd] bg-[#fff7f6] px-4 py-3 text-sm leading-5 text-[#a33f35]">{errorMessage}</p>}
    </>
  );
}

export type { ActiveProvider };
