import Auth from "@/components/Auth/Auth";

export interface SignInProps {
  allowEmailPassword: boolean;
  allowOAuth: boolean;
}

export function SignIn({ allowEmailPassword, allowOAuth }: SignInProps) {
  return <Auth mode="sign-in" allowEmailPassword={allowEmailPassword} allowOAuth={allowOAuth} />;
}

export default SignIn;
