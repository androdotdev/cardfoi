# Cardfoi — Future Roadmap

## ✅ Completed (June 18, 2026)

### Dashboard redesign (sidebar + panel, landing page theme)
- Replaced bento grid with sidebar-navigated layout (`DashboardShell.tsx` + `Sidebar.tsx`)
- New IdentityTile merges Bio + Contact & Skills into one section with two sub-cards
- Deleted `BioTile.tsx`, `ContactSkillsTile.tsx`, `BentoTopbar.tsx`
- ThemeTile now has color swatches + layout style selector (Minimal / Cover / Sidebar / Terminal / Glass / Timeline)
- SecurityTile: delete button wrapped in `danger-zone` bordered container, update password form
- DashboardShell renders one section at a time via `activeSection` state
- AdminTile only visible when user role === "admin"
- Visual theme aligned with landing page (`#fafaf8` bg, `#ebebea` borders, `rounded-full` buttons, `rounded-xl p-7` cards)
- Updated `useDashboardStore` with `activeSection` field
- Added `.dashboard-card` and `.dashboard-label` utility classes to `globals.css`

### AdminTile fixes
- Moved AdminTile to right of SecurityTile in grid (`CardDashboard.tsx`)
- Fetch all users by default (removed `<2 char` guard) — no more "No users found." on mount

---

## Short-term

### UX
- **Separate admin panel routes**: Move AdminTile to its own protected route at `/dashboard/admin`. Admin user list + delete actions should not be on the same page as regular settings. Requires new page + layout, route guard, and navigation link.
- **Debounce admin search** (300ms) to reduce API calls on keystroke

### Performance
- Add `priority` prop to avatar `<Image>` tags (LCP optimization)
- Add `sizes` prop to responsive work images for better srcset selection
- Implement image blur placeholder (blurDataURL) for work images in modals

### DX
- Add pre-commit hooks (husky + lint-staged)
- Add Storybook for component development

### Known Issues
- `TerminalTemplate.tsx` uses `<img>` tags instead of Next.js `<Image>` (no width/height optimization)
- Admin list-users endpoint has no pagination (to be fixed as part of admin route separation)
- No loading skeleton for initial card data fetch on dashboard
- `py-0.5` Tailwind class may not work in all versions

---

## Medium-term

### Features
- **Multi-card support**: Allow users to create multiple cards under one account
- **Custom domains**: Let users point a custom domain to their card
- **Analytics dashboard**: Basic page view tracking per card
- **Export to PDF**: Generate a PDF version of the card

### Architecture
- **E2E tests**: Add Playwright tests for auth flow and card CRUD
- **API rate limiting**: Protect public endpoints with rate limits
- **Edge caching**: Add CDN caching layer for card pages

---

## Long-term

### Platform
- **Team/Org cards**: Multi-user card management with roles
- **API marketplace**: Expose card data via public API with API keys
- **Templates marketplace**: User-created templates as a community library

### Infrastructure
- **i18n**: Full internationalisation support
- **Offline mode**: Service worker + IndexedDB for offline card editing
- **Dark mode toggle persistence**: Already done via zustand persist — build on this for system preference detection
