import mongoose, { Schema, models, model } from "mongoose";
import { CATEGORIES, STATUSES } from "./constants";

export { CATEGORIES, CATEGORY_META, STATUSES, STATUS_LABELS } from "./constants";
export type { Category, Status } from "./constants";

const ReportSchema = new Schema({
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  category: { type: String, enum: CATEGORIES, required: true },
  photoUrl: { type: String, default: "" },
  description: { type: String, required: true, maxlength: 1000 },
  status: { type: String, enum: STATUSES, default: "reported" },
  upvotes: { type: Number, default: 0 },
  authorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  authorName: { type: String, default: "Anonyme" },
  honeypot: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

ReportSchema.index({ location: "2dsphere" });

export const Report = models.Report || model("Report", ReportSchema);
