import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function seedAdmin() {
  const email = "androkingdom1@gmail.com";
  const password = "cardfoi@admin@1234";
  const name = "Admin";

  try {
    console.log("Creating admin user...");

    const user = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: "admin",
      },
    });

    // Set email as verified
    await db
      .update(schema.user)
      .set({ emailVerified: true })
      .where(eq(schema.user.id, user.user.id));

    console.log("Admin user created successfully!");
    console.log("Email:", email);
    console.log("Role:", user.user.role);
    console.log("ID:", user.user.id);
    console.log("Email Verified: true");
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log("Admin user already exists with email:", email);
      // Update existing user to ensure they're admin and verified
      const existingUsers = await db.select().from(schema.user).where(eq(schema.user.email, email));
      if (existingUsers.length > 0) {
        await db
          .update(schema.user)
          .set({ role: "admin", emailVerified: true })
          .where(eq(schema.user.id, existingUsers[0].id));
        console.log("Updated existing user to admin role and verified email");
      }
    } else {
      console.error("Error creating admin user:", error);
    }
  }

  process.exit(0);
}

seedAdmin();
