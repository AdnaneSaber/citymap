"use client";

import dynamic from "next/dynamic";
import type { ReportData } from "./Map";
import type { Category, Status } from "@/models/Report";

const Map = dynamic(() => import("./Map"), { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center"><p className="text-gray-400">Chargement de la carte…</p></div> });

interface Props {
  reports: ReportData[];
  onMapClick?: (latlng: [number, number]) => void;
  selectedPosition?: [number, number] | null;
  filterCategories?: Category[];
  filterStatus?: Status | "";
}

export default function MapWrapper(props: Props) {
  return <Map {...props} />;
}
