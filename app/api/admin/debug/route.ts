import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";
import { User } from "@/lib/models/User";
import { Subscriber } from "@/lib/models/Subscriber";

export const dynamic = "force-dynamic";

export async function GET() {
  const result: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI_set: !!process.env.MONGODB_URI,
      MONGODB_URI_host: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.replace(/\/\/[^@]+@/, "//***:***@")
        : "NOT SET",
      JWT_SECRET_set: !!process.env.JWT_SECRET,
      ADMIN_EMAIL_set: !!process.env.ADMIN_EMAIL,
    },
  };

  try {
    await connectDB();

    const uri = process.env.MONGODB_URI || "";
    const dbNameFromUri = uri.split("/").pop()?.split("?")[0] || "unknown";

    result.connection = {
      readyState: mongoose.connection.readyState,
      readyStateLabel: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] ?? "unknown",
      host: mongoose.connection.host,
      dbName: mongoose.connection.db?.databaseName ?? dbNameFromUri,
    };

    const [postCount, userCount, subscriberCount] = await Promise.all([
      Post.countDocuments({}),
      User.countDocuments({}),
      Subscriber.countDocuments({}),
    ]);

    result.counts = { posts: postCount, users: userCount, subscribers: subscriberCount };

    const samplePosts = await Post.find({}).limit(2).lean();
    result.samplePost = samplePosts[0]
      ? { id: (samplePosts[0] as any).id, title: (samplePosts[0] as any).title, status: (samplePosts[0] as any).status }
      : null;

    const collections = await mongoose.connection.db!.listCollections().toArray();
    result.collections = collections.map((c) => c.name);

    // ── Media diagnostic ──────────────────────────────────────────────────────
    const { Media } = await import('@/lib/models/Media');
    const mediaCount = await Media.countDocuments({});
    const sampleMedia = await Media.findOne({}).select('_id filename mimeType url').lean() as any;
    result.media = {
      count: mediaCount,
      sampleId: sampleMedia?._id?.toString() ?? null,
      sampleFilename: sampleMedia?.filename ?? null,
      sampleMimeType: sampleMedia?.mimeType ?? null,
      sampleUrlPrefix: sampleMedia?.url ? sampleMedia.url.slice(0, 40) : null,
      imageUrlPattern: sampleMedia ? `/api/admin/media/${sampleMedia._id}` : null,
    };

  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    result.stack = err instanceof Error ? err.stack : undefined;
  }

  return NextResponse.json(result, { status: 200 });
}
