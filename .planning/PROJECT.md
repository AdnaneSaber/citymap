# CityMap — Civic Issue Reporter

## Vision
A map-based web app where citizens of Kenitra (and any Moroccan city) can report urban issues — broken lamps, potholes, graffiti, open manholes, aggressive strays — by dropping a pin on an interactive map. Mobile-first, because people report from the street.

## Core Value
**Citizens can report a problem in their neighborhood in under 30 seconds from their phone, and see what others have reported nearby.**

## Target Users
- **Residents**: Report issues they encounter daily
- **City officials** (future): Track and manage reports
- **Visitors / passersby**: Quick anonymous reports

## Tech Stack
- **Framework**: Next.js 14 (App Router) — consistent with Questify/Qwik
- **Database**: MongoDB Atlas (cluster0.atlnjte.mongodb.net)
- **Map**: Leaflet + OpenStreetMap (free, no API key)
- **Photos**: Cloudinary (cloud_name: questify — shared)
- **Auth**: NextAuth.js (optional accounts, anonymous reporting allowed)
- **i18n**: French default, Arabic and English later
- **Deploy**: Vercel → maps.l3awad.ma

## Report Categories
1. Broken street lamps / non-functional lights
2. Graffiti / unwanted tags
3. Potholes / road surface damage
4. Sidewalk / curb damage
5. Malfunctioning traffic lights
6. Open manholes (pedestrian danger)
7. Aggressive stray dogs (with last sighting)
8. Illegal dumping / trash accumulation
9. Broken public furniture (benches, bins)
10. Flooding / drainage issues

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] Interactive map centered on Kenitra with OpenStreetMap tiles
- [ ] Drop pin to create a report (category, photo, description, GPS)
- [ ] Browse reports as markers on map with category icons/colors
- [ ] Filter reports by category
- [ ] Upvote/confirm reports ("I see this too")
- [ ] Report status lifecycle: Reported → Acknowledged → In Progress → Resolved
- [ ] Anonymous reporting (no account required)
- [ ] Optional user accounts (track your reports)
- [ ] Auto-detect user GPS position
- [ ] Mobile-first responsive UI
- [ ] Photo upload with Cloudinary
- [ ] French as default language

### Out of Scope
- Admin dashboard for city officials (v2)
- Push notifications (v2)
- Arabic / English i18n (v2)
- Report comments / discussion threads (v2)
- Analytics / heatmaps (v2)
- Official city API integration (v2)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Leaflet over Google Maps | Free, no API key, good enough for pin-dropping | Pending |
| Anonymous-first | Lower barrier = more reports | Pending |
| French default | Target city is Kenitra, Morocco | Pending |
| Shared Cloudinary | Already configured for Questify | Pending |
| Next.js 14 | Consistency with existing projects | Pending |

## Constraints
- Server: 3.4GB RAM, can't build locally — Vercel for builds
- MongoDB Atlas shared cluster
- No budget for paid APIs
- Must work well on low-end Android phones (common in Morocco)

---
*Last updated: 2026-03-07 after initialization*
