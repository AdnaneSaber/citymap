# CityMap — v1 Requirements

## Map & Navigation

- [ ] **MAP-01**: User can view an interactive map centered on Kenitra with OpenStreetMap tiles
- [ ] **MAP-02**: User can pan, zoom, and interact with the map on mobile and desktop
- [ ] **MAP-03**: User can see their current GPS position on the map via browser geolocation
- [ ] **MAP-04**: User can see existing reports as colored markers on the map, clustered when zoomed out
- [ ] **MAP-05**: User can tap a marker to see report summary (category, photo thumbnail, status, upvotes)

## Report Creation

- [ ] **RPT-01**: User can drop a pin on the map to start a new report
- [ ] **RPT-02**: User can select a category from the predefined list (10 categories)
- [ ] **RPT-03**: User can take or upload a photo that gets compressed client-side and uploaded to Cloudinary
- [ ] **RPT-04**: User can add an optional text description
- [ ] **RPT-05**: User can submit the report without creating an account (anonymous)
- [ ] **RPT-06**: Report is saved with GeoJSON coordinates, category, photo URL, description, timestamp

## Report Browsing

- [ ] **BRW-01**: User can filter map markers by category
- [ ] **BRW-02**: User can filter reports by status (Reported / Acknowledged / In Progress / Resolved)
- [ ] **BRW-03**: User can view a report detail page with full photo, description, location, status history
- [ ] **BRW-04**: User can upvote a report ("I see this too") — one per device (localStorage)

## Authentication

- [ ] **AUTH-01**: User can optionally create an account with email/password
- [ ] **AUTH-02**: Logged-in user can see a list of their submitted reports
- [ ] **AUTH-03**: Logged-in user gets credited on their reports (instead of "Anonymous")

## Infrastructure

- [ ] **INF-01**: App loads in under 3 seconds on 3G connection
- [ ] **INF-02**: Leaflet map renders client-side only (no SSR crash)
- [ ] **INF-03**: MongoDB uses 2dsphere index for efficient geo queries
- [ ] **INF-04**: Rate limiting on report submission (max 10/hour per IP) and honeypot anti-spam
- [ ] **INF-05**: French as default/only language for v1
- [ ] **INF-06**: PWA installable on mobile with basic offline support
- [ ] **INF-07**: Deployed on Vercel at maps.l3awad.ma

---

## v2 (Deferred)

- Admin dashboard for city officials
- Push notifications on status change
- Arabic + English i18n
- Comment threads on reports
- Analytics / heatmaps
- Duplicate detection / nearby report suggestions
- Before/after photos
- Native mobile app

## Out of Scope

- Government CRM/311 integration — requires city partnership
- Video upload — photos are sufficient, video is heavy on 3G
- Real-time chat — adds moderation burden
- Multi-city support — hardcode Kenitra for now

## Traceability

| REQ | Phase |
|-----|-------|
| *(filled by roadmap)* | |
