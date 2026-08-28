import { NextResponse } from "next/server";
const disabled = () => NextResponse.json({ error: "Not available" }, { status: 403 });
export const GET = disabled;
export const POST = disabled;
export const PUT = disabled;
export const DELETE = disabled;
export const PATCH = disabled;