import { appEnvironment } from "@/lib/environment";

export function getAuthEnvironment(): string {
  return appEnvironment;
}

export function isEmailPasswordEnabled(): boolean {
  return getAuthEnvironment() !== "production";
}

export function isOAuthEnabled(): boolean {
  return getAuthEnvironment() === "production";
}
