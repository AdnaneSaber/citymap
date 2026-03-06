"use client";

import { useState, useEffect, useCallback } from "react";
import MapWrapper from "@/components/MapWrapper";
import ReportForm from "@/components/ReportForm";
import FilterPanel from "@/components/FilterPanel";
import type { ReportData } from "@/components/Map";
import type { Category, Status } from "@/models/constants";

export default function Home() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCats, setFilterCats] = useState<Category[]>([]);
  const [filterStatus, setFilterStatus] = useState<Status | "">("");

  const fetchReports = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterCats.length) params.set("category", filterCats.join(","));
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/reports?${params}`);
    if (res.ok) setReports(await res.json());
  }, [filterCats, filterStatus]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleMapClick = (latlng: [number, number]) => {
    setSelectedPos(latlng);
    setShowForm(true);
  };

  const handleSubmitted = () => {
    setShowForm(false);
    setSelectedPos(null);
    fetchReports();
  };

  return (
    <div className="h-screen w-screen relative">
      <MapWrapper
        reports={reports}
        onMapClick={handleMapClick}
        selectedPosition={selectedPos}
        filterCategories={filterCats}
        filterStatus={filterStatus}
      />
      <FilterPanel
        selectedCategories={filterCats}
        selectedStatus={filterStatus}
        onCategoriesChange={setFilterCats}
        onStatusChange={setFilterStatus}
      />
      {/* Logo/title overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 shadow-lg">
        <h1 className="text-base font-bold text-blue-700">🏙️ CityMap</h1>
        <p className="text-[9px] text-gray-500">Signaler un problème à Kenitra</p>
      </div>

      {/* Locate me button — bottom right on mobile */}
      <button
        onClick={() => {
          if (!navigator.geolocation) return;
          navigator.geolocation.getCurrentPosition(
            (p) => {
              const ll: [number, number] = [p.coords.latitude, p.coords.longitude];
              localStorage.setItem("citymap_user_location", JSON.stringify(ll));
              localStorage.setItem("citymap_location_granted", "true");
              window.dispatchEvent(new CustomEvent("citymap:locate", { detail: ll }));
            },
            () => alert("Impossible d'obtenir votre position"),
            { enableHighAccuracy: true, timeout: 10000 }
          );
        }}
        className="absolute bottom-24 right-3 z-[1000] bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-50 active:bg-gray-100"
        title="Ma position"
      >
        📍
      </button>

      {showForm && selectedPos && (
        <ReportForm
          position={selectedPos}
          onClose={() => { setShowForm(false); setSelectedPos(null); }}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  );
}
