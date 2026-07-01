import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const settingsFilePath = path.join(process.cwd(), "data", "settings.json");

function readSettings() {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      return {};
    }
    const data = fs.readFileSync(settingsFilePath, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    return {};
  }
}

function writeSettings(settings: any) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing settings:", err);
  }
}

export async function GET() {
  const settings = readSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    const currentSettings = readSettings();

    const updated = {
      ...currentSettings,
      ...newSettings,
    };

    writeSettings(updated);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
