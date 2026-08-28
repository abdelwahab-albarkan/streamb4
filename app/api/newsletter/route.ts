import { NextResponse } from "next/server";

// Newsletter subscription — frontend shows success immediately; no DB storage on static site.
export async function POST() {
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ success: true, count: 0 });
}
