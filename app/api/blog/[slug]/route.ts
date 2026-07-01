import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();

  await Post.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } }
  );

  return NextResponse.json({ success: true });
}
