# 🃏 Cardfoi

> **Get Card In An Instant** — session-owned profile cards with work history, themes, and image uploads.

Live → [cardfoi.vercel.app](https://cardfoi.vercel.app)

---

## What It Is

Cardfoi lets users spin up a shareable profile card in seconds. Each card lives at a public `/:id` URL and supports a bio, avatar, work history entries, and DaisyUI theme customization. Auth is session-based via Better Auth, storage is Neon PostgreSQL via Drizzle ORM, and images are handled through Cloudinary.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | Better Auth + Drizzle Adapter |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| UI | Tailwind CSS v4 + DaisyUI v5 |
| Image Uploads | Cloudinary (`next-cloudinary`) |
| Language | TypeScript |
| Email | Resend |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/androdotdev/cardfoi.git
cd cardfoi
npm install
```

### 2. Environment Variables

Create a `.env.local` file at the root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
BETTER_AUTH_SECRET="generate-a-strong-secret"
BETTER_AUTH_URL="http://localhost:3000"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""
```

> Cloudinary uploads use an **unsigned upload preset** — set `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` to a preset created in your Cloudinary dashboard with unsigned mode enabled.

### 3. Push DB Schema & Run

```bash
npm run db:push   # push schema to Neon
npm run dev       # start dev server
```

---

## Scripts

```bash
npm run dev           # start Next.js dev server
npm run build         # production build
npm run start         # start production server
npm run lint          # run ESLint
npm run db:generate   # generate Drizzle migration files
npm run db:push       # push schema directly to DB
npm run db:studio     # open Drizzle Studio (DB GUI)
npm run db:seed       # seed the database
```

---

## Project Structure

```
cardfoi/
├── app/          # Next.js App Router — pages, layouts, API routes
├── db/           # Drizzle schema & DB client
├── drizzle/      # Generated migration files
├── lib/          # Shared utilities, auth config, Cloudinary helpers
├── scripts/      # Seed scripts
└── drizzle.config.ts
```

---

## Access Control

| Action | Requires |
|---|---|
| View card (`/:id`) | Public — no auth needed |
| Create card | Active Better Auth session |
| Edit own card | Session (owner only) |
| Update card | Session (owner only) |
| Add / delete work entries | Session (owner only) |
| Manage all cards | `role = admin` in Better Auth `user` table |

---

## License

MIT — built by [Andro](https://github.com/androdotdev)