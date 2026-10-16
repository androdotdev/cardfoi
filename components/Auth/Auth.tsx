import AuthCard, { type AuthMode } from "@/ui/AuthCard";

export interface AuthProps {
  mode: AuthMode;
  allowEmailPassword: boolean;
  allowOAuth: boolean;
}

export function Auth({ mode, allowEmailPassword, allowOAuth }: AuthProps) {
  return (
    <AuthCard
      mode={mode}
      allowEmailPassword={allowEmailPassword}
      allowOAuth={allowOAuth}
    />
  );
}

export default Auth;
