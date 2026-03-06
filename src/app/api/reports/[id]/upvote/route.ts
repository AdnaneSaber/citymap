import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Report } from "@/models/Report";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const report = await Report.findByIdAndUpdate(params.id, { $inc: { upvotes: 1 } }, { new: true });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ upvotes: report.upvotes });
}
