# 🃏 Cardfoi

> **Get Card In An Instant** — session-owned profile cards with work history, themes, and image uploads.

Live → [cardfoi.vercel.app](https://cardfoi.vercel.app)

---

## What It Is

Cardfoi lets users spin up a shareable profile card in seconds. Each card lives at a public `/:id` URL and supports a bio, avatar, work history entries, social links, and DaisyUI theme customization. Auth is handled by Better Auth (email/password + Google OAuth), storage is Neon PostgreSQL via Drizzle ORM, and images are handled through Cloudinary.

---

## Features

- **Shareable profile cards** — one link per card, live at `cardfoi.vercel.app/{slug}`
- **8 visual templates** — Minimal, Cover, Sidebar, Terminal, Glass, Timeline, Modern, Professional
- **8 DaisyUI themes** — switch accent colors instantly
- **Media uploads** — images and video via Cloudinary, served through a proxy
- **Social links** — GitHub, Twitter, LinkedIn, and more in the card footer
- **Dark mode dashboard** — with smooth CSS transitions and responsive sidebar
- **Email/password + Google OAuth** — via Better Auth, with email verification and password reset
- **Work history entries** — links and media with titles

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
| UI State | Zustand |
| Server State | React Query |
| Animation | Framer Motion + GSAP |
| Icons | Lucide React |
| ID Generation | Nanoid |
| Testing | Vitest + jsdom |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/androdotdev/cardfoi.git
cd cardfoi
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

See `.env.example` for all required variables.

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
npm run test          # run Vitest (unit tests)
npm run db:generate   # generate Drizzle migration files
npm run db:push       # push schema directly to DB
npm run db:studio     # open Drizzle Studio (DB GUI)
npm run db:seed       # seed the database
```

---

## Project Structure

```
cardfoi/
├── app/                   # Next.js App Router — pages, layouts, API routes
├── components/
│   ├── dashboard/         # Dashboard shell, sidebar, tiles (Identity, Theme, Projects, etc.)
│   ├── landing/           # Landing page nav
│   ├── shared/            # MediaModal, StructuredData
│   └── templates/         # 8 card templates (Minimal, Cover, Sidebar, Terminal, etc.)
├── db/                    # Drizzle schema & DB client
├── drizzle/               # Generated migration files
├── lib/                   # Shared utilities, auth config, stores, Cloudinary helpers
│   ├── hooks/             # React Query hooks + useCardTheme
│   ├── stores/            # Zustand stores (auth, dashboard, theme)
│   └── validation/        # Zod schemas
├── public/                # Static assets, favicon, OG image
├── scripts/               # Seed scripts
├── tests/                 # Vitest test files (per-module)
├── .opencode/             # Agent plans and skills
├── vitest.config.ts
└── .env.example
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