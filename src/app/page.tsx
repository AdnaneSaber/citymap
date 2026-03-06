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
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur rounded-xl px-4 py-2 shadow-lg">
        <h1 className="text-lg font-bold text-blue-700">🏙️ CityMap</h1>
        <p className="text-[10px] text-gray-500">Signaler un problème à Kenitra</p>
      </div>

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
