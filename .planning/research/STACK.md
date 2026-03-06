# Civic Issue Reporting Map App — 2025 Stack Research

> Target: Morocco, French default, mobile-first, Vercel deployment
> Core: Next.js 14 (App Router) + MongoDB Atlas + Leaflet/OSM + Cloudinary

---

## Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Stable, great Vercel integration, RSC support |
| Database | **MongoDB Atlas** (via Mongoose 9.x) | Geospatial queries (`2dsphere` index) are native — perfect for pin-based apps |
| Maps | **Leaflet + OpenStreetMap** tiles | Free, no API key, excellent Morocco/Africa coverage |
| Image hosting | **Cloudinary** (via next-cloudinary) | Free tier generous, built-in transforms |
| Deployment | **Vercel** | Zero-config for Next.js |
| i18n | **next-intl** | Best App Router i18n; French default + Arabic (Darija) future-proofing |
| Auth | **NextAuth.js v5** (Auth.js) | Or skip auth initially — allow anonymous reporting with optional phone verification |

---

## Key Libraries (with versions)

### Map Integration
| Package | Version | Notes |
|---|---|---|
| `leaflet` | **1.9.4** | Core map engine |
| `react-leaflet` | **5.0.0** | React bindings for Leaflet; requires React 18+ |
| `@types/leaflet` | latest | TypeScript definitions |

⚠️ **Critical**: react-leaflet v5 components must be loaded with `dynamic(() => import(...), { ssr: false })` — Leaflet depends on `window` and will crash SSR.

### Geolocation
| Package | Version | Notes |
|---|---|---|
| Browser **Navigator.geolocation API** | native | No library needed — `navigator.geolocation.getCurrentPosition()` |
| Leaflet's `map.locate()` | built-in | Alternative that integrates directly with the map |

No third-party geolocation library is necessary. The browser API + Leaflet's locate covers all use cases. For reverse geocoding (address from coordinates), use **Nominatim** (free OSM service) via simple fetch — no SDK needed.

### Image Upload & Compression
| Package | Version | Notes |
|---|---|---|
| `browser-image-compression` | **2.0.2** | Client-side compression before upload; reduces 5MB phone photos to ~200KB |
| `next-cloudinary` | **6.17.5** | `CldUploadWidget` for direct browser→Cloudinary upload (no server relay needed) |

Workflow: compress on client → upload to Cloudinary → store URL in MongoDB.

### PWA Support
| Package | Version | Notes |
|---|---|---|
| `@serwist/next` | **9.5.6** | Modern successor to `next-pwa`; active maintenance, App Router compatible |

Serwist handles service worker generation, offline caching, and install prompts. Essential for Morocco where mobile connectivity can be intermittent.

### i18n (Internationalization)
| Package | Version | Notes |
|---|---|---|
| `next-intl` | **4.8.3** | App Router native; supports French default + future Arabic/Amazigh |

### Database / ODM
| Package | Version | Notes |
|---|---|---|
| `mongoose` | **9.2.4** | Schema validation, geospatial indexes, connection pooling |

Use `2dsphere` index on the `location` field for efficient geo-queries (find reports near a point, within a city boundary, etc.).

### UI / Styling
| Package | Notes |
|---|---|
| `tailwindcss` v4 | Utility-first, mobile-first by default |
| `shadcn/ui` | Copy-paste components, no dependency bloat |
| `lucide-react` | Icon set, tree-shakeable |

---

## What to Avoid

| ❌ Don't Use | Why |
|---|---|
| **Google Maps API** | Expensive at scale, requires billing, OSM has better Morocco street data from local mappers |
| **next-pwa** | Abandoned/unmaintained since 2023; use `@serwist/next` instead |
| **Mapbox GL JS** | Free tier is limited (50K loads/mo), requires token, heavier bundle; Leaflet is lighter and sufficient for pin-drop use case |
| **react-map-gl** | Mapbox wrapper — same cost/licensing concerns |
| **Firebase/Firestore** | Over-engineered for this; MongoDB's geo queries are superior for location-based data |
| **Prisma (with MongoDB)** | Prisma's MongoDB support lacks mature geospatial query support; Mongoose is far better here |
| **AWS S3 for images** | Extra infra complexity; Cloudinary gives transforms (thumbnail, WebP) for free |
| **i18next / react-i18next** | Works but requires more boilerplate than `next-intl` with App Router; next-intl is purpose-built |
| **Large component libraries (MUI, Ant Design)** | Bundle size bloat; mobile users in Morocco need fast loads on 3G/4G |
| **Socket.io for real-time** | Unnecessary — this app doesn't need real-time; polling or ISR is sufficient |

---

## Confidence Notes

| Recommendation | Confidence | Rationale |
|---|---|---|
| react-leaflet 5 + Leaflet 1.9 | 🟢 **High** | Proven combo, massive community, well-documented Next.js integration patterns |
| `@serwist/next` for PWA | 🟢 **High** | Active development, clear migration from next-pwa, Vercel-compatible |
| `browser-image-compression` | 🟢 **High** | 2M+ weekly downloads, actively maintained, does exactly one thing well |
| `next-cloudinary` for uploads | 🟢 **High** | Official Cloudinary SDK for Next.js, well-maintained |
| `next-intl` for i18n | 🟢 **High** | De facto standard for App Router i18n in 2025 |
| Mongoose over Prisma (for this project) | 🟢 **High** | Geospatial is a core feature; Mongoose's geo support is mature |
| Native geolocation (no library) | 🟢 **High** | Browser API is sufficient; adding a library adds no value |
| Tailwind + shadcn/ui | 🟡 **Medium-High** | Strong choice but alternatives (Radix directly, Park UI) also work |
| Anonymous reporting (no auth initially) | 🟡 **Medium** | Depends on abuse tolerance; may need rate-limiting or phone OTP later |
| MongoDB Atlas free tier | 🟡 **Medium** | 512MB free tier is fine for MVP; plan upgrade path for production |

---

## Morocco-Specific Considerations

- **Offline support is critical**: intermittent connectivity → PWA with background sync for queued reports
- **French as default UI language**, but plan for Arabic (RTL) — use `next-intl` + Tailwind's `rtl:` variant
- **Mobile-first is non-negotiable**: ~85% of Moroccan internet users are mobile-only
- **Image compression matters**: reduce upload size for users on metered data plans
- **OSM coverage in Morocco**: generally good in cities (Casablanca, Rabat, Marrakech, Fès); community-mapped
- **Consider adding offline map tiles** via `leaflet.offline` plugin for areas with poor connectivity

---

*Research completed: 2026-03-07 | Based on npm registry data and ecosystem analysis*
