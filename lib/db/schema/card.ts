import { randomUUID } from "node:crypto";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const socialPlatform = pgEnum("social_platform", [
  "github",
  "linkedin",
  "x",
  "other",
]);

export const projectAssetType = pgEnum("project_asset_type", [
  "site",
  "image",
  "video",
]);

export const card = pgTable(
  "card",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    bio: text("bio").notNull(),
    avatarUrl: text("avatar_url"),
    avatarId: text("avatar_id"),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    skills: text("skills").array().notNull().default(sql`'{}'::text[]`),
    theme: text("theme").notNull(),
    template: text("template").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("card_owner_id_unique").on(table.ownerId),
    uniqueIndex("card_slug_unique").on(table.slug),
    check("card_slug_lowercase_check", sql`${table.slug} = lower(${table.slug})`),
    check("card_skills_limit_check", sql`cardinality(${table.skills}) <= 10`),
  ],
);

export const socialLink = pgTable(
  "social_link",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    cardId: text("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    platform: socialPlatform("platform").notNull(),
    label: text("label"),
    url: text("url").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("social_link_card_position_idx").on(table.cardId, table.position),
    check(
      "social_link_label_platform_check",
      sql`(${table.platform} = 'other' AND ${table.label} IS NOT NULL) OR (${table.platform} <> 'other' AND ${table.label} IS NULL)`,
    ),
    check("social_link_https_url_check", sql`${table.url} ~ '^https://'`),
  ],
);

export const project = pgTable(
  "project",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    cardId: text("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [index("project_card_position_idx").on(table.cardId, table.position)],
);

export const projectAsset = pgTable(
  "project_assets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    type: projectAssetType("type").notNull(),
    url: text("url").notNull(),
    storageKey: text("storage_key"),
    uploadId: text("upload_id"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("project_assets_project_position_idx").on(table.projectId, table.position),
    uniqueIndex("project_assets_upload_id_unique")
      .on(table.uploadId)
      .where(sql`${table.uploadId} IS NOT NULL`),
    check(
      "project_assets_storage_key_type_check",
      sql`(${table.type} = 'site' AND ${table.storageKey} IS NULL AND ${table.uploadId} IS NULL) OR (${table.type} IN ('image', 'video') AND ${table.storageKey} IS NOT NULL AND ${table.uploadId} IS NOT NULL)`,
    ),
    check("project_assets_https_url_check", sql`${table.url} ~ '^https://'`),
  ],
);

export const cardRelations = relations(card, ({ one, many }) => ({
  owner: one(user, { fields: [card.ownerId], references: [user.id] }),
  socialLinks: many(socialLink),
  projects: many(project),
}));

export const socialLinkRelations = relations(socialLink, ({ one }) => ({
  card: one(card, { fields: [socialLink.cardId], references: [card.id] }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  card: one(card, { fields: [project.cardId], references: [card.id] }),
  assets: many(projectAsset),
}));

export const projectAssetRelations = relations(projectAsset, ({ one }) => ({
  project: one(project, {
    fields: [projectAsset.projectId],
    references: [project.id],
  }),
}));
