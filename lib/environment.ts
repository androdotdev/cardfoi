import "server-only";

/**
 * `NODE_ENV` identifies the runtime mode, while Vercel additionally exposes
 * `VERCEL_ENV` to distinguish preview deployments from production.
 */
export const appEnvironment =
  process.env.VERCEL_ENV ??
  process.env.NODE_ENV ??
  "development";

export const isLocalDevelopment = appEnvironment === "development";
export const isProduction = appEnvironment === "production";
export const mediaRootFolder = isLocalDevelopment ? "/cardfoi-dev" : "/cardfoi";

function normalizeUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

/** Public app origin for server-rendered links and metadata. */
export function getAppUrl(): string {
  return normalizeUrl(
    process.env.APP_URL ??
      process.env.BETTER_AUTH_URL ??
      "http://localhost:3000",
  );
}

/** Callback origin for services that cannot operate without an explicit URL. */
export function getRequiredAppUrl(): string {
  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error("APP_URL is required.");
  return normalizeUrl(appUrl);
}
