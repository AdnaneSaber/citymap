# CityMap — Research Summary

## Stack
- **Next.js 14** App Router, `react-leaflet` 5.0.0 + `leaflet` 1.9.4 (dynamic import, ssr:false)
- **MongoDB Atlas** with `mongoose` 9.2.4, GeoJSON Points, 2dsphere indexes
- **Cloudinary** direct browser upload via `next-cloudinary` 6.17.5 (never proxy through serverless)
- **browser-image-compression** 2.0.2 for client-side photo compression (critical for 3G Morocco)
- **next-intl** 4.8.3 for French default i18n
- **@serwist/next** 9.5.6 for PWA (replaces abandoned next-pwa)
- Native `navigator.geolocation` — no library needed

## Table Stakes
1. Photo → GPS pin → Category → Submit (under 60 seconds)
2. Public map with report markers + category filtering
3. Status lifecycle: Reported → Acknowledged → In Progress → Resolved
4. Anonymous/no-account submission
5. Mobile-first responsive
6. Auto-detect GPS position

## Key Differentiator
**Upvote/"me too" button** — turns individual complaints into community prioritization data. SeeClickFix's killer feature.

## Critical Pitfalls
1. **Leaflet SSR crash** — must use `dynamic()` with `ssr: false` from day one
2. **Coordinate order** — MongoDB GeoJSON is `[lng, lat]`, Leaflet is `[lat, lng]` — swap wrong = markers in ocean
3. **Marker clustering** — 1000+ markers on mobile kills performance; use `react-leaflet-markercluster`
4. **Anonymous spam** — rate limiting + honeypot fields minimum at launch
5. **3G photo upload** — compress client-side, direct to Cloudinary, show progress bar
6. **Cold start problem** — if government doesn't respond, citizens abandon

## Build Order
1. Foundation: Next.js scaffold, MongoDB models, Leaflet map component
2. Core loop: Report creation (pin + photo + category + submit), display on map
3. Engagement: Upvotes, filtering, status tracking
4. Auth: Optional accounts (additive, not foundational)
5. Production: PWA, rate limiting, compression, deploy
