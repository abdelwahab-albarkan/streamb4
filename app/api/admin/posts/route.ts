import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export async function GET() {
  await connectDB();
  const posts = await Post.find({}).lean();
  return NextResponse.json({ success: true, posts });
}

export async function POST(request: Request) {
  console.log("POST /api/admin/posts started");

  let postData: any;
  try {
    postData = await request.json();
    console.log("Body parsed. Keys:", Object.keys(postData));
    console.log("title:", postData.title);
    console.log("slug:",  postData.slug);
    console.log("id:",    postData.id);
    console.log("status:", postData.status);
  } catch (parseErr: any) {
    console.error("POST ERROR — failed to parse request body:", parseErr?.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to parse request body: " + (parseErr?.message ?? String(parseErr)),
        stack: process.env.NODE_ENV !== "production"
          ? parseErr instanceof Error ? parseErr.stack : undefined
          : undefined,
      },
      { status: 400 }
    );
  }

  try {
    // ── Resolve id, title, slug ──────────────────────────────────────────────
    const id    = postData.id?.trim()    || String(Date.now());
    const title = postData.title?.trim() || "Untitled Draft";
    const slug  = postData.slug?.trim()  || `draft-${id}`;
    console.log("Resolved id:", id, "| title:", title, "| slug:", slug);

    // ── Connect to MongoDB ───────────────────────────────────────────────────
    console.log("Connecting to MongoDB…");
    await connectDB();
    console.log("MongoDB connected");

    // ── Build document ───────────────────────────────────────────────────────
    const newPost = {
      ...postData,
      id,
      title,
      slug,
      status: postData.status || "draft",
      views:  0,
      date:   new Date().toISOString().split("T")[0],
    };
    console.log("Creating Post document");

    // ── Save ─────────────────────────────────────────────────────────────────
    console.log("Saving Post to MongoDB…");
    const doc = await new Post(newPost).save();
    console.log("Post saved. _id:", doc._id?.toString(), "| id:", doc.id);

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error("POST /api/admin/posts ERROR:", error?.message ?? error);
    console.error(error instanceof Error ? error.stack : String(error));
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV !== "production"
          ? error instanceof Error ? error.stack : undefined
          : undefined,
      },
      { status: 500 }
    );
  }
}
