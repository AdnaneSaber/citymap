export const CATEGORIES = [
  "voirie",
  "eclairage",
  "proprete",
  "espaces_verts",
  "eau",
  "bruit",
  "securite",
  "transport",
  "batiment",
  "autre",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<Category, { emoji: string; color: string; label: string }> = {
  voirie: { emoji: "🛣️", color: "#e74c3c", label: "Voirie" },
  eclairage: { emoji: "💡", color: "#f39c12", label: "Éclairage" },
  proprete: { emoji: "🗑️", color: "#27ae60", label: "Propreté" },
  espaces_verts: { emoji: "🌳", color: "#2ecc71", label: "Espaces verts" },
  eau: { emoji: "💧", color: "#3498db", label: "Eau" },
  bruit: { emoji: "🔊", color: "#9b59b6", label: "Bruit" },
  securite: { emoji: "🚨", color: "#e67e22", label: "Sécurité" },
  transport: { emoji: "🚌", color: "#1abc9c", label: "Transport" },
  batiment: { emoji: "🏢", color: "#95a5a6", label: "Bâtiment" },
  autre: { emoji: "📌", color: "#34495e", label: "Autre" },
};

export const STATUSES = ["reported", "acknowledged", "in_progress", "resolved"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  reported: "Signalé",
  acknowledged: "Pris en compte",
  in_progress: "En cours",
  resolved: "Résolu",
};
