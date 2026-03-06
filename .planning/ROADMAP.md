# CityMap — Roadmap

## Phase 1: Foundation & Map
**Goal:** Next.js scaffold with interactive Leaflet map, MongoDB models, and basic report creation.

**Requirements:** MAP-01, MAP-02, MAP-03, RPT-06, INF-02, INF-03, INF-05

**Success Criteria:**
1. User can view a Leaflet map centered on Kenitra that loads without SSR errors
2. User's GPS position is shown on the map
3. MongoDB Report model exists with GeoJSON Point, 2dsphere index, and all fields
4. Next.js project builds and deploys on Vercel

---

## Phase 2: Report Creation & Display
**Goal:** Complete the core loop — user can create a report and see it on the map.

**Requirements:** MAP-04, MAP-05, RPT-01, RPT-02, RPT-03, RPT-04, RPT-05, INF-01

**Success Criteria:**
1. User can drop a pin, pick a category, upload a compressed photo, and submit a report in under 60 seconds
2. Submitted reports appear as categorized markers on the map
3. Tapping a marker shows report summary with photo thumbnail
4. Anonymous submission works (no account required)
5. Photos are compressed client-side and uploaded directly to Cloudinary

---

## Phase 3: Browsing, Upvotes & Auth
**Goal:** Users can filter, upvote, and optionally create accounts.

**Requirements:** BRW-01, BRW-02, BRW-03, BRW-04, AUTH-01, AUTH-02, AUTH-03

**Success Criteria:**
1. User can filter markers by category and status
2. User can view a full report detail page
3. User can upvote a report (one per device via localStorage)
4. User can create an optional account and see their submitted reports
5. Logged-in reports show the user's name instead of "Anonymous"

---

## Phase 4: Production Hardening & Deploy
**Goal:** PWA, anti-spam, performance, and production deployment.

**Requirements:** INF-04, INF-06, INF-07

**Success Criteria:**
1. App is installable as PWA on mobile
2. Rate limiting blocks >10 reports/hour per IP
3. Honeypot field catches bot submissions
4. Marker clustering handles 1000+ reports without lag
5. App deployed at maps.l3awad.ma and working end-to-end

---

## Requirement Traceability

| REQ | Phase | Description |
|-----|-------|-------------|
| MAP-01 | 1 | Interactive map centered on Kenitra |
| MAP-02 | 1 | Pan, zoom, interact on mobile/desktop |
| MAP-03 | 1 | GPS position on map |
| MAP-04 | 2 | Reports as colored markers |
| MAP-05 | 2 | Marker tap shows summary |
| RPT-01 | 2 | Drop pin to start report |
| RPT-02 | 2 | Category selection |
| RPT-03 | 2 | Photo upload with compression |
| RPT-04 | 2 | Optional text description |
| RPT-05 | 2 | Anonymous submission |
| RPT-06 | 1 | Report saved with GeoJSON |
| BRW-01 | 3 | Filter by category |
| BRW-02 | 3 | Filter by status |
| BRW-03 | 3 | Report detail page |
| BRW-04 | 3 | Upvote reports |
| AUTH-01 | 3 | Optional accounts |
| AUTH-02 | 3 | User's reports list |
| AUTH-03 | 3 | Credited reports |
| INF-01 | 2 | <3s load on 3G |
| INF-02 | 1 | Leaflet SSR-safe |
| INF-03 | 1 | 2dsphere index |
| INF-04 | 4 | Rate limiting + honeypot |
| INF-05 | 1 | French default |
| INF-06 | 4 | PWA installable |
| INF-07 | 4 | Deployed at maps.l3awad.ma |
