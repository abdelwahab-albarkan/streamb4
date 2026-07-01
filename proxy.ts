import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ─── Rate Limiter ────────────────────────────────────────────────────────────
// Map: key → array of timestamps (ms)
const rateLimitMap = new Map<string, number[]>();

// Periodically prune stale entries to prevent memory leak (every 5 min)
let lastCleanup = Date.now();
function pruneRateLimitMap() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, times] of rateLimitMap.entries()) {
    if (times.every((t) => now - t > 3600000)) {
      rateLimitMap.delete(key);
    }
  }
}

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  pruneRateLimitMap();
  const now = Date.now();
  const windowStart = now - windowMs;
  const prev = rateLimitMap.get(key) ?? [];
  const recent = prev.filter((t) => t > windowStart);
  if (recent.length >= limit) return false;
  recent.push(now);
  rateLimitMap.set(key, recent);
  return true;
}

// ─── JWT Helper ──────────────────────────────────────────────────────────────
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "streamb4_admin_secret_key_change_in_production"
);

async function verifyAdminJWT(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// ─── Proxy (formerly middleware) ─────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  // Resolve client IP (x-forwarded-for is most reliable in Next.js edge)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "127.0.0.1";
  const pathname = request.nextUrl.pathname;

  // ── Rate-limit all API routes ─────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    if (!rateLimit(ip, 60, 60_000)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ── Stricter rate-limit for newsletter subscription ───────────────────────
  if (pathname === "/api/newsletter") {
    if (!rateLimit(`${ip}_newsletter`, 3, 3_600_000)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many subscription attempts" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ── Admin page protection (redirect to login) ─────────────────────────────
  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminPage && !isLoginPage) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token || !(await verifyAdminJWT(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // ── Admin API protection (return 401 for invalid/missing token) ───────────
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isAuthApi =
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/logout";

  if (isAdminApi && !isAuthApi) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token || !(await verifyAdminJWT(token))) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
