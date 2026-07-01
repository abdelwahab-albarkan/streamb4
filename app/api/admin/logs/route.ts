import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const logsFilePath = path.join(process.cwd(), "data", "logs.json");

function readLogs() {
  try {
    if (!fs.existsSync(logsFilePath)) return [];
    const data = fs.readFileSync(logsFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
}

export async function GET() {
  const logs = readLogs();
  return NextResponse.json({ success: true, logs });
}
