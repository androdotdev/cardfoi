import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { appEnvironment } from "@/lib/environment";

const allowEmailPassword = appEnvironment !== "production";

export const auth = betterAuth({
  appName: "Cardfoi",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: allowEmailPassword,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      requireEmailVerification: true,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      requireEmailVerification: true,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
});
