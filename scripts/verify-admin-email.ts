import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function verifyAdminEmail() {
  try {
    const result = await db
      .update(schema.user)
      .set({ emailVerified: true })
      .where(eq(schema.user.email, "androkingdom1@gmail.com"))
      .returning();

    if (result.length > 0) {
      console.log("Admin email verified successfully!");
      console.log("- Email:", result[0].email);
      console.log("- Email Verified:", result[0].emailVerified);
    } else {
      console.log("Admin user not found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

verifyAdminEmail();
