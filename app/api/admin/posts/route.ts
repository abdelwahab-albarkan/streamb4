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

    const newPost = {
      ...postData,
      id: String(Date.now()),
      views: 0,
      date: new Date().toISOString().split("T")[0],
    };

    await new Post(newPost).save();

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
