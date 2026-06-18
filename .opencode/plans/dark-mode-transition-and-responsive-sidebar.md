# Workflow: Dark Mode Transition + Responsive Sidebar

## Overview

Two independent UX improvements for the dashboard:

1. **Dark mode toggle** — currently flashes instantly; add smooth CSS transitions
2. **Responsive sidebar** — currently `w-[200px]` fixed regardless of viewport; collapse to hamburger drawer on mobile

---

## Task 1: Smooth Dark Mode Transitions

### Problem

When the user toggles dark mode, `applyTheme()` (in `useThemeStore.ts`) adds/removes `.dark` on `.dashboard-bg`. The CSS attribute selectors immediately flip `color`, `background-color`, `border-color`, and `--tw-ring-color` with `!important`. No transition animates the change because:

1. **`transition` is not inherited** — only `body` has `transition: 0.3s ease`, but dashboard children don't inherit it
2. **`!important` is unnecessary** — attribute selectors `.dashboard-bg.dark [class*="color"]` have specificity 0,3,0, which beats Tailwind v4's generated classes (0,1,0) without `!important`

### Solution

**Files changed:** 1 (`app/globals.css`)

#### Step 1: Add transition rules

After `.dashboard-bg.dark { ... }` block (after line 91), add:

```css
@media (prefers-reduced-motion: no-preference) {
  .dashboard-bg.dark,
  .dashboard-bg.dark * {
    transition: background-color 0.15s ease,
                color 0.15s ease,
                border-color 0.15s ease;
  }
}
```

- Limited to 3 properties (not `all`) to avoid jank on scroll/transform
- `0.15s` is fast enough to feel immediate but slow enough to see the crossfade
- `*` is safe here: dashboard has ~200 elements, and the transition is scoped to `.dashboard-bg.dark`
- `prefers-reduced-motion: no-preference` ensures no motion for accessibility users

#### Step 1b: Prevent preload flash

If the user's default theme is `dark`, the first paint happens before JS hydrates and adds `.dark` to `.dashboard-bg`. Elements render with light colors, then snap to dark once the effect runs. **Fix:** Add a `preload` class that blocks all transitions on initial render:

In `app/globals.css`:
```css
.preload * {
  transition: none !important;
}
```

In `CardDashboard.tsx`, remove the class after first render:
```tsx
useEffect(() => {
  document.body.classList.remove("preload");
}, []);
```

And add `preload` to `<body>` in `app/layout.tsx`:
```tsx
<body className="font-['DM_Sans','sans-serif'] preload">
```

This way, transitions are globally blocked until JS removes the class, preventing any flash.

#### Step 2: Remove `!important` from all dark mode override rules

Remove `!important` from these attribute selector rules (lines 128-162):

| Selector | Current rule |
|---|---|
| `[class*="text-[#0a0a0a]"], [class*="text-[#5c5c5a]"]` | `color: var(...) !important` |
| `[class*="text-[#9a9a97]"]` | `color: var(...) !important` |
| `[class*="bg-[#fafaf8]"]` | `background-color: var(...) !important` |
| `[class*="hover:bg-[#fafaf8]"]:hover` | `background-color: var(...) !important` |
| `[class*="border-[#ebebea]"], [class*="border-[#d4d4d2]"]` | `border-color: var(...) !important` |
| `[class*="border-[#0a0a0a]"]` | `border-color: var(...) !important` |
| `nav button[class*="border-l-[#0a0a0a]"]` | `border-left-color: var(...) !important` |
| `[class*="ring-[#0a0a0a]"]` | `--tw-ring-color: var(...) !important` |

Also remove `!important` from `input`/`textarea`/`select` rules (lines 103-106, 116):

```css
.dashboard-bg.dark input,
.dashboard-bg.dark textarea,
.dashboard-bg.dark select {
  background-color: var(--dash-bg-elevated);
  border-color: var(--dash-border);
  color: var(--dash-text-primary);
}
```

**Why `!important` removal is safe:** 
- Attribute selectors (0,3,0) beat Tailwind's generated classes (0,1,0)
- Element selectors (0,2,0) also beat Tailwind's classes (0,1,0)
- No daisyUI styles apply — `.dashboard-bg` has no `data-theme` attribute

#### Step 3: Handle `--tw-ring-color`

CSS custom properties don't transition by default. The swatch ring's `box-shadow` (which uses `--tw-ring-color`) won't crossfade. Acceptable — it's a 4px circle on 7 swatches; a 0.15s snap is imperceptible.

### Result

Toggle dark mode → all colors, backgrounds, and borders crossfade over 150ms. Feels polished, not jarring.

#### Before/After

| State | Before | After |
|---|---|---|
| Toggle dark | Instant flash | 150ms crossfade |
| CSS specificity | `!important` hack | Clean attribute selectors |
| Motion | Abrupt | Smooth |

---

## Task 2: Responsive Sidebar

### Problem

Dashboard uses a fixed `w-[200px]` sidebar (`Sidebar.tsx`). On viewports narrower than 1024px, the sidebar + content area compete for space, making content cramped and sidebar unreadable.

### Solution

- **Breakpoint:** `lg` (1024px) — matches Tailwind's default `lg`
- **Desktop (≥lg):** Sidebar always visible, same as current layout
- **Mobile (<lg):** Sidebar hidden off-screen, slides in as overlay when toggled

### Files Changed

| File | Change |
|---|---|
| `lib/stores/useDashboardStore.ts` | +5 lines: `mobileSidebarOpen`, `setMobileSidebarOpen`, `toggleMobileSidebar` |
| `components/dashboard/Sidebar.tsx` | +~30 lines: mobile overlay mode with backdrop + transform animation |
| `components/dashboard/DashboardShell.tsx` | +~15 lines: hamburger button in main content header |
| `tests/stores/useDashboardStore.test.ts` | +2 tests |

### Detailed Changes

#### `lib/stores/useDashboardStore.ts`

Add to state interface:
```ts
mobileSidebarOpen: boolean;
setMobileSidebarOpen: (open: boolean) => void;
toggleMobileSidebar: () => void;
```

Add to initial state:
```ts
mobileSidebarOpen: false,
```

Add actions:
```ts
setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
```

Update `clearState` to reset `mobileSidebarOpen: false`.

#### `components/dashboard/Sidebar.tsx`

**Wrap the existing `<aside>` with a mobile backdrop + conditional positioning.**

Mobile backdrop:
```tsx
<div
  className={`fixed inset-0 z-30 bg-black/40 lg:hidden transition-opacity duration-200 ${
    mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
  onClick={() => setMobileSidebarOpen(false)}
/>
```

Sidebar element:
```tsx
<aside
  className={`
    ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    fixed lg:static inset-y-0 left-0 z-40
    w-[200px] flex-shrink-0
    bg-white border-r border-[#ebebea]
    flex flex-col
    transition-transform duration-200 ease-in-out lg:transition-none
  `}
>
  {/* ... existing content, unchanged ... */}
</aside>
```

**On nav item click**, append `setMobileSidebarOpen(false)` to close sidebar:
```tsx
onClick={() => {
  onSectionChange(item.id);
  setMobileSidebarOpen(false);
}}
```

#### `components/dashboard/DashboardShell.tsx`

Import `Menu` from `lucide-react` (already a dependency — used in WorkList, WorkUploadButton, PasswordForm). Import `usePathname` from `next/navigation`.

Add import:
```tsx
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
```

In the component body, add sidebar reset on route change:
```tsx
const pathname = usePathname();

useEffect(() => {
  setMobileSidebarOpen(false);
}, [pathname]);
```

Mobile header inside `<main>`:
```tsx
<main className="flex-1 overflow-y-auto p-6 lg:p-8">
  <div className="max-w-[720px] mx-auto">
    {/* Mobile header with hamburger — visible only below lg */}
    <div className="flex items-center gap-3 mb-6 lg:hidden">
      <button
        onClick={toggleMobileSidebar}
        className="p-2 rounded-lg text-[#9a9a97] hover:text-[#5c5c5a] hover:bg-[#fafaf8] transition-colors"
        type="button"
        aria-label="Open sidebar menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <span className="text-sm font-medium text-[#0a0a0a]">
        Cardfoi
      </span>
    </div>

    {current?.component ?? children}
  </div>
</main>
```

#### `tests/stores/useDashboardStore.test.ts`

Add after existing tests:

```ts
it("setMobileSidebarOpen updates flag", () => {
  useDashboardStore.getState().setMobileSidebarOpen(true);
  expect(useDashboardStore.getState().mobileSidebarOpen).toBe(true);
  useDashboardStore.getState().setMobileSidebarOpen(false);
  expect(useDashboardStore.getState().mobileSidebarOpen).toBe(false);
});

it("toggleMobileSidebar flips flag", () => {
  expect(useDashboardStore.getState().mobileSidebarOpen).toBe(false);
  useDashboardStore.getState().toggleMobileSidebar();
  expect(useDashboardStore.getState().mobileSidebarOpen).toBe(true);
  useDashboardStore.getState().toggleMobileSidebar();
  expect(useDashboardStore.getState().mobileSidebarOpen).toBe(false);
});
```

### UX Flow

1. **Phone (375px–768px):** Full-width content with hamburger icon top-left
2. **Tap hamburger →** sidebar slides in from left (200ms) + semi-transparent backdrop
3. **Tap nav item →** section changes, sidebar slides away
4. **Tap backdrop →** sidebar slides away
5. **Rotate to desktop →** sidebar auto-appears, hamburger hidden, backdrop removed
6. **Rotate back →** sidebar auto-hides, hamburger reappears

### Edge Cases Handled

| Scenario | Behavior |
|---|---|
| Page load on mobile | Sidebar closed, content shows first section |
| Page load on desktop | Sidebar always visible (`lg:translate-x-0` overrides transform) |
| Resize mobile→desktop | CSS media query forces sidebar visible regardless of zustand state |
| Resize desktop→mobile | Sidebar stays visible until user dismisses via backdrop/nav click |
| `prefers-reduced-motion` | `@media (prefers-reduced-motion: no-preference)` guard in CSS disables transitions |

---

## Summary of All Changes

| File | Lines Changed | Task |
|---|---|---|
| `app/globals.css` | ~15 added, ~10 modified | Transition rule + remove `!important` + `preload` class + `prefers-reduced-motion` |
| `app/layout.tsx` | ~1 modified | Add `preload` class to `<body>` |
| `app/CardDashboard.tsx` | ~3 added | Remove `preload` class after first render |
| `lib/stores/useDashboardStore.ts` | ~5 added | `mobileSidebarOpen` state + actions |
| `components/dashboard/Sidebar.tsx` | ~30 modified | Mobile overlay mode |
| `components/dashboard/DashboardShell.tsx` | ~20 added | Hamburger button + route change reset |
| `tests/stores/useDashboardStore.test.ts` | ~12 added | 2 new tests |

**Total: 7 files.**

### Not Affected

- `/:id` card pages — no route restructuring, no `next-themes`, no `ThemeProvider`
- `app/providers.tsx` — unchanged
- Any template component — unchanged
- Any store other than `useDashboardStore` — unchanged
- Package dependencies — no new packages

### Verification

```
npm run build           # Must pass
npm run test            # 18+ tests (previous + 2 new)
```

Then manually:
1. Toggle dark mode → text, bg, borders crossfade over 150ms
2. Resize browser below 1024px → sidebar hidden, hamburger visible
3. Tap hamburger → sidebar slides in with backdrop
4. Tap backdrop → sidebar dismisses
5. Tap nav item on mobile → section changes + sidebar dismisses
6. Resize above 1024px → sidebar auto-shows, hamburger gone
7. Verify `/:id` card page is completely unaffected
