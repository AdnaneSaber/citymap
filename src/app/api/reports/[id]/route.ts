import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Report } from "@/models/Report";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const report = await Report.findById(params.id).lean();
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(report);
}
