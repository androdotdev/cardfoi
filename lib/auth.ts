import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";

const sendResetEmail = async (user: { name?: string; email: string }, url: string) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return;
  }

  const html = `
    <p>Hello ${user.name || "there"},</p>
    <p>Click the link below to reset your password:</p>
    <a href="${url}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, you can ignore this email.</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: "cardfoi <cardfoi@mail.andro42.qzz.io>",
      to: [user.email],
      subject: "Reset your Cardfoi password",
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
  }
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }, _request) => {
      void sendResetEmail(user, url);
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;