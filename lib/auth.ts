import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";

const sendResetEmail = async (
  user: { name?: string; email: string },
  url: string,
) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error("RESEND_API_KEY not set");
    return;
  }

  const html = `
    <p>Hello ${user.name || "there"},</p>
    <p>Click the link below to reset your password:</p>
    <a href="${url}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, you can ignore this email.</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
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
      console.error("Resend reset email failed:", err);
    }
  } catch (error) {
    console.error("Failed to send reset email:", error);
  }
};

const sendVerifyEmail = async (
  user: { name?: string; email: string },
  url: string,
) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error("RESEND_API_KEY not set");
    return;
  }

  const html = `
    <p>Hello ${user.name || "there"},</p>
    <p>Click the link below to verify your email:</p>
    <a href="${url}">Verify Email</a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, you can ignore this email.</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "cardfoi <cardfoi@mail.andro42.qzz.io>",
        to: [user.email],
        subject: "Verify your Cardfoi email",
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Resend verification email failed:", err);
    }
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }, _request) => {
      sendResetEmail(user, url).catch(err => console.error("Reset email failed:", err));
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, _request) => {
      sendVerifyEmail(user, url).catch(err => console.error("Verification email failed:", err));
    },
    sendOnSignUp: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
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
