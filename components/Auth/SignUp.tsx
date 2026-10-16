import Auth from "@/components/Auth/Auth";

export interface SignUpProps {
  allowEmailPassword: boolean;
  allowOAuth: boolean;
}

export function SignUp({ allowEmailPassword, allowOAuth }: SignUpProps) {
  return <Auth mode="sign-up" allowEmailPassword={allowEmailPassword} allowOAuth={allowOAuth} />;
}

export default SignUp;
