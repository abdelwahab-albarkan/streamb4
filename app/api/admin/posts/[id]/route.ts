import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";
import { generateSlug, isValidSlug } from "@/lib/slugUtils";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const post = await Post.findOne({ $or: [{ id }, { slug: id }] }).lean();

  if (!post) {
    return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postData = await request.json();
    await connectDB();

    // Build an update payload with only known Post schema fields.
    // Never blank out required fields; keep the existing DB value if the
    // incoming value is empty.
    const update: Record<string, unknown> = {};

    const str = (v: unknown, fallback?: string) =>
      typeof v === "string" && v.trim() ? v.trim() : fallback;

    // Required fields: only set if non-empty (skip to keep existing DB value)
    const t = str(postData.title); if (t) update.title = t;
    // Slug: always validate and repair before writing.
    // Never accept slugs longer than 80 chars or generated from content.
    if (str(postData.slug)) {
      const rawSlug = (postData.slug as string).trim();
      update.slug = isValidSlug(rawSlug)
        ? rawSlug
        : generateSlug(rawSlug || (t ?? ""));
    }

    // Status: always honour the caller's intent
    if (typeof postData.status === "string") update.status = postData.status;

    // Optional string fields
    const optStr: (keyof typeof update)[] = [
      "content", "excerpt", "seoTitle", "metaDescription", "focusKeyword",
      "featuredImage", "ogTitle", "ogDescription", "keywordDensity",
      "author", "category", "scheduledAt", "updatedAt",
      // NOTE: publishedAt is intentionally excluded — handled separately below
    ];
    for (const key of optStr) {
      if (typeof postData[key] === "string") update[key] = postData[key];
    }

    // ── publishedAt — critical for sort order ─────────────────────────────────
    // Rules:
    //  1. Transitioning to published → stamp now ONLY if DB has no publishedAt yet.
    //  2. If the caller sent a non-empty explicit date → respect it (admin override).
    //  3. Anything else (save draft, update draft) → do NOT touch publishedAt.
    //     This preserves the original publish date when a post is drafted then re-published.
    const newStatus     = typeof postData.status === "string" ? postData.status : null;
    const callerDate    = typeof postData.publishedAt === "string" ? postData.publishedAt.trim() : "";

    if (newStatus === "published") {
      if (callerDate) {
        // Admin explicitly supplied a date — use it
        update.publishedAt = callerDate;
      } else {
        // No date supplied: stamp now only if the existing record has none.
        // We do a lightweight projection-only read to avoid over-fetching.
        const existing = await Post.findOne({ id }, { publishedAt: 1 }).lean() as any | null;
        const existingDate: string = existing?.publishedAt ?? "";
        if (!existingDate) {
          update.publishedAt = new Date().toISOString();
        }
        // If existing has a date, leave it alone (no-op — keep original publish date)
      }
    }
    // status !== "published" → publishedAt left untouched in the DB

    // Array fields
    const optArr: (keyof typeof update)[] = [
      "secondaryKeywords", "lsiKeywords", "faqs", "internalLinks", "tags",
    ];
    for (const key of optArr) {
      if (Array.isArray(postData[key])) update[key] = postData[key];
    }

    // Numeric fields
    const optNum: (keyof typeof update)[] = [
      "seoScore", "readabilityScore", "readingTime", "views", "likes",
    ];
    for (const key of optNum) {
      if (typeof postData[key] === "number") update[key] = postData[key];
    }

    // Boolean fields
    const optBool = ["featured", "isFeatured", "isSticky"];
    for (const key of optBool) {
      if (typeof postData[key] === "boolean") update[key] = postData[key];
    }
    // Synchronize featured and isFeatured if one of them is changed
    if (typeof postData.featured === "boolean" && typeof postData.isFeatured !== "boolean") {
      update.isFeatured = postData.featured;
    } else if (typeof postData.isFeatured === "boolean" && typeof postData.featured !== "boolean") {
      update.featured = postData.isFeatured;
    }

    // Mixed field (renamed from "schema" to avoid shadowing doc.schema)
    if (postData.schemaMarkup != null) update.schemaMarkup = postData.schemaMarkup;

    const updatedPost = await Post.findOneAndUpdate(
      { id },
      update,
      { new: true },
    ).lean();

    if (!updatedPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("PUT /api/admin/posts/[id] FAILED:", error?.message);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const deleted = await Post.findOneAndDelete({ id }).lean();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
