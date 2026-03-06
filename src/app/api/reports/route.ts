import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Report } from "@/models/Report";

// Rate limit store (in-memory, per-process)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const bbox = searchParams.get("bbox"); // sw_lng,sw_lat,ne_lng,ne_lat

  const filter: any = {};
  if (category) filter.category = { $in: category.split(",") };
  if (status) filter.status = status;
  if (bbox) {
    const [swLng, swLat, neLng, neLat] = bbox.split(",").map(Number);
    filter.location = {
      $geoWithin: {
        $box: [[swLng, swLat], [neLng, neLat]],
      },
    };
  }

  const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(500).lean();
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Trop de signalements. Réessayez plus tard." }, { status: 429 });
  }

  await connectDB();
  const body = await req.json();
  const { lat, lng, category, description, photoUrl, honeypot } = body;

  // Honeypot check
  if (honeypot) {
    return NextResponse.json({ error: "Spam detected" }, { status: 400 });
  }

  if (!lat || !lng || !category || !description) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const report = await Report.create({
    location: { type: "Point", coordinates: [lng, lat] }, // GeoJSON: [lng, lat]
    category,
    description,
    photoUrl: photoUrl || "",
    authorId: body.authorId || null,
    authorName: body.authorName || "Anonyme",
  });

  return NextResponse.json(report, { status: 201 });
}
