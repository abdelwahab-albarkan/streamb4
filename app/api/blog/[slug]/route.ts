import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

function readPosts() {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
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

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = readPosts();
  const idx = posts.findIndex((p: any) => p.slug === slug);

  if (idx !== -1) {
    posts[idx].views = (posts[idx].views || 0) + 1;
    writePosts(posts);
  }

  return NextResponse.json({ success: true });
}
