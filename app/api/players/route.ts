import { NextResponse } from "next/server";
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

// Public GET — returns only enabled players, sorted by order
export async function GET() {
  const players = await readPlayers();
  const enabled = players
    .filter((p: any) => p.enabled !== false)
    .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));
  return NextResponse.json(enabled);
}
