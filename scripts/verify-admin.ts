import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function verifyAdmin() {
  try {
    const users = await db.select().from(schema.user).where(eq(schema.user.role, "admin"));
    console.log("Admin users found:", users.length);
    users.forEach(u =>
      console.log(`- Email: ${u.email} | Role: ${u.role} | Name: ${u.name} | ID: ${u.id}`)
    );

    if (users.length === 0) {
      console.log("No admin users found!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

verifyAdmin();
