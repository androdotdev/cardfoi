# AGENTS.md — Cardfoi Project Context

This file documents the current state of the Cardfoi project for AI agents continuing development work.

## Project Overview

**Cardfoi** is a developer portfolio card platform where users create shareable profile cards with their tech stack, projects, and contact details. Built with Next.js 16 (Turbopack), TypeScript, Tailwind CSS, daisyUI, and Better Auth.

---

## Recent Work Completed

### 1. Form Refactoring (Completed)

**Goal:** Replace manual form handling with react-hook-form + Zod validation

**Dependencies Installed:**
```bash
npm install react-hook-form @hookform/resolvers zod
npm install @nanostores/react nanostores
npm install @tanstack/react-query
```

**Files Created:**
- `lib/validation/dashboardSchemas.ts` — Zod schemas for card, work, password, and auth forms
- `lib/stores/dashboardStore.ts` — Nanostore atoms for UI state
- `lib/hooks/useDashboardQuery.ts` — React Query hooks (useCards, useSaveCard, useSaveWork, useDeleteWork, useChangePassword)
- `lib/hooks/useDashboardState.ts` — Nanostore state management hook
- `lib/queryClient.ts` — React Query client setup

**Files Refactored:**
- `components/dashboard/CardForm.tsx` — Now uses react-hook-form with zodResolver
- `components/dashboard/WorkForm.tsx` — Now uses react-hook-form with zodResolver
- `components/dashboard/PasswordForm.tsx` — Now uses react-hook-form with zodResolver
- `components/dashboard/AuthSection.tsx` — Now uses react-hook-form for signin/signup
- `components/dashboard/ForgotPasswordForm.tsx` — Now uses react-hook-form
- `components/dashboard/DashboardLayout.tsx` — Uses Nanostore for sidebar collapse state
- `app/CardDashboard.tsx` — Rewritten to use useDashboardQuery + useDashboardState

**Files Deleted:**
- `lib/hooks/useCardDashboard.ts` — Replaced by new hooks

---

### 2. Bento Grid Dashboard (Completed)

**Goal:** Transform sidebar + main content layout into a 3-column bento grid with inline editing

**Theme Configuration (`app/globals.css`):**
```css
@plugin "daisyui" {
  themes: corporate --default, night, business, luxury,
          dracula, synthwave, cmyk, emerald;
}
```
(Changed from 18 themes to 8 themes)

**New Files Created:**
- `components/dashboard/BentoTopbar.tsx` — Top navigation with unsaved indicator and save button
- `components/dashboard/tiles/IdentityTile.tsx` — Avatar, name input, slug display
- `components/dashboard/tiles/ContactTile.tsx` — Email + phone inputs
- `components/dashboard/tiles/BioTile.tsx` — Description textarea
- `components/dashboard/tiles/ThemeTile.tsx` — Circular color swatches + template dropdown
- `components/dashboard/tiles/SkillsTile.tsx` — Comma-separated skills input
- `components/dashboard/tiles/ProjectsTile.tsx` — Work list + inline add form
- `components/dashboard/tiles/PasswordTile.tsx` — Separate inline password form

**Files Deleted:**
- `components/dashboard/CardForm.tsx`
- `components/dashboard/WorkForm.tsx`
- `components/dashboard/DashboardLayout.tsx`
- `components/dashboard/DashboardHeader.tsx`
- `components/dashboard/Sidebar.tsx`
- `components/dashboard/CardPreview.tsx`

**Key Features:**
- 3-column bento grid layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Inline editing on all tiles
- `● Unsaved` badge appears when form is dirty
- Save button disabled when clean
- Projects tile has inline "+ Add project" with expandable form
- Theme swatches are circular with ring indicator
- Grayscale Tailwind styling (bg-white, border-gray-100, text-[#0a0a0a])
- Card switching — Shows card selector buttons when multiple cards exist
- Cardfoi logo links to `/`

---

### 3. Landing Page Redesign (Completed)

**Goal:** Replace simple landing page with reference design using Tailwind arbitrary values

**Files Modified:**
- `app/layout.tsx` — Added Google Fonts via `next/font/google`
  - Instrument Serif (for headings)
  - DM Sans (for body text)

**Files Created:**
- `components/landing/CardMockup.tsx` — React component for card visualization with float animation

**File Rewritten:**
- `app/page.tsx` — New landing page (~300 lines)
  - Fixed nav with backdrop-blur
  - Split hero layout (text left, card mockup right)
  - Features bento grid (3 cols, 7 tiles)
  - How it works (3-step grid)
  - CTA section (dark background)
  - Footer with links

**Color Scheme (Tailwind arbitrary values):**
```css
--black: #0a0a0a → text-[#0a0a0a]
--white: #fafaf8 → bg-[#fafaf8]
--gray-50: #f5f5f3 → bg-[#f5f5f3]
--gray-100: #ebebea → border-[#ebebea]
--gray-200: #d4d4d2 → border-[#d4d4d2]
--gray-400: #9a9a97 → text-[#9a9a97]
--gray-600: #5c5c5a → text-[#5c5c5a]
--green: #1a7a52 → bg-[#1a7a52]
--green-light: #e8f5ef → bg-[#e8f5ef]
```

**Animations (added to `app/globals.css`):**
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Current Project Structure

```
app/
├── layout.tsx          # Root layout with Google Fonts
├── globals.css         # Tailwind + daisyUI + animations
├── page.tsx            # Landing page (new design)
├── CardDashboard.tsx   # Bento grid dashboard
├── providers.tsx       # React Query + Better Auth providers
├── api/
│   ├── auth/
│   └── cards/
└── dashboard/
    └── page.tsx        # Redirects to /

components/
├── dashboard/
│   ├── BentoTopbar.tsx
│   ├── AuthSection.tsx    # (refactored with react-hook-form)
│   ├── ForgotPasswordForm.tsx  # (refactored with react-hook-form)
│   ├── tiles/
│   │   ├── IdentityTile.tsx
│   │   ├── ContactTile.tsx
│   │   ├── BioTile.tsx
│   │   ├── ThemeTile.tsx
│   │   ├── SkillsTile.tsx
│   │   ├── ProjectsTile.tsx
│   │   └── PasswordTile.tsx
│   └── types.ts         # TypeScript types
├── landing/
│   └── CardMockup.tsx
└── ...

lib/
├── auth-client.ts
├── cards.ts
├── validation/
│   └── dashboardSchemas.ts
├── stores/
│   └── dashboardStore.ts
├── hooks/
│   ├── useDashboardQuery.ts
│   └── useDashboardState.ts
└── queryClient.ts
```

---

## Key Technical Details

### Form Handling
- All forms use `react-hook-form` with `zodResolver`
- Centralized form in `CardDashboard.tsx` using `useForm` + `FormProvider`
- Dirty state tracked via `formState.isDirty`
- Unsaved changes indicator: `● Unsaved` badge

### State Management
- **React Query**: Server state (cards, mutations)
- **Nanostores**: UI state (selectedId, showForgotPassword, message, loading)
- Stores location: `lib/stores/dashboardStore.ts`

### Styling Approach
- **Dashboard**: daisyUI classes (`bg-base-100`, `border-base-300`) + new grayscale tiles
- **Landing Page**: Tailwind arbitrary values for exact color match
- **Tiles**: Grayscale Tailwind (`bg-white`, `border-gray-100`, etc.)

### Theme System
- 8 daisyUI themes configured in `globals.css`
- Theme swatches in `ThemeTile.tsx` with circular color buttons
- Theme changes apply instantly via `document.documentElement.setAttribute("data-theme", theme)`

---

## Build Status

✅ **Build passes** — `npm run build` completes successfully

**Last build output:**
```
✓ Compiled successfully in ~16s
✓ TypeScript check passed
✓ Static page generation completed
```

---

## Environment Variables Required

```env
# Better Auth
BETTER_AUTH_SECRET=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...

# Database
DATABASE_URL=...
```

---

## Common Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
```

---

## For Future Agents

### Immediate Considerations
1. **Landing page font loading**: Using `next/font/google` — ensure fonts load before rendering
2. **CardMockup component**: Currently uses static data — could be enhanced with real user data
3. **Responsive testing**: Verify bento grid on all breakpoints (mobile, tablet, desktop)
4. **Animation performance**: `fadeUp` and `float` animations use CSS keyframes

### Potential Improvements
1. Add loading skeletons for cards in bento grid
2. Implement toast notifications instead of simple message state
3. Add confirmation dialog for card deletion
4. Enhance ProjectsTile with edit functionality (currently add-only)
5. Add keyboard shortcuts for save (Ctrl+S)
6. Implement auto-save as an option

### Gotchas
- `py-0.5` and similar arbitrary values may not work in all Tailwind versions — use `py-1` or `py-2` if issues arise
- daisyUI theme names in `ThemeTile.tsx` must match exactly what's in `globals.css`
- `formProvider` (capital F) is the correct import from react-hook-form, not `form.Provider`
- Cloudinary upload widget requires `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` to be set

---

## Agent Handoff Notes

When continuing work:
1. Read this file first to understand context
2. Run `npm run build` to verify current state
3. Check `app/globals.css` for theme configuration
4. Review `components/dashboard/tiles/` for bento grid structure
5. Landing page is in `app/page.tsx` with components in `components/landing/`

**Current mode:** Build mode (not plan mode) — you can make file changes directly.

---

*Last updated: May 5, 2026*
