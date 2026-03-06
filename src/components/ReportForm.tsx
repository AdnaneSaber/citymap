"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { CATEGORIES, CATEGORY_META } from "@/models/constants";
import type { Category } from "@/models/constants";

interface Props {
  position: [number, number];
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ReportForm({ position, onClose, onSubmitted }: Props) {
  const [category, setCategory] = useState<Category>("voirie");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1200 });
    setPhoto(compressed);
    setPhotoPreview(URL.createObjectURL(compressed));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "citymap_unsigned");
    fd.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "questify");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "questify"}/image/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    return data.secure_url || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot trap
    setSubmitting(true);
    try {
      let photoUrl = "";
      if (photo) {
        photoUrl = await uploadToCloudinary(photo);
      }
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: position[0],
          lng: position[1],
          category,
          description,
          photoUrl,
          honeypot,
        }),
      });
      if (res.ok) {
        onSubmitted();
      } else {
        alert("Erreur lors de l'envoi");
      }
    } catch {
      alert("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[1000] max-h-[85vh] overflow-y-auto animate-slide-up">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">📍 Nouveau signalement</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">&times;</button>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Position: {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Honeypot */}
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Category picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map((c) => {
                const meta = CATEGORY_META[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 text-xs transition-all ${
                      category === c ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="mt-0.5 text-[10px] leading-tight text-center">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={1000}
              rows={3}
              placeholder="Décrivez le problème…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optionnel)</label>
            <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="text-sm" />
            {photoPreview && <img src={photoPreview} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Envoi…" : "Envoyer le signalement"}
          </button>
        </form>
      </div>
    </div>
  );
}
