# Civic Issue Reporting Map App — Common Pitfalls & Prevention

> Stack: Next.js 14, MongoDB Atlas, Leaflet/OpenStreetMap, Cloudinary, Vercel, mobile-first, anonymous reporting, Morocco (French default)

---

## 1. Leaflet SSR Crash with Next.js

**The Problem:** Leaflet accesses `window` and `document` on import. Next.js server-renders by default → instant crash.

**Warning Signs:**
- `ReferenceError: window is not defined` during build or SSR
- Map component works in dev but fails on `next build`

**Prevention:**
- Use `next/dynamic` with `{ ssr: false }` for ALL map components
- Never import `leaflet` or `react-leaflet` at top-level in a page/layout
- Wrap in a dedicated `<MapContainer>` client component with `"use client"` directive

```tsx
const Map = dynamic(() => import('@/components/Map'), { ssr: false })
```

**Phase:** Architecture / Sprint 0. Decide this pattern before writing any map code.

---

## 2. Map Performance with Many Markers (1000+)

**The Problem:** Rendering thousands of DOM-based markers tanks performance, especially on low-end Android devices common in Morocco.

**Warning Signs:**
- Map becomes sluggish after ~200-500 markers
- Scrolling/panning causes visible frame drops
- Users on budget phones (Redmi, Samsung A-series) report freezing

**Prevention:**
- Use **marker clustering** from the start (`react-leaflet-markercluster` or Leaflet.markercluster)
- Implement **viewport-based loading**: only fetch issues within current map bounds via MongoDB `$geoWithin`
- Set a hard cap per request (e.g., 200 markers max, paginate)
- Consider `Canvas` renderer instead of default SVG for Leaflet: `L.canvas()` as `preferCanvas: true`
- Debounce `moveend`/`zoomend` events (300-500ms) before fetching new data

**Phase:** Architecture + first map implementation. Retrofitting clustering is painful.

---

## 3. MongoDB Geospatial Query Pitfalls

**The Problem:** Geo queries silently return wrong results or perform full collection scans without proper setup.

**Warning Signs:**
- Slow API responses (>500ms) for map bound queries
- `$near` queries returning errors or empty results
- Reports not appearing in the correct geographic area

**Prevention:**
- Create a `2dsphere` index on your location field **before any data entry**
- Store coordinates as GeoJSON: `{ type: "Point", coordinates: [lng, lat] }` — note: **longitude first**, not lat/lng (the #1 mistake)
- Use `$geoWithin` with `$box` for viewport queries (doesn't require sorting, faster for bound-based fetches)
- Use `$near` only when you need distance-sorted results
- Validate coordinate bounds server-side (Morocco bounding box: lat ~27-36, lng ~-13 to -1)

```js
// Correct GeoJSON format
location: {
  type: "Point",
  coordinates: [-7.5898, 33.5731] // [lng, lat] — Casablanca
}
```

**Phase:** Database schema design (Sprint 0). Changing coordinate order later requires a data migration.

---

## 4. Mobile Geolocation Quirks

**The Problem:** `navigator.geolocation` is unreliable on mobile — GPS cold starts take 10-30s, indoor accuracy is ±100m, and some browsers require HTTPS + explicit permissions.

**Warning Signs:**
- Users report their pin is placed in the wrong location
- Geolocation silently fails or times out on Android WebView
- Location works in dev (desktop) but fails on real phones

**Prevention:**
- Always let users **manually adjust the pin** after auto-locate (drag-to-correct)
- Show accuracy radius on the map so users see when GPS is imprecise
- Set reasonable timeout (10s) and `enableHighAccuracy: true`
- Handle all error cases: permission denied, position unavailable, timeout
- Fallback: let users type an address or tap the map directly
- Test on **real devices over mobile data**, not just localhost

```js
navigator.geolocation.getCurrentPosition(success, error, {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000
})
```

**Phase:** UX design + early prototyping. The "locate me then adjust" flow must be designed upfront.

---

## 5. Image Upload on Slow Connections (3G/Edge)

**The Problem:** Morocco has significant 3G/slow LTE coverage outside major cities. Large photo uploads fail silently, timeout, or leave users staring at a spinner.

**Warning Signs:**
- Upload success rate drops below 90% in analytics
- Users submit reports without photos (even when the issue is visual)
- Cloudinary returns timeout errors in logs

**Prevention:**
- **Compress client-side before upload**: resize to max 1200px, compress to ~200KB using `<canvas>` or a library like `browser-image-compression`
- Show a **progress bar** (use `XMLHttpRequest` or `fetch` with `ReadableStream` for progress)
- Implement **retry with exponential backoff** (1s, 2s, 4s)
- Allow **offline queuing**: save the report locally (IndexedDB) and sync when connection improves
- Use Cloudinary's **unsigned upload preset** for direct client→Cloudinary upload (skip your server as middleman)
- Set Cloudinary upload transformations to auto-optimize: `q_auto,f_auto,w_1200`
- Max file size: 5MB client-side validation before upload

**Phase:** Implementation sprint for the report form. Build the compression pipeline early.

---

## 6. Spam & Abuse with Anonymous Reporting

**The Problem:** No authentication = no accountability. Bots and trolls will flood the system with fake reports, offensive content, or use it to harass specific locations/businesses.

**Warning Signs:**
- Burst of identical or nonsensical reports from same IP
- Reports with offensive text/images
- Targeted harassment of specific addresses
- Database growing suspiciously fast

**Prevention:**
- **Rate limiting**: max 3-5 reports per IP per hour (use Vercel Edge Middleware or `upstash/ratelimit`)
- **Honeypot field** in the form (hidden input that bots fill, humans don't)
- **Turnstile/hCaptcha** (lighter than reCAPTCHA, better privacy) — show only after first submission or on suspicious patterns
- **Device fingerprinting** (lightweight — screen size + timezone + language, not invasive)
- **Content moderation queue**: new reports are "pending" until reviewed (or auto-approved after N reports from same fingerprint were legit)
- **Image moderation**: use Cloudinary's AI moderation add-on or a simple NSFW detection API
- **Report-a-report**: let users flag suspicious reports
- Store IP hash (not raw IP) for abuse correlation without privacy violation

**Phase:** Design phase for moderation workflow; implement rate limiting in Sprint 1. Don't launch without at least rate limiting + honeypot.

---

## 7. Low-End Android Performance

**The Problem:** Budget Android phones (1-2GB RAM, slow CPUs) are extremely common in Morocco. Heavy JS bundles + map rendering = unusable app.

**Warning Signs:**
- Lighthouse performance score <50 on mobile
- JS bundle >300KB gzipped
- Time to Interactive >5s on throttled connection
- Map tiles loading but UI is frozen

**Prevention:**
- **Code-split aggressively**: map component loaded only on map pages (`next/dynamic`)
- Keep total JS bundle under 200KB gzipped for initial load
- Use Next.js **App Router** with Server Components — only ship client JS for interactive parts
- **Lazy load images** in report lists (native `loading="lazy"`)
- Minimize re-renders: memoize map markers, use `React.memo` on list items
- Test with Chrome DevTools **CPU 4x slowdown + Slow 3G** throttling
- Consider a **lite mode**: list view instead of map for very slow devices
- Avoid heavy animation libraries; use CSS transitions

**Phase:** Throughout development. Set performance budgets in Sprint 0 and enforce with Lighthouse CI.

---

## 8. Internationalization & RTL Issues

**The Problem:** Morocco uses French (primary), Arabic (RTL), and Darija. Mixing LTR/RTL text in the same UI breaks layouts. Map controls also need consideration.

**Warning Signs:**
- UI elements overlap or misalign when switching to Arabic
- Map zoom controls appear on wrong side
- User-generated content in Arabic breaks card layouts
- Dates/numbers formatted incorrectly

**Prevention:**
- Use `next-intl` or `next-i18next` from day one — don't hardcode any strings
- Set `dir="rtl"` on `<html>` for Arabic, use CSS logical properties (`margin-inline-start` not `margin-left`)
- Default to French, offer Arabic as secondary
- For Leaflet: map controls position needs to flip for RTL
- Store all user content as-is (don't try to detect language)
- Use ICU message format for pluralization (French/Arabic rules differ)

**Phase:** Architecture (Sprint 0). Adding i18n later is one of the most expensive retrofits.

---

## 9. Vercel Serverless Function Limits

**The Problem:** Vercel free/pro tier has constraints: 10s function timeout (free), 60s (pro), 4.5MB request body, cold starts.

**Warning Signs:**
- API routes timeout on image-heavy requests
- Cold starts cause 2-3s delays on first API call
- Deployment fails due to function size limits

**Prevention:**
- **Upload images directly to Cloudinary** from the client — never proxy through your API route
- Keep API routes lean: no heavy dependencies in serverless functions
- Use **Edge Runtime** for lightweight routes (rate limiting, redirects) — no cold start
- MongoDB connection: use a **cached connection pattern** to avoid reconnecting on every invocation

```js
// lib/mongodb.ts — cached connection for serverless
let cached = global._mongoClientPromise
if (!cached) {
  const client = new MongoClient(uri)
  cached = global._mongoClientPromise = client.connect()
}
export default cached
```

**Phase:** Architecture. Choose the upload flow and connection pattern before building API routes.

---

## 10. Tile Loading & Offline Map Experience

**The Problem:** OpenStreetMap tiles load slowly on poor connections. Users in rural Morocco may have intermittent connectivity.

**Warning Signs:**
- Grey/missing map tiles on slow connections
- Users can't orient themselves on the map
- Excessive tile server requests

**Prevention:**
- Use a **nearby tile CDN** or a tile provider with African edge nodes (consider Mapbox, Stadia, or self-hosted tiles for Morocco region)
- Set appropriate `maxZoom` (18 is fine) and `minZoom` (5-6 for Morocco)
- Set initial map view to user's city, not the whole country (fewer tiles to load)
- Add a **loading state** for the map (skeleton/spinner)
- Consider `leaflet.offline` or service worker caching for frequently-viewed areas
- Default tile size 256px (not 512) for faster initial loads on slow connections

**Phase:** Prototyping / Sprint 1. Test tile loading on throttled connections early.

---

## Summary Matrix

| Pitfall | Severity | Cost to Fix Late | Phase to Address |
|---|---|---|---|
| Leaflet SSR crash | 🔴 Critical | Low | Sprint 0 |
| Marker performance | 🔴 Critical | High | Sprint 0 + Sprint 1 |
| MongoDB geo setup | 🔴 Critical | High (data migration) | Sprint 0 |
| Mobile geolocation | 🟡 High | Medium | UX Design + Sprint 1 |
| Slow upload handling | 🟡 High | Medium | Sprint 1-2 |
| Spam/abuse | 🟡 High | Medium | Design + Sprint 1 |
| Low-end Android perf | 🟡 High | Very High | Continuous |
| i18n/RTL | 🟡 High | Very High | Sprint 0 |
| Vercel limits | 🟠 Medium | Medium | Architecture |
| Tile loading | 🟠 Medium | Low | Sprint 1 |

---

*Generated 2026-03-07 for FixMyCity project research.*
