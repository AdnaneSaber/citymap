"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORY_META, STATUS_LABELS } from "@/models/Report";
import type { ReportData } from "@/components/Map";

export default function MyReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<ReportData[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/reports")
        .then((r) => r.json())
        .then((all: ReportData[]) => {
          const mine = all.filter((r) => r.authorName === session?.user?.name);
          setReports(mine);
        });
    }
  }, [status, session]);

  if (status === "loading") return <div className="flex items-center justify-center h-screen"><p>Chargement…</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="text-blue-600">← Carte</Link>
        <h1 className="font-bold text-gray-800">Mes signalements</h1>
        <span className="text-sm text-gray-500">{session?.user?.name}</span>
      </header>
      <div className="p-4 space-y-3">
        {reports.length === 0 && <p className="text-gray-500 text-center mt-10">Aucun signalement trouvé</p>}
        {reports.map((r) => {
          const meta = CATEGORY_META[r.category] || CATEGORY_META.autre;
          return (
            <Link href={`/reports/${r._id}`} key={r._id} className="block bg-white rounded-xl shadow p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{meta.emoji}</span>
                <span className="font-semibold text-sm">{meta.label}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: meta.color }}>
                  {STATUS_LABELS[r.status]}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{r.description}</p>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>
                <span>👍 {r.upvotes}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
