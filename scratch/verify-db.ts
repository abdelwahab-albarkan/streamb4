import fs from "fs";
import path from "path";

// Manually parse .env.local and strip trailing carriage returns
const envPath = path.resolve(".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const cleanLine = line.replace(/\r$/, "").trim();
    const match = cleanLine.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      process.env[match[1].trim()] = (match[2] || "").trim();
    }
  });
}

import mongoose from "mongoose";

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected successfully!");

  const { Post } = await import("../lib/models/Post");

  const posts = await Post.find({}).lean() as any[];
  console.log(`Fetched ${posts.length} posts from MongoDB.`);

  let base64Found = 0;
  for (const post of posts) {
    if (post.featuredImage?.startsWith("data:image/")) {
      console.error(`[FAIL] Post "${post.title}" has base64 in featuredImage!`);
      base64Found++;
    }
    if (post.content?.includes("data:image/")) {
      console.error(`[FAIL] Post "${post.title}" has base64 in content!`);
      base64Found++;
    }
  }

  if (base64Found === 0) {
    console.log("[SUCCESS] No base64 image strings remain in any Post document's featuredImage or content in MongoDB!");
  } else {
    console.log(`[FAIL] Found ${base64Found} base64 occurrences in Post documents.`);
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
  
  if (base64Found > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
