# Andro Card

Next.js app for session-owned profile cards with Better Auth, Neon PostgreSQL, Drizzle, DaisyUI themes, and Cloudinary uploads.

## Setup

Create `.env.local` from `.env.example` and fill:

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

Cloudinary uploads use an unsigned upload preset from `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

## Commands

```bash
npm install
npm run db:push
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

## Access Control

Public card pages are available at `/:id`.

Creating, editing, settings updates, adding work, and deleting work require a Better Auth session. Users can manage only their own cards. Users with `role = admin` in the Better Auth `user` table can manage all cards.
