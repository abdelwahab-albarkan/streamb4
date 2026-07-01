import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Player } from "@/lib/models/Player";

// Public GET — returns only enabled players, sorted by order
export async function GET() {
  await connectDB();
  const players = await Player.find({}).lean();
  const enabled = players
    .filter((p: any) => p.enabled !== false)
    .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));
  return NextResponse.json(enabled);
}
