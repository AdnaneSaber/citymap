"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CATEGORY_META, STATUS_LABELS } from "@/models/constants";
import type { ReportData } from "@/components/Map";
import MapWrapper from "@/components/MapWrapper";

export default function ReportDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then((r) => r.json())
      .then((d) => { setReport(d); setLoading(false); })
      .catch(() => setLoading(false));

    const key = `upvote_${id}`;
    if (localStorage.getItem(key)) setVoted(true);
  }, [id]);

  const handleUpvote = async () => {
    if (voted) return;
    const res = await fetch(`/api/reports/${id}/upvote`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setReport((r) => r ? { ...r, upvotes: data.upvotes } : r);
      localStorage.setItem(`upvote_${id}`, "1");
      setVoted(true);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><p>Chargement…</p></div>;
  if (!report) return <div className="flex items-center justify-center h-screen"><p>Signalement introuvable</p></div>;

  const meta = CATEGORY_META[report.category] || CATEGORY_META.autre;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-blue-600 text-lg">← Retour</button>
        <h1 className="font-bold text-gray-800">Signalement</h1>
      </header>

      <div className="h-48 w-full">
        <MapWrapper reports={[report]} selectedPosition={null} />
      </div>

      <div className="p-4 space-y-4">
        {report.photoUrl && (
          <img src={report.photoUrl} alt="Photo" className="w-full rounded-xl object-cover max-h-64" />
        )}

        <div className="flex items-center gap-2">
          <span className="text-2xl">{meta.emoji}</span>
          <span className="font-semibold text-lg">{meta.label}</span>
          <span
            className="ml-auto text-xs px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: meta.color }}
          >
            {STATUS_LABELS[report.status]}
          </span>
        </div>

        <p className="text-gray-700">{report.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Par {report.authorName}</span>
          <span>{new Date(report.createdAt).toLocaleDateString("fr-FR")}</span>
        </div>

        <button
          onClick={handleUpvote}
          disabled={voted}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
            voted
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          👍 {voted ? "Déjà voté" : "Soutenir"} ({report.upvotes})
        </button>
      </div>
    </div>
  );
}
