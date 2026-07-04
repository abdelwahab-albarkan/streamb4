import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

// ─── Diagnostic helpers ───────────────────────────────────────────────────────

/** Return a redacted summary of the request body safe to log (no base64). */
function safeBodySummary(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === "string" && v.startsWith("data:")) {
      out[k] = `[base64 ~${Math.round(v.length / 1024)}KB]`;
    } else if (typeof v === "string" && v.length > 500) {
      out[k] = `[string ${v.length} chars]`;
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Safely stringify a value for logging — never throws. */
function safeStr(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET() {
  await connectDB();
  const posts = await Post.find({}).lean();
  return NextResponse.json({ success: true, posts });
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // ── Step 1: announce the request ──────────────────────────────────────────
  console.log("[POST /api/admin/posts] ── handler entered ──");
  console.log("[POST] NODE_ENV:", process.env.NODE_ENV);
  console.log("[POST] MONGODB_URI set:", !!process.env.MONGODB_URI);
  console.log("[POST] Content-Type:", request.headers.get("content-type"));
  console.log("[POST] Content-Length:", request.headers.get("content-length"));

  // ── Step 2: parse body ────────────────────────────────────────────────────
  let postData: Record<string, unknown>;
  try {
    console.log("[POST] Parsing request body…");
    postData = await request.json();
    console.log("[POST] Body parsed OK. Summary:", safeBodySummary(postData));
  } catch (error) {
    console.error("[POST] FAILED at body parse");
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV !== "production"
          ? error instanceof Error ? error.stack : null
          : null,
      },
      { status: 400 },
    );
  }

  // ── Step 3: resolve required fields ───────────────────────────────────────
  let id: string;
  let title: string;
  let slug: string;
  try {
    console.log("[POST] Resolving id / title / slug…");
    id    = (typeof postData.id    === "string" ? postData.id.trim()    : "") || String(Date.now());
    title = (typeof postData.title === "string" ? postData.title.trim() : "") || "Untitled Draft";
    slug  = (typeof postData.slug  === "string" ? postData.slug.trim()  : "") || `draft-${id}`;
    console.log("[POST] id:", id, "| title:", title, "| slug:", slug);
  } catch (error) {
    console.error("[POST] FAILED at field resolution");
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

  // ── Step 4: connect to MongoDB ────────────────────────────────────────────
  try {
    const mongooseLib = await import("mongoose");
    const state = mongooseLib.default.connection.readyState;
    // 0=disconnected 1=connected 2=connecting 3=disconnecting
    console.log("[POST] Mongoose readyState before connectDB:", state);
    console.log("[POST] Connecting to MongoDB…");
    await connectDB();
    const stateAfter = mongooseLib.default.connection.readyState;
    console.log("[POST] Mongoose readyState after connectDB:", stateAfter);
    console.log("[POST] MongoDB host:", mongooseLib.default.connection.host ?? "(unknown)");
  } catch (error) {
    console.error("[POST] FAILED at MongoDB connection");
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

  // ── Step 5: build the document ────────────────────────────────────────────
  let newPost: Record<string, unknown>;
  try {
    console.log("[POST] Building Post document…");
    newPost = {
      ...postData,
      id,
      title,
      slug,
      status: typeof postData.status === "string" ? postData.status : "draft",
      views:  0,
      date:   new Date().toISOString().split("T")[0],
    };
    console.log("[POST] Document fields (no base64):", safeBodySummary(newPost));
  } catch (error) {
    console.error("[POST] FAILED at document construction");
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

  // ── Step 6: instantiate Mongoose model ────────────────────────────────────
  let doc: InstanceType<typeof Post>;
  try {
    console.log("[POST] Instantiating Post model…");
    doc = new Post(newPost);
    // Log what Mongoose actually sees for the required/unique fields
    console.log("[POST] doc.id (schema path):", (doc as any)._doc?.id);
    console.log("[POST] doc._id (ObjectId):", doc._id?.toString());
    console.log("[POST] doc.slug:", (doc as any)._doc?.slug);
    console.log("[POST] doc.title:", (doc as any)._doc?.title);
    console.log("[POST] doc.status:", (doc as any)._doc?.status);
  } catch (error) {
    console.error("[POST] FAILED at model instantiation");
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

  // ── Step 7: validate before save (surfaces schema errors explicitly) ───────
  try {
    console.log("[POST] Running Mongoose validation…");
    await doc.validate();
    console.log("[POST] Validation passed");
  } catch (error) {
    console.error("[POST] FAILED at Mongoose validation");
    console.error("[POST] Validation errors:", safeStr((error as any)?.errors));
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        validationErrors: (error as any)?.errors
          ? Object.fromEntries(
              Object.entries((error as any).errors).map(([k, v]: [string, any]) => [
                k,
                v?.message ?? String(v),
              ]),
            )
          : undefined,
        stack: process.env.NODE_ENV !== "production"
          ? error instanceof Error ? error.stack : null
          : null,
      },
      { status: 422 },
    );
  }

  // ── Step 8: save to MongoDB ────────────────────────────────────────────────
  try {
    console.log("[POST] Saving Post to MongoDB…");
    const saved = await doc.save();
    console.log("[POST] Save succeeded. _id:", saved._id?.toString());
    console.log("[POST] Saved id field:", (saved as any)._doc?.id ?? saved.id);
  } catch (error) {
    console.error("[POST] FAILED at MongoDB save");
    console.error("[POST] Error name:", (error as any)?.name);
    console.error("[POST] Error code:", (error as any)?.code);  // 11000 = duplicate key
    console.error("[POST] Error message:", (error as any)?.message);
    console.error(error instanceof Error ? error.stack : String(error));
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        errorCode: (error as any)?.code,
        stack: process.env.NODE_ENV !== "production"
          ? error instanceof Error ? error.stack : null
          : null,
      },
      { status: 500 },
    );
  }

  // ── Step 9: respond ───────────────────────────────────────────────────────
  console.log("[POST] Sending success response");
  return NextResponse.json({ success: true, post: newPost });
}
