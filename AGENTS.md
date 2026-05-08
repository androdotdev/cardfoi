# AGENTS.md — Cardfoi Compact Agent Memory

Quick reference for AI agents continuing development. Read this FIRST.

---

## Project Overview

**Cardfoi** — Developer portfolio card platform. Users create shareable profile cards at `cardfoi.vercel.app/{slug}`.

**Stack:** Next.js 16 (Turbopack) · TypeScript · Tailwind CSS · DaisyUI · Better Auth · Neon PostgreSQL · Drizzle ORM · Cloudinary · React Query · Nanostores

---

## Recent Critical Changes

### May 6, 2026 — Auth & Dashboard Restructuring

1. **Separate auth pages**: `/login` and `/sign-up` (replacing combined auth in `/dashboard`)
2. **Email verification enabled**: `requireEmailVerification: true` in `lib/auth.ts`
3. **Password reset flow**: "Forgot password?" → email → `/reset-password?token=xxx`
4. **Nanostore auth state**: `lib/stores/authStore.ts` (authMode, signingOut, authMessage)
5. **Bento grid merged tiles**:
   - `ContactSkillsTile.tsx` (Contact + Skills)
   - `SecurityTile.tsx` (Password + DangerZone)
6. **Database cleanup**: Removed all non-admin users via `scripts/clean-db.ts`
7. **Slug system**: Format `name-nanoid` (6-char random), rate-limited once/month

### May 8, 2026 — SEO, Media Proxy, Theme Fixes

1. **Media proxy to hide Cloudinary URLs**:
   - `normalizeCard()` in `lib/cards.ts` returns `/api/media/${work.id}` for image/video types
   - `cloudinaryPublicId` hidden from API responses for media types
   - All 8 templates updated to use `work.url` directly (single source of truth)

2. **SEO infrastructure**:
   - Created `app/robots.ts` — prevents indexing of private pages
   - Created `app/sitemap.ts` — auto-generates sitemap with all public card pages
   - Created `app/not-found.tsx` — custom 404 page with helpful links
   - Updated `app/layout.tsx` — longer title/description, `metadataBase`, OG/Twitter defaults, canonical
   - Enhanced `app/[id]/page.tsx` — per-card OG/Twitter metadata, canonical URLs
   - Created `components/shared/StructuredData.tsx` — JSON-LD Person schema on card pages
   - Created metadata files for private pages (`login`, `sign-up`, `reset-password`)
   - Added `rel="noopener noreferrer"` to all `target="_blank"` links across 9 templates

3. **Card theme applied globally**:
   - Created `lib/hooks/useCardTheme.ts` — applies theme to `<html>` via `useEffect`
   - Updated all 8 templates to use the hook instead of `data-theme` on `<main>`
   - Fixes modal backdrop white flash issue

4. **Dashboard fixes**:
   - Removed duplicate theme toggle button in `BentoTopbar.tsx`
   - Added `initDashboardTheme()` call in `CardDashboard.tsx` (was imported but never called — fixes theme reset on refresh)
   - Slug rate limit errors now caught with try/catch in API route (prevents raw error exposure)
   - Added delete loading state (skeleton + spinner) in `ProjectsTile.tsx`

5. **Landing nav auth state**:
   - `LandingNav.tsx` now checks `authClient.useSession()`
   - Shows "Dashboard" instead of "Sign in" when user is logged in

6. **Public OG image**: `public/og-image.png` (1200×630, ~222KB)

---

## Key Files (Read These First)

| File | Purpose |
|------|---------|
| `app/CardDashboard.tsx` | Main dashboard with bento grid |
| `app/login/page.tsx` | Sign in page |
| `app/sign-up/page.tsx` | Sign up page |
| `app/reset-password/page.tsx` | Password reset (token-based) |
| `lib/auth.ts` | Better Auth config (email verification, Resend) |
| `lib/stores/authStore.ts` | Auth state (nanostores) |
| `lib/stores/dashboardStore.ts` | Dashboard UI state |
| `components/dashboard/AuthSection.tsx` | Shared auth form (login/signup/forgot) |
| `components/dashboard/BentoTopbar.tsx` | Top nav (save, preview, signout) |
| `db/schema.ts` | DB schema (user, cards, works, verification) |

---

## State Management Architecture

**Nanostores** (UI State) — `lib/stores/`:
- `authStore.ts`: `authMode`, `signingOut`, `authMessage`
- `dashboardStore.ts`: `selectedId`, `showPreview`, `message`

**React Query** (Server State) — `lib/hooks/useDashboardQuery.ts`:
- `useCards()`, `useSaveCard()`, `useSaveWork()`, `useDeleteWork()`, `useChangePassword()`

**Usage**: Components import from `@nanostores/react` — no prop drilling.

---

## URL Structure

| URL | Purpose |
|-----|---------|
| `/` | Landing page (Instrument Serif + DM Sans) |
| `/:slug` | Public card view (e.g., `/john-doe-x7k2m3`) |
| `/login` | Sign in |
| `/sign-up` | Create account |
| `/reset-password?token=xxx` | Reset password |
| `/dashboard` | Manage cards (requires auth, redirects to `/login` if not signed in) |

---

## Bento Grid Layout

**Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start`

| Tile | File | Notes |
|------|------|-------|
| Identity | `tiles/IdentityTile.tsx` | Avatar, name, slug editing |
| Contact & Skills | `tiles/ContactSkillsTile.tsx` | Merged from 2 tiles |
| Theme | `tiles/ThemeTile.tsx` | 8 daisyUI themes, circular swatches |
| Bio | `tiles/BioTile.tsx` | Textarea, auto-rows |
| Projects | `tiles/ProjectsTile.tsx` | `lg:col-span-2`, `max-h-[400px]` scroll |
| Security | `tiles/SecurityTile.tsx` | Change password + Delete account |

**Background**: `#f5f5f3` (gray-50 from design system)

---

## Auth Flow

1. **Sign up**: `/sign-up` → Better Auth → verification email via Resend → user clicks link
2. **Sign in**: `/login` → must verify email first → dashboard
3. **Forgot password**: "Forgot password?" → email → `/reset-password?token=xxx` → new password
4. **Sign out**: BentoTopbar button → loading spinner → redirects to `/`

**Resend emails**: Configured in `lib/auth.ts` (`sendVerificationEmail`, `sendResetEmail`)

---

## Critical Gotchas

| Issue | Solution |
|-------|----------|
| `formProvider` (capital F) | Correct import from react-hook-form, not `form.Provider` |
| DaisyUI theme names in `ThemeTile.tsx` | Must match `globals.css` exactly |
| `py-0.5` arbitrary values | May not work in all Tailwind versions → use `py-1` |
| Slug `nanoid` generation | 6-char random suffix, rate-limited once/month |
| Reserved slug words | "api", "dashboard", "www", "admin", "andro" |
| Cloudinary unsigned preset | Exposed to browser (`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`) |
| Better Auth email verification | `requireEmailVerification: true` in `lib/auth.ts` |
| `lib/db.ts` lazy-loads | Allows dotenv to load first (important for scripts) |

---

## Build & Test Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build (MUST pass before committing)
npm run start        # Production server
npm run db:push      # Push schema to Neon
npm run db:studio    # Drizzle Studio (DB GUI)
```

**Build status**: ✅ Passes (last verified May 6, 2026)

---

## Environment Variables

```env
# Better Auth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"

# Resend (email verification + password reset)
RESEND_API_KEY="re_..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="..."

# Database
DATABASE_URL="postgresql://..."
```

---

## For Continuing Agents

1. **Read this file first** — contains essential context
2. **Run `npm run build`** — verify current state before changes
3. **Check `lib/stores/`** — understand nanostores state management
4. **Review `components/dashboard/tiles/`** — bento grid structure
5. **Test auth flow** — sign up → verify email → sign in → dashboard
6. **Preview panel width** — 400px, scale 0.85 (mobile-sized)

**Current mode:** Build mode — you can make file changes directly.

---

*Last updated: May 6, 2026*
