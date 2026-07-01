import { NextResponse } from "next/server";
import { sendCommentNotification } from "@/lib/email";
import { connectDB } from "@/lib/mongodb";
import { Comment } from "@/lib/models/Comment";
import { Post } from "@/lib/models/Post";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postSlug = url.searchParams.get("postSlug") || "";

  await connectDB();
  const comments = await Comment.find({ postSlug, status: "approved" }).lean();

  return NextResponse.json({ success: true, comments });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.postSlug || !data.name || !data.content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const newComment = {
      id: String(Date.now()),
      postSlug: data.postSlug,
      author: data.name,
      email: data.email || "",
      content: data.content,
      status: "pending",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      likes: 0,
      avatar: "",
    };

    await new Comment(newComment).save();

    // Find post title for notification
    let postTitle = data.postSlug;
    try {
      const post = await Post.findOne({ slug: data.postSlug }).lean() as any;
      if (post?.title) {
        postTitle = post.title;
      }
    } catch (e) {
      console.error("Error reading post for comment notification:", e);
    }

    try {
      await sendCommentNotification({ ...newComment, name: data.name }, postTitle);
    } catch (err) {
      console.error("Failed to send comment notification email:", err);
    }

    return NextResponse.json({ success: true, comment: { ...newComment, name: data.name } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
