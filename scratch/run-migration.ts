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

import { createHash } from "crypto";
import mongoose from "mongoose";

function sha256(data: string): string {
  return createHash("sha256").update(data).digest('hex');
}

function extractBase64Images(content: string): Array<{
  full: string;
  mime: string;
  payload: string;
}> {
  const results: Array<{ full: string; mime: string; payload: string }> = [];
  const re = /src="(data:(image\/[^;]+);base64,([^"]+))"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    results.push({ full: m[1], mime: m[2], payload: m[3] });
  }
  return results;
}

async function run() {
  console.log("Connecting to MongoDB directly using mongoose.connect...");
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected successfully!");

  const { Post } = await import("../lib/models/Post");
  const { Media } = await import("../lib/models/Media");

  async function migrateBase64Image(payload: string, mime: string, summary: any): Promise<string> {
    const hash = sha256(payload);
    const hashTag = `__hash:${hash}`;

    const existing = await Media.findOne({ altText: hashTag }).select("_id").lean();
    if (existing) {
      summary.imagesReused++;
      return String((existing as any)._id);
    }

    const dataUrl = `data:${mime};base64,${payload}`;
    const buffer = Buffer.from(payload, "base64");
    const ext = mime.split("/")[1] ?? "webp";
    const filename = `migrated-${hash.slice(0, 8)}.${ext}`;

    const doc = await new Media({
      filename,
      url: dataUrl,
      mimeType: mime,
      size: buffer.byteLength,
      altText: hashTag,
    }).save();

    summary.imagesExtracted++;
    return String(doc._id);
  }

  console.log("\n--- STARTING BASE64 MIGRATION (IN-MEMORY FILTERING) ---");
  // Select ONLY _id and title - this is extremely light and loads instantly!
  const postsOverview = await Post.find({}, { _id: 1, title: 1 }).lean();
  console.log(`Fetched overview of ${postsOverview.length} posts successfully.`);

  const summary = {
    postsScanned: postsOverview.length,
    postsUpdated: 0,
    imagesExtracted: 0,
    imagesReused: 0,
    errors: [] as string[],
  };

  let index = 0;
  for (const postOverview of postsOverview) {
    index++;
    try {
      console.log(`\n[${index}/${postsOverview.length}] Fetching full document: "${postOverview.title}"...`);
      const fullPost = await Post.findById(postOverview._id).lean() as any;
      if (!fullPost) {
        console.log(`  -> Post not found in DB!`);
        continue;
      }

      const featuredImage = fullPost.featuredImage ?? "";
      const content = fullPost.content ?? "";
      const hasBase64Image = featuredImage.startsWith("data:image/") || content.includes("data:image/");

      if (!hasBase64Image) {
        console.log(`  -> Skipping: no base64 images found in featuredImage or content.`);
        continue;
      }

      console.log(`  -> Found base64 content/image! Starting migration...`);
      let newContent = content;
      let newFeaturedImage = featuredImage;
      let changed = false;

      // 1. Migrate featuredImage
      if (featuredImage.startsWith("data:image/")) {
        const match = featuredImage.match(/^data:(image\/[^;]+);base64,(.+)$/);
        if (match) {
          const mime = match[1];
          const payload = match[2];
          console.log(`     - Migrating featuredImage (${(payload.length / 1024).toFixed(1)} KB)...`);
          const mediaId = await migrateBase64Image(payload, mime, summary);
          newFeaturedImage = `/api/admin/media/${mediaId}`;
          changed = true;
          console.log(`       Saved in Media as ID: ${mediaId}`);
        }
      }

      // 2. Migrate inline images
      const matches = extractBase64Images(content);
      if (matches.length > 0) {
        console.log(`     - Migrating ${matches.length} inline content images...`);
        for (const { full, mime, payload } of matches) {
          console.log(`       * Migrating inline image (${(payload.length / 1024).toFixed(1)} KB)...`);
          const mediaId = await migrateBase64Image(payload, mime, summary);
          const endpointUrl = `/api/admin/media/${mediaId}`;
          newContent = newContent.replace(`src="${full}"`, `src="${endpointUrl}"`);
          changed = true;
          console.log(`         Replaced with Media ID: ${mediaId}`);
        }
      }

      if (changed) {
        await Post.findByIdAndUpdate(postOverview._id, {
          content: newContent,
          featuredImage: newFeaturedImage
        });
        summary.postsUpdated++;
        console.log(`  [SUCCESS] Saved database updates for post.`);
      }
    } catch (err: any) {
      console.error(`  [ERROR] Failed to process post ${postOverview._id}:`, err);
      summary.errors.push(`Post ${postOverview._id}: ${err.message ?? String(err)}`);
    }
  }

  console.log("\n--- MIGRATION COMPLETE ---");
  console.log(JSON.stringify(summary, null, 2));

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
