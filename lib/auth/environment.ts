export function getAuthEnvironment(): string {
  return (
    process.env.VERCEL_ENV ??
    (process.env.NODE_ENV === "development" ? "development" : "production")
  );
}

export function isEmailPasswordEnabled(): boolean {
  return getAuthEnvironment() !== "production";
}

export function isOAuthEnabled(): boolean {
  return getAuthEnvironment() === "production";
}
