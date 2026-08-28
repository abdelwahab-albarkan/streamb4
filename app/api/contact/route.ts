import { NextResponse } from "next/server";

// Contact form now opens mailto: from the frontend — this endpoint is no longer used.
// Kept as a stub to avoid 404 for any existing bookmarks or automated tests.
export async function POST() {
  return NextResponse.json({ success: true, message: "Please use the contact form on the website." });
}
