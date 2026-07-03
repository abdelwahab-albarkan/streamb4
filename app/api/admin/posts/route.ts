import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export async function GET() {
  await connectDB();
  const posts = await Post.find({}).lean();
  return NextResponse.json({ success: true, posts });
}

export async function POST(request: Request) {
  try {
    const postData = await request.json();
    await connectDB();

    // Use caller-supplied id (from client persistPost) or generate one
    const id = postData.id?.trim() || String(Date.now());

    // Guarantee required fields pass schema validation
    const title = postData.title?.trim() || "Untitled Draft";
    const slug  = postData.slug?.trim()  || `draft-${id}`;

    const newPost = {
      ...postData,
      id,
      title,
      slug,
      status: postData.status || "draft",
      views:  0,
      date:   new Date().toISOString().split("T")[0],
    };

    await new Post(newPost).save();

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
