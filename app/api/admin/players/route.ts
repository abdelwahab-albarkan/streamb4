import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/mongodb";
import { Player } from "@/lib/models/Player";

// Admin GET — returns all players (including disabled)
export async function GET() {
  await connectDB();
  const players = await Player.find({}).lean();
  const sorted = [...players].sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));
  return NextResponse.json(sorted);
}

// Admin POST — create new player
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();

    const allPlayers = await Player.find({}).lean();

    const newPlayer = {
      id: `player-${uuidv4()}`,
      name: body.name || "Unnamed Player",
      recommended: body.recommended ?? false,
      featured: body.featured ?? false,
      enabled: body.enabled ?? true,
      downloaderCode: body.downloaderCode || "",
      website: body.website || "",
      apkUrl: body.apkUrl || "",
      logo: body.logo || "",
      version: body.version || "",
      lastUpdated: body.lastUpdated || new Date().toISOString().slice(0, 10),
      platforms: body.platforms || [],
      order: body.order ?? allPlayers.length + 1,
    };

    await new Player(newPlayer).save();

    return NextResponse.json(newPlayer, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }
}
