import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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

// PUT — update a player
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const players = await readPlayers();

    const idx = players.findIndex((p: any) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    players[idx] = { ...players[idx], ...body, id };
    await writePlayers(players);

    return NextResponse.json(players[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
  }
}

// DELETE — remove a player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const players = await readPlayers();
    const filtered = players.filter((p: any) => p.id !== id);

    if (filtered.length === players.length) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    await writePlayers(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}
