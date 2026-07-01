import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Setting } from "@/lib/models/Setting";

export async function GET() {
  await connectDB();
  const settingDocs = await Setting.find({}).lean();
  const settings: Record<string, any> = {};
  for (const doc of settingDocs) {
    settings[doc.key] = doc.value;
  }
  return NextResponse.json({ success: true, settings });
}

export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    await connectDB();

    for (const [key, value] of Object.entries(newSettings)) {
      await Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    }

    // Return merged settings
    const settingDocs = await Setting.find({}).lean();
    const settings: Record<string, any> = {};
    for (const doc of settingDocs) {
      settings[doc.key] = doc.value;
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
