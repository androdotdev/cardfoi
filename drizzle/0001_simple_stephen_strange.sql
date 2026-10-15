CREATE TYPE "public"."platform" AS ENUM('github', 'twitter', 'linkedin', 'website', 'youtube', 'instagram');--> statement-breakpoint
CREATE TABLE "socials" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"platform" "platform" NOT NULL,
	"url" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "socials" ADD CONSTRAINT "socials_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN "phone";