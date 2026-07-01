import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

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

    const updatedPost = await Post.findOneAndUpdate(
      { id },
      { ...postData, id },
      { new: true }
    ).lean();

    if (!updatedPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
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
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
