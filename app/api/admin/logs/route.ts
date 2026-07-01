import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PublishLog } from "@/lib/models/PublishLog";

export async function GET() {
  await connectDB();
  const logs = await PublishLog.find({}).sort({ timestamp: -1 }).limit(500).lean();
  return NextResponse.json({ success: true, logs });
}
