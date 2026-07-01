import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "comments.json");

function readComments() {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
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
  const status = url.searchParams.get("status") || "all";

  const comments = readComments();
  const filtered = status === "all" ? comments : comments.filter((c: any) => c.status === status);

  return NextResponse.json({ success: true, comments: filtered });
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const comments = readComments();
    const idx = comments.findIndex((c: any) => c.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    comments[idx].status = status;
    writeComments(comments);

    return NextResponse.json({ success: true, comment: comments[idx] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing comment ID" }, { status: 400 });
    }

    const comments = readComments();
    const filtered = comments.filter((c: any) => c.id !== id);

    if (comments.length === filtered.length) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    writeComments(filtered);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
