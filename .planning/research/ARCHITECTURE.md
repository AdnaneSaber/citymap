# Civic Map-Based Reporting App — Architecture Research

## Tech Stack Reference
- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB Atlas
- **Maps:** Leaflet + OpenStreetMap tiles
- **Media:** Cloudinary
- **Deploy:** Vercel
- **Design:** Mobile-first, anonymous reporting allowed

---

## 1. Component Boundaries

### Map Module (`/components/map/`)
- `MapContainer` — Leaflet map initialization, tile layer, viewport state
- `ReportMarker` — individual marker with popup/summary
- `MarkerCluster` — clustered markers at low zoom (react-leaflet-cluster)
- `LocationPicker` — tap-to-place or GPS-based pin for new reports
- **Note:** Leaflet is client-only. Use `dynamic(() => import(...), { ssr: false })` in Next.js.

### Reports Module (`/components/reports/`)
- `ReportForm` — multi-step form: category → location → photo → description → submit
- `ReportCard` — summary card (list view or popup)
- `ReportDetail` — full report view with images, status, comments
- `ReportFilters` — category, date range, status filters
- `ImageUpload` — Cloudinary upload widget or direct upload component

### Auth Module (`/components/auth/`)
- `AuthProvider` — NextAuth.js context (or similar)
- `LoginForm` / `RegisterForm`
- `AnonymousToggle` — opt-in identity; anonymous is default
- Auth is **optional** — reports work without login. Auth unlocks: tracking your reports, receiving updates, admin panel.

### API Layer (`/app/api/`)
- `POST /api/reports` — create report
- `GET /api/reports` — list/filter (supports bbox query for map viewport)
- `GET /api/reports/[id]` — single report
- `PATCH /api/reports/[id]` — update status (admin)
- `POST /api/upload` — signed Cloudinary upload URL generation
- `GET/POST /api/auth/[...nextauth]` — auth routes

### Admin Module (`/app/admin/`)
- Dashboard with report management, status updates, analytics
- Protected by auth middleware

---

## 2. Data Flow

### Report Creation → Storage → Map Display

```
User taps "Report"
  │
  ├─ 1. Browser Geolocation API → get coords (or manual pin on map)
  │
  ├─ 2. User fills form: category, description
  │
  ├─ 3. Photo upload:
  │     User selects image
  │       → POST to Cloudinary (direct unsigned upload OR signed via /api/upload)
  │       → Returns { public_id, secure_url, width, height }
  │
  ├─ 4. Submit report:
  │     POST /api/reports {
  │       location: { type: "Point", coordinates: [lng, lat] },
  │       category: "pothole",
  │       description: "...",
  │       images: [{ publicId, url }],
  │       anonymous: true,
  │       createdBy: userId | null
  │     }
  │       → Server validates, writes to MongoDB
  │       → Returns created report with _id
  │
  └─ 5. Map updates:
        On viewport change or filter change:
          GET /api/reports?bbox=swLng,swLat,neLng,neLat&category=pothole
            → Server runs geo query ($geoWithin or $nearSphere)
            → Returns reports as GeoJSON FeatureCollection
            → Leaflet renders markers
```

### Key Design Decisions
- **Cloudinary upload happens BEFORE form submit** — decouples media from report creation, enables progress UI
- **Map fetches by bounding box** — only loads visible reports, scales well
- **GeoJSON as API response** — Leaflet consumes GeoJSON natively

---

## 3. MongoDB Schema & Geo Considerations

### Report Document

```javascript
{
  _id: ObjectId,
  
  // GeoJSON Point — MUST be this exact structure for 2dsphere index
  location: {
    type: "Point",                    // required literal
    coordinates: [longitude, latitude] // [lng, lat] — NOT [lat, lng]!
  },
  
  category: "pothole" | "graffiti" | "streetlight" | "trash" | ...,
  description: String,
  
  images: [{
    publicId: String,    // Cloudinary public_id for transformations
    url: String          // secure_url
  }],
  
  status: "open" | "in_progress" | "resolved" | "dismissed",
  
  // Auth: nullable for anonymous
  createdBy: ObjectId | null,  // ref → users
  anonymous: Boolean,
  
  // Metadata
  upvotes: Number,
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date | null
}
```

### Indexes

```javascript
// Essential — enables all geo queries
db.reports.createIndex({ location: "2dsphere" })

// Compound for filtered geo queries
db.reports.createIndex({ category: 1, location: "2dsphere" })
db.reports.createIndex({ status: 1, location: "2dsphere" })

// For user's own reports
db.reports.createIndex({ createdBy: 1, createdAt: -1 })
```

### Geo Query Patterns

```javascript
// Bounding box (map viewport) — most common
db.reports.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [swLng, swLat], [neLng, swLat],
          [neLng, neLat], [swLng, neLat],
          [swLng, swLat]  // close the ring
        ]]
      }
    }
  }
})

// Nearby (radius search)
db.reports.find({
  location: {
    $nearSphere: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 1000  // meters
    }
  }
})
```

### ⚠️ Common Pitfall
MongoDB GeoJSON uses **[longitude, latitude]** order. Leaflet uses **[latitude, longitude]** (LatLng). You MUST swap when passing between them.

---

## 4. Geolocation, Image Upload & Markers Interaction

### Geolocation Flow
1. On "New Report", call `navigator.geolocation.getCurrentPosition()`
2. Show user's position on map with draggable pin
3. User can accept GPS location OR drag pin / tap elsewhere
4. Reverse geocode (optional) via Nominatim for display address
5. Store final `[lng, lat]` in report

### Image Upload Flow
1. `<input type="file" accept="image/*" capture="environment">` — triggers camera on mobile
2. Client-side preview + optional compression (browser-image-compression)
3. Upload to Cloudinary:
   - **Option A:** Unsigned upload preset (simpler, fine for public reports)
   - **Option B:** Get signed params from `/api/upload`, then upload (more secure)
4. Store returned `{ publicId, url }` in component state
5. On form submit, include image refs in report payload
6. Display via Cloudinary URL with transformation params for thumbnails: `c_fill,w_400,h_300`

### Marker Rendering
1. API returns reports as array (or GeoJSON FeatureCollection)
2. Map component renders `<Marker>` for each, with category-based icon
3. Use `react-leaflet-cluster` (MarkerClusterGroup) for performance at scale
4. Marker popup shows: category icon, truncated description, thumbnail, status badge
5. Click through to full report detail page

---

## 5. Suggested Build Order

### Phase 1 — Foundation (Days 1–2)
1. **Next.js project setup** — App Router, Tailwind, project structure
2. **MongoDB connection** — connection utility with cached client (important on Vercel serverless)
3. **Report schema/model** — Mongoose or raw driver, with 2dsphere index
4. **Basic API routes** — POST and GET `/api/reports`

### Phase 2 — Map Core (Days 3–4)
5. **Map component** — dynamic import, tile layer, basic markers
6. **Viewport-based fetching** — fetch reports by bounding box on map move
7. **Marker clustering** — handle density

### Phase 3 — Report Creation (Days 5–6)
8. **Geolocation + location picker** — GPS + draggable pin
9. **Report form** — category, description, location
10. **Cloudinary integration** — image upload in form
11. **Form submission** — wire to API

### Phase 4 — Polish & Auth (Days 7–8)
12. **Report detail page** — `/reports/[id]`
13. **Filters** — category, status
14. **Auth (optional)** — NextAuth with anonymous-first design
15. **Admin panel** — status management

### Phase 5 — Production (Days 9–10)
16. **Mobile UX polish** — bottom sheet for reports, touch-friendly controls
17. **Rate limiting** — protect anonymous submission endpoint
18. **Image moderation** — Cloudinary AI moderation or manual queue
19. **Vercel deployment** — env vars, MongoDB Atlas network access, edge config

---

## 6. Vercel + MongoDB Serverless Considerations

- **Cache the MongoDB client** across serverless invocations:
  ```javascript
  // lib/mongodb.ts
  let cached = global._mongoClientPromise;
  if (!cached) {
    const client = new MongoClient(uri);
    cached = global._mongoClientPromise = client.connect();
  }
  export default cached;
  ```
- **Cold starts:** Leaflet dynamic import + serverless cold start = first load can be slow. Use loading skeletons.
- **API route regions:** Set `export const runtime = 'nodejs'` and pick a region close to your MongoDB Atlas cluster.
- **Rate limiting on anonymous endpoints:** Use Vercel KV or upstash/ratelimit to prevent abuse.

---

## 7. Key Libraries

| Purpose | Library |
|---|---|
| Maps | `react-leaflet` + `leaflet` |
| Clustering | `react-leaflet-cluster` |
| DB | `mongodb` (native driver) or `mongoose` |
| Auth | `next-auth` v5 |
| Upload | `cloudinary` (server SDK) + direct browser upload |
| Validation | `zod` |
| Forms | `react-hook-form` |
| Mobile UX | `vaul` (drawer) or custom bottom sheet |
