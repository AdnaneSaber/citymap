# CityMap — Project State

**Project:** CityMap — Civic Issue Reporter
**Status:** Complete
**Current Phase:** All phases done
**Last activity:** 2026-03-07 — All 4 phases implemented

## Phase Status

| # | Phase | Status |
|---|-------|--------|
| 1 | Foundation & Map | ✅ Done |
| 2 | Report Creation & Display | ✅ Done |
| 3 | Browsing, Upvotes & Auth | ✅ Done |
| 4 | Production Hardening & Deploy | ✅ Done |

## What Was Built

### Phase 1: Foundation & Map
- Next.js 14 with TypeScript, Tailwind, App Router
- Leaflet map centered on Kenitra (34.261, -6.5802) with SSR-safe dynamic import
- GPS user location display
- MongoDB connection with mongoose
- Report model (GeoJSON Point, 2dsphere index, all fields)
- User model (name, email, passwordHash)

### Phase 2: Report Creation & Display
- Tap map → pin drops → slide-up form
- 10 categories with emoji icons and colors
- Photo compression with browser-image-compression → Cloudinary upload
- API: POST /api/reports, GET /api/reports (with bbox support)
- Colored circle markers by category with popups
- Anonymous submission

### Phase 3: Browsing, Upvotes & Auth
- Filter panel: category checkboxes + status dropdown
- Report detail page: /reports/[id] with full info and map snippet
- Upvote with localStorage one-per-device check
- NextAuth.js credentials provider
- Signup/login pages
- /my-reports for logged-in users

### Phase 4: Production Hardening
- PWA with @serwist/next (manifest, service worker, offline page)
- Rate limiting (10 reports/hour per IP)
- Honeypot hidden field
- Meta tags, OG data, favicon
- .env.example
