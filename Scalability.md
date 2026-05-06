# Cardfoi — Scalability Notes

A breakdown of what scales well in the current stack, where the bottlenecks will show up, and what to do about them.

---

## What Already Scales Well

**Neon PostgreSQL (serverless)**
Neon is connection-pool–friendly by design and scales compute up/down automatically. Serverless drivers like `@neondatabase/serverless` are optimized for edge/function environments where connections are short-lived. This is a strong foundation.

**Cloudinary for images**
Offloading images to Cloudinary means your DB and server never touch binary data. Cloudinary handles CDN delivery, transformations, and storage independently — this won't be a bottleneck at any realistic user count.

**Next.js App Router on Vercel**
Static public card pages (`/:id`) can be ISR-cached at the CDN edge. At scale, most reads won't hit your server at all if you add `revalidate` to the page. This is the single highest-leverage optimization you're not currently doing.

**Drizzle ORM**
Lightweight, no runtime overhead, generates clean SQL. No N+1 risk as long as you keep joins explicit. Good choice.

**State Management Architecture**
- **Nanostores** (`lib/stores/`): Lightweight (~1KB) UI state management. No prop drilling — components read directly from stores via `@nanostores/react`.
- **React Query** (`lib/hooks/useDashboardQuery.ts`): Server state with automatic caching and background refetching. Reduces redundant API calls to `/api/cards`.
- Clean separation: UI state doesn't pollute server state and vice versa. Scales well for complex dashboards.

---

## Current Bottlenecks

### 1. No caching on public card pages

`/:id` is the hot path. Every visit currently hits the DB. As soon as you have any traffic, this becomes the first thing that hurts.

**Fix:** Add `export const revalidate = 60` (or `unstable_cache`) to the card page. Cards don't update every second — a 60s stale window is fine for most use cases.

### 2. Cloudinary unsigned preset is public

The `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is exposed to the browser. Any user (or bot) can upload to your Cloudinary account directly without auth. At low usage this is fine; at scale it's a billing and abuse risk.

**Fix:** Move uploads through a signed server-side API route (`/api/upload`) that validates the session before generating a signed upload URL. Remove the unsigned preset entirely.

### 3. No rate limiting on mutations

Card creation, work entry adds, and settings updates have no rate limiting. A single user can hammer these endpoints.

**Fix:** Add rate limiting middleware (Upstash Rate Limit + Redis is the standard Vercel-compatible solution). Protect create/update/delete routes.

### 4. No DB indexing strategy documented

If `/:id` queries by a slug or UUID, that column needs an index. Drizzle schema should explicitly define indexes on any column used in `WHERE` clauses.

**Fix:** Audit `db/` schema files and add `.index()` on `id`, `userId`, and any slug columns.

### 5. No image size/type validation before Cloudinary upload

Without server-side validation, users can upload large files that eat into your Cloudinary free tier.

**Fix:** Validate file size and MIME type in the upload route before passing to Cloudinary.

---

## Scale Tiers

| Users   | What breaks first                                  | Action                              |
| ------- | -------------------------------------------------- | ----------------------------------- |
| 0–1k    | Nothing                                            | Ship it                             |
| 1k–10k  | DB reads on `/:id`                                 | Add ISR / page-level caching        |
| 10k–50k | Cloudinary unsigned preset abuse, no rate limiting | Signed uploads + Upstash rate limit |
| 50k+    | Connection pooling limits on Neon free tier        | Upgrade Neon plan or add PgBouncer  |

---

## Quick Wins (in order of priority)

1. **ISR on `/:id`** — `export const revalidate = 60` in the card page file. 30 min of work, biggest impact.
2. **Signed Cloudinary uploads** — protects against abuse and is cleaner architecture anyway.
3. **Drizzle index audit** — open `db/` schema files and verify indexes exist on lookup columns.
4. **Rate limiting** — Upstash `@upstash/ratelimit` + Redis:
   - Apply to `/api/auth/[...all]` routes to prevent brute force attacks
   - Protect card creation, work entry adds, and settings updates
5. **Error monitoring** — add Sentry before you scale. Blind spots get expensive fast.

---

## What Doesn't Need Changing

- The **auth layer (Better Auth)** is stateless-friendly and won't bottleneck.
- **Drizzle + Neon** is a solid stack for this use case up to mid-scale. No need to swap.
- **DaisyUI themes** are purely client-side CSS — zero server impact.
- **Vercel deployment** handles infra scaling automatically for Next.js apps.

---

> Written for: `androdotdev/cardfoi` @ `main`
> Stack: Next.js 16 · Better Auth · Neon · Drizzle · Cloudinary · DaisyUI
