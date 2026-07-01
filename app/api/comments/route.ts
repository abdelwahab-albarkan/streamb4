import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendCommentNotification } from "@/lib/email";


const dataFilePath = path.join(process.cwd(), "data", "comments.json");

function readComments() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, "[]", "utf8");
      return [];
    }
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
}

function writeComments(comments: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(comments, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing comments:", err);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postSlug = url.searchParams.get("postSlug") || "";

  const comments = readComments();
  const filtered = comments.filter((c: any) => c.postSlug === postSlug && c.status === "approved");

  return NextResponse.json({ success: true, comments: filtered });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.postSlug || !data.name || !data.content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const comments = readComments();
    const newComment = {
      id: String(Date.now()),
      postSlug: data.postSlug,
      name: data.name,
      email: data.email || "",
      content: data.content,
      status: "pending",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      replies: [],
    };

    comments.push(newComment);
    writeComments(comments);

    // Find post title for notification
    let postTitle = data.postSlug;
    try {
      const postsFilePath = path.join(process.cwd(), "data", "posts.json");
      if (fs.existsSync(postsFilePath)) {
        const posts = JSON.parse(fs.readFileSync(postsFilePath, "utf8") || "[]");
        const post = posts.find((p: any) => p.slug === data.postSlug);
        if (post && post.title) {
          postTitle = post.title;
        }
      }
    } catch (e) {
      console.error("Error reading post for comment notification:", e);
    }

    try {
      await sendCommentNotification(newComment, postTitle);
    } catch (err) {
      console.error("Failed to send comment notification email:", err);
    }

    return NextResponse.json({ success: true, comment: newComment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
