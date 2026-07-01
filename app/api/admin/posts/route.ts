import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

function readPosts() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // Create empty file if not exists
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, "[]", "utf8");
      return [];
    }
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading posts:", err);
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

export async function GET() {
  const posts = readPosts();
  return NextResponse.json({ success: true, posts });
}

export async function POST(request: Request) {
  try {
    const postData = await request.json();
    const posts = readPosts();

    const newPost = {
      ...postData,
      id: String(Date.now()),
      views: 0,
      date: new Date().toISOString().split("T")[0],
    };

    posts.unshift(newPost);
    writePosts(posts);

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
