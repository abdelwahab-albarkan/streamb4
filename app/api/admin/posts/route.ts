import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET() {
  await connectDB();
  const posts = await Post.find({}).sort({ featured: -1, publishedAt: -1, createdAt: -1 }).lean();
  return NextResponse.json({ success: true, posts });
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let postData: Record<string, unknown>;

  try {
    postData = await request.json();
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }

  try {
    // Use caller-supplied id (from client persistPost) or generate one
    const id    = (typeof postData.id    === "string" ? postData.id.trim()    : "") || String(Date.now());
    const title = (typeof postData.title === "string" ? postData.title.trim() : "") || "Untitled Draft";
    const slug  = (typeof postData.slug  === "string" ? postData.slug.trim()  : "") || `draft-${id}`;

    await connectDB();

    // ── Build a document containing ONLY known Post schema fields ─────────────
    // Spreading the raw client payload caused "Cannot read properties of
    // undefined (reading 'options')" because the client sends extra fields
    // (ogImage, canonicalUrl, noIndex, isFeatured, isSticky, scheduledAt, …)
    // that are not in the schema.  In Mongoose 8 those unknown keys trigger
    // getEmbeddedDiscriminatorPath(), which then calls doc.schema.options —
    // but doc.schema was shadowed to a plain {} by the schema-field named
    // "schema" (now renamed to "schemaMarkup").  Even after that rename,
    // explicitly picking known fields is the correct defence.
    const isFeaturedVal = typeof postData.isFeatured === "boolean"
      ? postData.isFeatured
      : (typeof postData.featured === "boolean" ? postData.featured : false);
    const nowIso = new Date().toISOString();
    const newPost = {
      id,
      title,
      slug,
      status:              typeof postData.status              === "string" ? postData.status              : "draft",
      content:             typeof postData.content             === "string" ? postData.content             : "",
      excerpt:             typeof postData.excerpt             === "string" ? postData.excerpt             : "",
      seoTitle:            typeof postData.seoTitle            === "string" ? postData.seoTitle            : "",
      metaDescription:     typeof postData.metaDescription     === "string" ? postData.metaDescription     : "",
      focusKeyword:        typeof postData.focusKeyword        === "string" ? postData.focusKeyword        : "",
      secondaryKeywords:   Array.isArray(postData.secondaryKeywords)        ? postData.secondaryKeywords   : [],
      lsiKeywords:         Array.isArray(postData.lsiKeywords)              ? postData.lsiKeywords         : [],
      featuredImage:       typeof postData.featuredImage       === "string" ? postData.featuredImage       : "",
      ogTitle:             typeof postData.ogTitle             === "string" ? postData.ogTitle             : "",
      ogDescription:       typeof postData.ogDescription       === "string" ? postData.ogDescription       : "",
      faqs:                Array.isArray(postData.faqs)                     ? postData.faqs                : [],
      internalLinks:       Array.isArray(postData.internalLinks)            ? postData.internalLinks       : [],
      schemaMarkup:        postData.schemaMarkup != null                    ? postData.schemaMarkup        : {},
      category:            typeof postData.category            === "string" ? postData.category            : "General",
      tags:                Array.isArray(postData.tags)                     ? postData.tags                : [],
      author:              typeof postData.author              === "string" ? postData.author              : "STREAMB4 Editorial Team",
      seoScore:            typeof postData.seoScore            === "number" ? postData.seoScore            : 0,
      readabilityScore:    typeof postData.readabilityScore    === "number" ? postData.readabilityScore    : 0,
      keywordDensity:      typeof postData.keywordDensity      === "string" ? postData.keywordDensity      : "",
      readingTime:         typeof postData.readingTime         === "number" ? postData.readingTime         : 0,
      views:               0,
      likes:               0,
      publishedAt:         typeof postData.publishedAt         === "string" ? postData.publishedAt         : "",
      createdAt:           typeof postData.createdAt           === "string" && postData.createdAt          ? postData.createdAt          : nowIso,
      updatedAt:           typeof postData.updatedAt           === "string" && postData.updatedAt          ? postData.updatedAt          : nowIso,
      featured:            isFeaturedVal,
      isFeatured:          isFeaturedVal,
      isSticky:            typeof postData.isSticky            === "boolean"                               ? postData.isSticky           : false,
      scheduledAt:         typeof postData.scheduledAt         === "string"                                ? postData.scheduledAt        : "",
    };

    await new Post(newPost).save();

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("POST /api/admin/posts FAILED");
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV !== "production"
          ? error instanceof Error ? error.stack : null
          : null,
      },
      { status: 500 },
    );
  }
}
