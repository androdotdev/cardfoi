CREATE TYPE "public"."project_asset_type" AS ENUM('site', 'image', 'video');--> statement-breakpoint
CREATE TYPE "public"."social_platform" AS ENUM('github', 'linkedin', 'x', 'other');--> statement-breakpoint
CREATE TABLE "card" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"bio" text NOT NULL,
	"avatar_url" text,
	"avatar_id" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"skills" text[] DEFAULT '{}'::text[] NOT NULL,
	"theme" text NOT NULL,
	"template" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "card_slug_lowercase_check" CHECK ("card"."slug" = lower("card"."slug")),
	CONSTRAINT "card_skills_limit_check" CHECK (cardinality("card"."skills") <= 10)
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" "project_asset_type" NOT NULL,
	"url" text NOT NULL,
	"storage_key" text,
	"upload_id" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "project_assets_storage_key_type_check" CHECK (("project_assets"."type" = 'site' AND "project_assets"."storage_key" IS NULL AND "project_assets"."upload_id" IS NULL) OR ("project_assets"."type" IN ('image', 'video') AND "project_assets"."storage_key" IS NOT NULL AND "project_assets"."upload_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "social_link" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"platform" "social_platform" NOT NULL,
	"label" text,
	"url" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "social_link_label_platform_check" CHECK (("social_link"."platform" = 'other' AND "social_link"."label" IS NOT NULL) OR ("social_link"."platform" <> 'other' AND "social_link"."label" IS NULL))
);
--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_assets" ADD CONSTRAINT "project_assets_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_link" ADD CONSTRAINT "social_link_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "card_owner_id_unique" ON "card" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "card_slug_unique" ON "card" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "project_card_position_idx" ON "project" USING btree ("card_id","position");--> statement-breakpoint
CREATE INDEX "project_assets_project_position_idx" ON "project_assets" USING btree ("project_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "project_assets_upload_id_unique" ON "project_assets" USING btree ("upload_id") WHERE "project_assets"."upload_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "social_link_card_position_idx" ON "social_link" USING btree ("card_id","position");