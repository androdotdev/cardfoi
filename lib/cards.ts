import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, user, works, socials } from "@/db/schema";
import { customAlphabet } from "nanoid";

export type WorkMedia = {
    id: string;
    type: "image" | "video" | "link";
    url: string;
    title: string;
    description?: string | null;
    cloudinaryPublicId?: string | null;
};

export type SocialLink = {
    id: string;
    platform:
        | "github"
        | "twitter"
        | "linkedin"
        | "website"
        | "youtube"
        | "instagram";
    url: string;
};

export type UserCard = {
    id: string;
    ownerId: string;
    name: string;
    email: string;
    avatar?: string | null;
    description: string;
    skills: string[];
    theme: string;
    template?: string;
    works: WorkMedia[];
    socialLinks: SocialLink[];
    createdAt: string;
    updatedAt: string;
};

type CardInput = {
    name: string;
    email: string;
    avatar?: string;
    description: string;
    skills: string[];
    theme?: string;
    template?: string;
};

const themes = [
    "corporate",
    "night",
    "business",
    "luxury",
    "dracula",
    "synthwave",
    "cmyk",
    "emerald",
];

function toIso(value: Date | string) {
    return value instanceof Date ? value.toISOString() : value;
}

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

// Generate default slug: name + nanoid
function generateDefaultSlug(name: string): string {
    const base = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const suffix = nanoid(); // e.g., "x7k2m3"
    return `${base}-${suffix}`; // e.g., "john-doe-x7k2m3"
}

// Validate user-chosen slug
function validateSlug(
    slug: string,
    isAdmin: boolean = false,
): { valid: boolean; error?: string } {
    // Only lowercase letters, numbers, hyphens
    if (!/^[a-z0-9-]+$/.test(slug)) {
        return {
            valid: false,
            error: "Only lowercase letters, numbers, and hyphens allowed.",
        };
    }

    // Length: 3-30 characters
    if (slug.length < 3 || slug.length > 30) {
        return { valid: false, error: "Slug must be 3-30 characters." };
    }

    // Must start with a letter
    if (!/^[a-z]/.test(slug)) {
        return { valid: false, error: "Slug must start with a letter." };
    }

    // No consecutive hyphens
    if (/--/.test(slug)) {
        return { valid: false, error: "No consecutive hyphens allowed." };
    }

    // Reserved words (skip for admin)
    if (!isAdmin) {
        const reserved = ["api", "dashboard", "www", "admin", "andro"];
        if (reserved.includes(slug)) {
            return { valid: false, error: "This slug is reserved." };
        }

        // Max 5 segments for normal users (parts separated by hyphens)
        const segments = slug.split("-");
        if (segments.length > 5) {
            return {
                valid: false,
                error: "Slug can have maximum 5 segments (separated by hyphens).",
            };
        }
    }

    return { valid: true };
}

// Check rate limit (once per month)
function checkSlugRateLimit(
    lastUpdated: Date | null,
    isAdmin: boolean = false,
): { allowed: boolean; error?: string } {
    if (isAdmin) return { allowed: true }; // Admin bypass
    if (!lastUpdated) return { allowed: true };

    const now = new Date();
    const monthsSinceUpdate =
        (now.getFullYear() - lastUpdated.getFullYear()) * 12 +
        (now.getMonth() - lastUpdated.getMonth());

    if (monthsSinceUpdate < 1) {
        return {
            allowed: false,
            error: "You can only change your slug once per month.",
        };
    }

    return { allowed: true };
}

// Ensure slug uniqueness (fallback for nanoid collision)
async function uniqueSlug(base: string): Promise<string> {
    let slug = base;
    let index = 1;

    while (
        await db
            .select({ id: cards.id })
            .from(cards)
            .where(eq(cards.id, slug))
            .limit(1)
            .then((r) => r.length > 0)
    ) {
        slug = `${base}-${index}`;
        index++;
    }

    return slug;
}

function normalizeCard(
    row: typeof cards.$inferSelect,
    cardWorks: (typeof works.$inferSelect)[] = [],
    socialLinks: (typeof socials.$inferSelect)[] = [],
): UserCard {
    return {
        id: row.id,
        ownerId: row.ownerId,
        name: row.name,
        email: row.email,
        avatar: row.avatar,
        description: row.description,
        skills: row.skills ?? [],
        theme: row.theme,
        template: row.template ?? "minimal",
        socialLinks: socialLinks.map((platforms) => ({
            id: platforms.id,
            platform: platforms.platform,
            url: platforms.url,
        })),
        works: cardWorks.map((work) => {
            const media = isMediaType(work.type);
            return {
                id: work.id,
                type: work.type as WorkMedia["type"],
                // Return proxy URL for media types, original URL for links
                url: media ? `/api/media/${work.id}` : work.url,
                title: work.title,
                description: work.description,
                // Don't expose cloudinaryPublicId to API consumers
                cloudinaryPublicId: media ? undefined : work.cloudinaryPublicId,
            };
        }),
        createdAt: toIso(row.createdAt),
        updatedAt: toIso(row.updatedAt),
    };
}

export function getThemes() {
    return themes;
}

// Helper to check if work type is media (image/video)
function isMediaType(type: string): boolean {
    return type === "image" || type === "video";
}

export async function getCurrentSession() {
    return auth.api.getSession({
        headers: await headers(),
    });
}

export async function isAdmin(userId: string) {
    const [row] = await db
        .select({ role: user.role })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);
    return row?.role === "admin";
}

export async function canManageCard(cardId: string, userId: string) {
    const card = await getCard(cardId);
    if (!card) return { allowed: false, card: undefined };

    if (card.ownerId === userId || (await isAdmin(userId))) {
        return { allowed: true, card };
    }

    return { allowed: false, card };
}

export async function listCards(ownerId?: string) {
    const rows = ownerId
        ? await db
              .select()
              .from(cards)
              .where(eq(cards.ownerId, ownerId))
              .orderBy(desc(cards.updatedAt))
        : await db.select().from(cards).orderBy(desc(cards.updatedAt));

    const allWorks = await db
        .select()
        .from(works)
        .orderBy(desc(works.createdAt));

    const allSocials = await db
        .select()
        .from(socials)
        .orderBy(socials.order);

    return rows.map((card) =>
        normalizeCard(
            card,
            allWorks.filter((work) => work.cardId === card.id),
            allSocials.filter((s) => s.cardId === card.id),
        ),
    );
}

export async function getCard(id: string) {
    const [card] = await db
        .select()
        .from(cards)
        .where(eq(cards.id, id))
        .limit(1);
    if (!card) return undefined;

    const cardWorks = await db
        .select()
        .from(works)
        .where(eq(works.cardId, id))
        .orderBy(desc(works.createdAt));

    const cardSocials = await db
        .select()
        .from(socials)
        .where(eq(socials.cardId, id))
        .orderBy(socials.order);

    return normalizeCard(card, cardWorks, cardSocials);
}

export async function createCard(
    ownerId: string,
    input: CardInput & { isAdmin?: boolean },
) {
    // Check if card with same email already exists
    const existingByEmail = await db
        .select({ id: cards.id })
        .from(cards)
        .where(eq(cards.email, input.email))
        .limit(1);
    if (existingByEmail.length > 0) {
        throw new Error("A card with this email already exists.");
    }

    const timestamp = new Date();
    const baseSlug = generateDefaultSlug(input.name);
    const slug = await uniqueSlug(baseSlug);

    const [card] = await db
        .insert(cards)
        .values({
            id: slug,
            ownerId,
            name: input.name,
            email: input.email,
            avatar: input.avatar,
            description: input.description,
            skills: input.skills,
            theme: input.theme || "corporate",
            template: input.template || "minimal",
            createdAt: timestamp,
            updatedAt: timestamp,
        })
        .returning();

    return normalizeCard(card);
}

export async function updateCard(
    id: string,
    input: Partial<CardInput> & { newSlug?: string; isAdmin?: boolean },
) {
    // Handle slug update
    if (input.newSlug) {
        const isAdmin = input.isAdmin || false;

        // Validate new slug
        const validation = validateSlug(input.newSlug, isAdmin);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // Check rate limit
        const [currentCard] = await db
            .select({ slugUpdatedAt: cards.slugUpdatedAt })
            .from(cards)
            .where(eq(cards.id, id))
            .limit(1);

        const rateCheck = checkSlugRateLimit(
            currentCard?.slugUpdatedAt || null,
            isAdmin,
        );
        if (!rateCheck.allowed) {
            throw new Error(rateCheck.error);
        }

        // Check if new slug is already taken
        const existing = await db
            .select({ id: cards.id })
            .from(cards)
            .where(eq(cards.id, input.newSlug))
            .limit(1);

        if (existing.length > 0) {
            throw new Error("This slug is already taken.");
        }

        // Update the primary key (works will cascade update)
        await db
            .update(cards)
            .set({
                id: input.newSlug,
                slugUpdatedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(cards.id, id));

        // Return updated card
        return getCard(input.newSlug);
    }

    // Check if email is being updated and conflicts with existing cards
    if (input.email) {
        const existing = await db
            .select({ id: cards.id })
            .from(cards)
            .where(eq(cards.email, input.email))
            .limit(1);
        if (existing.length > 0 && existing[0].id !== id) {
            throw new Error("A card with this email already exists.");
        }
    }

    const [card] = await db
        .update(cards)
        .set({
            ...input,
            skills: input.skills,
            template: input.template,
            updatedAt: new Date(),
        })
        .where(eq(cards.id, id))
        .returning();

    return card ? getCard(card.id) : undefined;
}

export async function addWork(cardId: string, input: Omit<WorkMedia, "id">) {
    const [work] = await db
        .insert(works)
        .values({
            id: crypto.randomUUID(),
            cardId,
            type: input.type,
            url: input.url,
            title: input.title,
            description: input.description,
            cloudinaryPublicId: input.cloudinaryPublicId,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning();

    return work ? getCard(cardId) : undefined;
}

export async function getWork(cardId: string, workId: string) {
    const [work] = await db
        .select()
        .from(works)
        .where(and(eq(works.id, workId), eq(works.cardId, cardId)))
        .limit(1);

    return work;
}

export async function deleteWork(cardId: string, workId: string) {
    await db
        .delete(works)
        .where(and(eq(works.id, workId), eq(works.cardId, cardId)));
    return getCard(cardId);
}

export async function addSocial(cardId: string, input: { platform: string; url: string }) {
    const existing = await db
        .select()
        .from(socials)
        .where(eq(socials.cardId, cardId));

    const nextOrder = existing.length;

    const [social] = await db
        .insert(socials)
        .values({
            id: crypto.randomUUID(),
            cardId,
            platform: input.platform as typeof socials.$inferInsert["platform"],
            url: input.url,
            order: nextOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning();

    return social ? getCard(cardId) : undefined;
}

export async function deleteSocial(cardId: string, socialId: string) {
    await db
        .delete(socials)
        .where(and(eq(socials.id, socialId), eq(socials.cardId, cardId)));
    return getCard(cardId);
}
