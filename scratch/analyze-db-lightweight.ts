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

console.log("MONGODB_URI loaded:", process.env.MONGODB_URI ? "YES" : "NO");

async function run() {
  const { connectDB } = await import("../lib/mongodb");
  const { Post } = await import("../lib/models/Post");
  const { Media } = await import("../lib/models/Media");
  const mongoose = (await import("mongoose")).default;

  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("Connected successfully!");

  console.log("\n--- AGGREGATING POST RECORD SIZES ON SERVER ---");
  
  // Aggregation of only String fields to avoid conversion errors
  const postSizes = await Post.aggregate([
    {
      $project: {
        id: 1,
        title: 1,
        slug: 1,
        status: 1,
        contentLength: { $strLenCP: { $ifNull: [ "$content", "" ] } },
        excerptLength: { $strLenCP: { $ifNull: [ "$excerpt", "" ] } },
        featuredImageLength: { $strLenCP: { $ifNull: [ "$featuredImage", "" ] } }
      }
    },
    {
      $sort: { contentLength: -1 }
    }
  ]);

  console.log(`Total post documents in DB: ${postSizes.length}`);
  
  let totalContentChars = 0;
  let totalImageChars = 0;
  postSizes.forEach(p => {
    totalContentChars += p.contentLength;
    totalImageChars += p.featuredImageLength;
  });

  console.log(`Sum of contentLength for all posts: ${(totalContentChars / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Sum of featuredImageLength for all posts: ${(totalImageChars / 1024 / 1024).toFixed(2)} MB`);

  console.log("\nTop 15 largest posts by content size:");
  postSizes.slice(0, 15).forEach((p, idx) => {
    console.log(`${idx + 1}. Title: "${p.title}"`);
    console.log(`   Slug: /blog/${p.slug} | Status: ${p.status}`);
    console.log(`   Field Sizes:`);
    console.log(`     - content: ${(p.contentLength / 1024).toFixed(2)} KB`);
    console.log(`     - featuredImage: ${(p.featuredImageLength / 1024).toFixed(2)} KB`);
    console.log(`     - excerpt: ${(p.excerptLength / 1024).toFixed(2)} KB`);
  });

  console.log("\n--- AGGREGATING MEDIA RECORD SIZES ON SERVER ---");
  const mediaSizes = await Media.aggregate([
    {
      $project: {
        filename: 1,
        mimeType: 1,
        urlLength: { $strLenCP: { $ifNull: [ "$url", "" ] } },
        size: 1
      }
    },
    {
      $sort: { urlLength: -1 }
    }
  ]);

  console.log(`Total media documents in DB: ${mediaSizes.length}`);
  let totalMediaUrlChars = 0;
  mediaSizes.forEach(m => totalMediaUrlChars += m.urlLength);
  console.log(`Sum of media URL lengths: ${(totalMediaUrlChars / 1024 / 1024).toFixed(2)} MB`);

  console.log("\nTop 10 largest media records by URL/Base64 size:");
  mediaSizes.slice(0, 10).forEach((m, idx) => {
    console.log(`${idx + 1}. Filename: "${m.filename}" | Mime: ${m.mimeType} | Declared size: ${(m.size / 1024).toFixed(2)} KB | Base64 URL String Size: ${(m.urlLength / 1024).toFixed(2)} KB`);
  });

  await mongoose.disconnect();
  console.log("\nDone!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
