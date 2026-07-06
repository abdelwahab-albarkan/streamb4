import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── In-memory rate limiter: 3 submissions per hour per IP ─────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

// Periodically prune expired entries to avoid unbounded map growth
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now >= val.resetAt) rateLimitMap.delete(key);
  }
}, RATE_LIMIT_WINDOW_MS);

// ── POST /api/contact ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Determine client IP
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

  // Rate limit
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { success: false, message: `Too many requests. Please try again in ${Math.ceil((retryAfter ?? 3600) / 60)} minutes.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter ?? 3600) },
      },
    );
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const name    = typeof body.name    === "string" ? body.name.trim()    : "";
  const email   = typeof body.email   === "string" ? body.email.trim()   : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  // Validate required fields
  const missing: string[] = [];
  if (!name)    missing.push("name");
  if (!email)   missing.push("email");
  if (!subject) missing.push("subject");
  if (!message) missing.push("message");

  if (missing.length > 0) {
    return NextResponse.json(
      { success: false, message: `Missing required fields: ${missing.join(", ")}.` },
      { status: 400 },
    );
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // SMTP credentials from environment
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error("[contact] SMTP environment variables are not configured.");
    return NextResponse.json(
      { success: false, message: "Email service is not configured. Please contact us directly." },
      { status: 500 },
    );
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const submittedAt = new Date().toLocaleString("en-GB", {
    timeZone: "UTC",
    dateStyle: "full",
    timeStyle: "long",
  });

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #2a2a2a;">
      <div style="border-bottom: 2px solid #FF6B00; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #FF6B00; font-size: 22px;">New Contact Message — STREAMB4</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; color: #9ca3af; width: 120px; vertical-align: top; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Name</td><td style="padding: 10px 0; color: #ffffff; font-size: 15px;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 10px 0; color: #9ca3af; vertical-align: top; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Email</td><td style="padding: 10px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #FF6B00;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 10px 0; color: #9ca3af; vertical-align: top; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Subject</td><td style="padding: 10px 0; color: #ffffff;">${escapeHtml(subject)}</td></tr>
        <tr><td style="padding: 10px 0; color: #9ca3af; vertical-align: top; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</td><td style="padding: 10px 0; color: #e5e7eb; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</td></tr>
        <tr><td style="padding: 10px 0; color: #9ca3af; vertical-align: top; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Date</td><td style="padding: 10px 0; color: #6b7280; font-size: 13px;">${submittedAt} (UTC)</td></tr>
        <tr><td style="padding: 10px 0; color: #9ca3af; vertical-align: top; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Client IP</td><td style="padding: 10px 0; color: #6b7280; font-size: 13px;">${escapeHtml(ip)}</td></tr>
      </table>
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #2a2a2a; font-size: 11px; color: #4b5563;">
        This message was submitted via the contact form at streamb4.com
      </div>
    </div>
  `;

  const textBody = [
    "New Contact Message — STREAMB4",
    "================================",
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
    "",
    `Date:    ${submittedAt} (UTC)`,
    `IP:      ${ip}`,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"STREAMB4 Contact" <${smtpUser}>`,
      to: smtpUser,
      replyTo: `"${name}" <${email}>`,
      subject: `New Contact Message - STREAMB4 | ${subject}`,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, message: "Your message has been sent successfully." });
  } catch (err: unknown) {
    console.error("[contact] Failed to send email:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send your message. Please try again later." },
      { status: 500 },
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
