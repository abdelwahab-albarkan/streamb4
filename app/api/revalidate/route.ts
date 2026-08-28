import { NextResponse } from "next/server";

// ISR revalidation not applicable on static site.
export async function POST() {
  return NextResponse.json({ revalidated: false, message: "Static site — revalidation not applicable." });
}
