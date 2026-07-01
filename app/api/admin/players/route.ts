import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const FILE = path.join(process.cwd(), "data", "players.json");

async function readPlayers() {
  try {
    const data = await fs.readFile(FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writePlayers(players: any[]) {
  await fs.writeFile(FILE, JSON.stringify(players, null, 2), "utf-8");
}

// Admin GET — returns all players (including disabled)
export async function GET() {
  const players = await readPlayers();
  const sorted = [...players].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return NextResponse.json(sorted);
}

// Admin POST — create new player
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const players = await readPlayers();

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
      order: body.order ?? players.length + 1,
    };

    players.push(newPlayer);
    await writePlayers(players);

    return NextResponse.json(newPlayer, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }
}
