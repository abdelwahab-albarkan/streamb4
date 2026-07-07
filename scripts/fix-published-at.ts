/**
 * One-time migration: set publishedAt = createdAt for every published post
 * that has an empty publishedAt field.
 *
 * Run:
 *   npx tsx scripts/fix-published-at.ts
 */

import mongoose from "mongoose";
import path from "path";
import fs from "fs";

// Load .env.local manually (no dotenv dependency needed)
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Minimal schema — only fields we need
const PostSchema = new mongoose.Schema({}, { strict: false, collection: "posts" });
const Post = mongoose.models.Post ?? mongoose.model("Post", PostSchema);

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("✅  Connected to MongoDB");

  // Find all published posts where publishedAt is missing or empty
  const posts = await Post.find({
    status: "published",
    $or: [{ publishedAt: "" }, { publishedAt: { $exists: false } }],
  }).lean() as any[];

  console.log(`Found ${posts.length} published posts with empty publishedAt`);

  let updated = 0;
  for (const post of posts) {
    const stamp = post.createdAt || new Date().toISOString();
    await Post.updateOne(
      { _id: post._id },
      { $set: { publishedAt: stamp } }
    );
    console.log(`  ✓  ${post.title?.slice(0, 60)} → ${stamp}`);
    updated++;
  }

  console.log(`\n✅  Done — updated ${updated} posts`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
