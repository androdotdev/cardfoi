# Cardfoi — Future Roadmap

## Current Sprint (Approved — ready to implement)

### AdminTile fixes
- Move AdminTile to right of SecurityTile in 2-col grid (`CardDashboard.tsx`)
- Fetch all users by default (remove `<2 char` guard) instead of showing "No users found." on mount (`AdminTile.tsx`)

### Layout
- Two-column grid ends unevenly — right column (Theme, Social Links) trails off while left column continues. Consider: add a visual anchor card that fills remaining space, or restructure to fewer full-width sections.
- Admin Panel sits at bottom with no visual separation from Security tile — easy to miss or confuse as part of the same section.

---

## Short-term

### UX
- **Separate admin panel routes**: Move AdminTile to its own protected route at `/dashboard/admin`. Admin user list + delete actions should not be on the same page as regular settings. Requires new page + layout, route guard, and navigation link.
- **Tone down delete buttons**: `Delete My Account` and `Delete User Account` are full-width red — too dominant for destructive actions. Change to secondary/cancel styling (gray border, smaller width, or hidden behind confirmation step).
- **Per-section save feedback**: No save affordance per section — only a global "Save" in the top-right. Risk of navigating away without saving. Consider auto-save on blur, per-section save buttons, or unsaved-changes indicator.
- **Debounce admin search** (300ms) to reduce API calls on keystroke

### UI
- **Section label contrast**: Labels (`IDENTITY`, `PROJECTS`, `BIO`, etc.) are too small and low-contrast — they don't visually anchor sections. Increase font weight/size or add subtle background.
- **BIO textarea size**: Oversized relative to typical content — too much dead whitespace. Reduce default height or use `rows` prop to match content.
- **Helper text spacing**: Contact & Skills inputs have inconsistent vertical rhythm with helper text (`This is for your card only...`, `Comma-separated`). Standardize spacing between label, input, and helper.

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
