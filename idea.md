# CityMap — Civic Issue Reporter

A map-based web app where citizens can report urban issues in their city.

## Core Concept
An interactive map where anyone can drop a pin to report problems they see in the street. Each report includes a category, photo, description, and exact GPS location.

## Report Categories
- Broken street lamps / lights not working
- Graffiti / unwanted tags
- Potholes / road damage
- Sidewalk/curb damage
- Malfunctioning traffic lights
- Open manholes (danger to pedestrians, especially blind people)
- Aggressive stray dogs (with last sighting date)
- Illegal dumping / trash
- Broken benches / public furniture
- Flooding / drainage issues

## Key Features
- Interactive map (OpenStreetMap/Leaflet — free, no API key)
- Drop a pin to report an issue with photo + description
- Browse existing reports on the map with category filters
- Upvote/confirm reports ("I see this too")
- Status tracking: Reported → Acknowledged → In Progress → Resolved
- Anonymous reporting (no account required to submit)
- Optional user accounts for tracking your reports
- Mobile-first (people report from the street on their phones)
- Geolocation to auto-detect user's position

## Tech Preferences
- Next.js 14 (App Router) — consistent with other projects
- MongoDB Atlas (same cluster as other projects)
- Leaflet + OpenStreetMap (free)
- Cloudinary for report photos
- Mobile-first responsive design
- French as default language (Moroccan city)
- Deploy on Vercel, domain: maps.l3awad.ma

## Target
City of Kenitra, Morocco (but generic enough for any city)
