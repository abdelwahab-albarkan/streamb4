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
      const key = match[1].trim();
      let value = (match[2] || "").trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

console.log("MONGODB_URI loaded:", process.env.MONGODB_URI ? "YES (starts with " + process.env.MONGODB_URI.substring(0, 20) + "...)" : "NO");

async function run() {
  // Dynamically import Mongoose models and database connection to avoid ES6 import hoisting
  const { connectDB } = await import("../lib/mongodb");
  const { Post } = await import("../lib/models/Post");
  const { Media } = await import("../lib/models/Media");
  const { Comment } = await import("../lib/models/Comment");
  const { Subscriber } = await import("../lib/models/Subscriber");
  const { PublishVersion } = await import("../lib/models/PublishVersion");
  const mongoose = (await import("mongoose")).default;

  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("Connected successfully!");

  console.log("\n--- ANALYZING POSTS COLLECTION ---");
  const posts = await Post.find({}).lean() as any[];
  console.log(`Total posts: ${posts.length}`);

  let totalPostsSize = 0;
  const postSizes = posts.map(p => {
    const jsonStr = JSON.stringify(p);
    totalPostsSize += jsonStr.length;
    
    // Find large fields
    const fieldSizes: Record<string, number> = {};
    for (const [key, val] of Object.entries(p)) {
      if (val) {
        fieldSizes[key] = JSON.stringify(val).length;
      }
    }

    const sortedFields = Object.entries(fieldSizes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      totalSizeBytes: jsonStr.length,
      largestFields: sortedFields
    };
  });

  console.log(`Total posts serialized JSON size: ${(totalPostsSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Sort posts by size and show top 10 largest posts
  const largestPosts = [...postSizes].sort((a, b) => b.totalSizeBytes - a.totalSizeBytes).slice(0, 10);
  console.log("\nTop 10 largest posts in database:");
  largestPosts.forEach((lp, idx) => {
    console.log(`${idx + 1}. Title: "${lp.title}" | Slug: /blog/${lp.slug} | Status: ${lp.status} | Size: ${(lp.totalSizeBytes / 1024).toFixed(2)} KB`);
    console.log("   Largest fields:");
    lp.largestFields.forEach(([f, s]) => {
      console.log(`     - ${f}: ${(s / 1024).toFixed(2)} KB`);
    });
  });

  console.log("\n--- ANALYZING OTHER COLLECTIONS ---");
  const mediaCount = await Media.countDocuments({});
  const mediaDocs = await Media.find({}).lean() as any[];
  let totalMediaSize = 0;
  mediaDocs.forEach(m => totalMediaSize += JSON.stringify(m).length);
  console.log(`Media collection count: ${mediaCount} | Total Size: ${(totalMediaSize / 1024 / 1024).toFixed(2)} MB`);

  const versionsCount = await PublishVersion.countDocuments({});
  const versionsDocs = await PublishVersion.find({}).lean() as any[];
  let totalVersionsSize = 0;
  versionsDocs.forEach(v => totalVersionsSize += JSON.stringify(v).length);
  console.log(`PublishVersion collection count: ${versionsCount} | Total Size: ${(totalVersionsSize / 1024 / 1024).toFixed(2)} MB`);

  await mongoose.disconnect();
  console.log("\nDone!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
