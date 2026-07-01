import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Comment } from "@/lib/models/Comment";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "all";

  await connectDB();
  const filter = status === "all" ? {} : { status };
  const comments = await Comment.find(filter).lean();

  return NextResponse.json({ success: true, comments });
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    await connectDB();

    const updated = await Comment.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment: updated });
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

    await connectDB();
    const deleted = await Comment.findOneAndDelete({ id }).lean();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
