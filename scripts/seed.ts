import "dotenv/config";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { account, cards, user, works } from "@/db/schema";
import { db } from "@/lib/db";

async function main() {
  const timestamp = new Date();
  const userId = "andro-user";
  const cardId = "andro";
  const email = "androkingdom1@gmail.com";
  const passwordHash = await hashPassword("1234@andro");

  await db
    .insert(user)
    .values({
      id: userId,
      name: "Andro",
      email,
      emailVerified: true,
      image: "",
      role: "admin",
      createdAt: timestamp,
      updatedAt: timestamp
    })
    .onConflictDoUpdate({
      target: user.id,
      set: {
        name: "Andro",
        email,
        role: "admin",
        updatedAt: timestamp
      }
    });

  await db
    .insert(account)
    .values({
      id: "andro-credential-account",
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
      createdAt: timestamp,
      updatedAt: timestamp
    })
    .onConflictDoUpdate({
      target: account.id,
      set: {
        accountId: userId,
        providerId: "credential",
        userId,
        password: passwordHash,
        updatedAt: timestamp
      }
    });

  await db
    .insert(cards)
    .values({
      id: cardId,
      ownerId: userId,
      name: "Andro",
      email,
      phone: "+91 98765 43210",
      avatar: "",
      description:
        "Full-stack developer focused on practical web products, clean APIs, and useful automation.",
      skills: ["Next.js", "TypeScript", "PostgreSQL", "Cloudinary", "Better Auth"],
      theme: "business",
      createdAt: timestamp,
      updatedAt: timestamp
    })
    .onConflictDoUpdate({
      target: cards.id,
      set: {
        ownerId: userId,
        name: "Andro",
        email,
        description:
          "Full-stack developer focused on practical web products, clean APIs, and useful automation.",
        skills: ["Next.js", "TypeScript", "PostgreSQL", "Cloudinary", "Better Auth"],
        theme: "business",
        updatedAt: timestamp
      }
    });

  const existingWork = await db.select().from(works).where(eq(works.cardId, cardId)).limit(1);

  if (!existingWork.length) {
    await db.insert(works).values({
      id: "seed-andro-work",
      cardId,
      type: "link",
      title: "Andro Card",
      url: "https://github.com/androdotdev",
      description: "A shareable profile card app with auth, RBAC, Neon, and Cloudinary.",
      order: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  }

  console.log("Seeded Andro account and card at /andro");
  console.log("Login: androkingdom1@gmail.com / 1234@andro");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
