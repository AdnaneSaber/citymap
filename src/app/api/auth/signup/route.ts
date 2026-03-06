import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  return NextResponse.json({ id: user._id, name: user.name, email: user.email }, { status: 201 });
}
