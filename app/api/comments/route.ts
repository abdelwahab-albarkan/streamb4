import { NextResponse } from "next/server";

// Comments are disabled on the static site.
export async function GET() {
  return NextResponse.json({ success: true, comments: [] });
}

export async function POST() {
  return NextResponse.json({ success: false, error: "Comments are currently disabled." }, { status: 503 });
}
