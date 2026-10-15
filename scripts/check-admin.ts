import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function checkAdmin() {
  try {
    const admin = await db.select().from(schema.user).where(eq(schema.user.email, "androkingdom1@gmail.com"));

    if (admin.length > 0) {
      console.log("Admin user details:");
      console.log("- Email:", admin[0].email);
      console.log("- Email Verified:", admin[0].emailVerified);
      console.log("- Role:", admin[0].role);
    } else {
      console.log("Admin user not found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

checkAdmin();
