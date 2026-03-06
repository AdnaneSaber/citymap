"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useCallback } from "react";
import { CATEGORY_META, STATUS_LABELS } from "@/models/Report";
import type { Category, Status } from "@/models/Report";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const KENITRA: [number, number] = [34.261, -6.5802];

export interface ReportData {
  _id: string;
  location: { type: string; coordinates: [number, number] };
  category: Category;
  photoUrl: string;
  description: string;
  status: Status;
  upvotes: number;
  authorName: string;
  createdAt: string;
}

interface MapProps {
  reports: ReportData[];
  onMapClick?: (latlng: [number, number]) => void;
  selectedPosition?: [number, number] | null;
  filterCategories?: Category[];
  filterStatus?: Status | "";
}

function UserLocation() {
  const map = useMap();
  const [pos, setPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const ll: [number, number] = [p.coords.latitude, p.coords.longitude];
        setPos(ll);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, [map]);

  if (!pos) return null;
  return (
    <CircleMarker center={pos} radius={8} pathOptions={{ color: "#4285f4", fillColor: "#4285f4", fillOpacity: 0.8 }}>
      <Popup>Votre position</Popup>
    </CircleMarker>
  );
}

function ClickHandler({ onClick }: { onClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function Map({ reports, onMapClick, selectedPosition, filterCategories, filterStatus }: MapProps) {
  const filtered = reports.filter((r) => {
    if (filterCategories && filterCategories.length > 0 && !filterCategories.includes(r.category)) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <MapContainer center={KENITRA} zoom={13} className="h-full w-full z-0" zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserLocation />
      {onMapClick && <ClickHandler onClick={onMapClick} />}

      {selectedPosition && <Marker position={selectedPosition} />}

      {filtered.map((r) => {
        const meta = CATEGORY_META[r.category] || CATEGORY_META.autre;
        const pos: [number, number] = [r.location.coordinates[1], r.location.coordinates[0]];
        return (
          <CircleMarker
            key={r._id}
            center={pos}
            radius={10}
            pathOptions={{ color: meta.color, fillColor: meta.color, fillOpacity: 0.7 }}
          >
            <Popup>
              <div className="text-sm max-w-[200px]">
                {r.photoUrl && (
                  <img src={r.photoUrl} alt="" className="w-full h-24 object-cover rounded mb-1" />
                )}
                <p className="font-semibold">{meta.emoji} {meta.label}</p>
                <p className="text-gray-600 text-xs line-clamp-2">{r.description}</p>
                <div className="flex justify-between mt-1 text-xs">
                  <span className="bg-blue-100 text-blue-800 px-1 rounded">{STATUS_LABELS[r.status]}</span>
                  <span>👍 {r.upvotes}</span>
                </div>
                <a href={`/reports/${r._id}`} className="text-blue-600 text-xs underline mt-1 block">Voir détails →</a>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
