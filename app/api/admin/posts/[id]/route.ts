import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

function readPosts() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
}

function writePosts(posts: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing posts:", err);
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = readPosts();
  const post = posts.find((p: any) => p.id === id || p.slug === id);

  if (!post) {
    return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postData = await request.json();
    const posts = readPosts();
    const index = posts.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    // Keep views and original date
    const updatedPost = {
      ...posts[index],
      ...postData,
      id: id,
    };

    posts[index] = updatedPost;
    writePosts(posts);

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const posts = readPosts();
    const filtered = posts.filter((p: any) => p.id !== id);

    if (posts.length === filtered.length) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    writePosts(filtered);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
