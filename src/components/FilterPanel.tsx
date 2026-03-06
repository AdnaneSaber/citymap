"use client";

import { useState } from "react";
import { CATEGORIES, CATEGORY_META, STATUSES, STATUS_LABELS } from "@/models/constants";
import type { Category, Status } from "@/models/constants";

interface Props {
  selectedCategories: Category[];
  selectedStatus: Status | "";
  onCategoriesChange: (cats: Category[]) => void;
  onStatusChange: (s: Status | "") => void;
}

export default function FilterPanel({ selectedCategories, selectedStatus, onCategoriesChange, onStatusChange }: Props) {
  const [open, setOpen] = useState(false);

  const toggleCategory = (c: Category) => {
    if (selectedCategories.includes(c)) {
      onCategoriesChange(selectedCategories.filter((x) => x !== c));
    } else {
      onCategoriesChange([...selectedCategories, c]);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white shadow-lg rounded-full p-3 text-lg hover:bg-gray-50"
      >
        🔍
      </button>
      {open && (
        <div className="mt-2 bg-white rounded-xl shadow-xl p-4 w-64 max-h-[70vh] overflow-y-auto">
          <h3 className="font-semibold text-sm mb-2">Filtrer par catégorie</h3>
          <div className="space-y-1 mb-3">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === 0 || selectedCategories.includes(c)}
                  onChange={() => toggleCategory(c)}
                  className="rounded"
                />
                <span>{CATEGORY_META[c].emoji} {CATEGORY_META[c].label}</span>
              </label>
            ))}
          </div>
          <h3 className="font-semibold text-sm mb-2">Statut</h3>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as Status | "")}
            className="w-full border rounded-lg px-2 py-1 text-sm"
          >
            <option value="">Tous</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
