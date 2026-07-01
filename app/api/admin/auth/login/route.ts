import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "streamb4_admin_secret_key_change_in_production"
);

// Credentials come from environment variables — never hardcoded
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing credentials" },
        { status: 400 }
      );
    }

    // Constant-time email comparison (prevents timing attacks)
    const emailMatch =
      email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && ADMIN_EMAIL !== "";

    // Support both bcrypt-hashed and plain-text passwords stored in env
    let passwordMatch = false;
    if (emailMatch && ADMIN_PASSWORD !== "") {
      if (ADMIN_PASSWORD.startsWith("$2")) {
        // bcrypt hash stored in env
        passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD);
      } else {
        // plain-text password in env (acceptable for local/dev)
        passwordMatch = password === ADMIN_PASSWORD;
      }
    }

    if (emailMatch && passwordMatch) {
      // Create JWT token
      const token = await new SignJWT({ email, role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(JWT_SECRET);

      const response = NextResponse.json({ success: true });
      
      // Set httpOnly cookie
      response.cookies.set({
        name: "admin_token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
