import fs from "fs";
import path from "path";

// Manually parse .env.local
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
  console.log("1. Connecting to mongoose with URI:", process.env.MONGODB_URI ? "YES" : "NO");
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("2. Connected successfully!");

  console.log("3. Importing Post model...");
  const { Post } = await import("../lib/models/Post");
  console.log("4. Imported Post model successfully!");

  console.log("5. Querying Post collection count...");
  const count = await Post.countDocuments({});
  console.log("6. Count:", count);

  console.log("7. Querying Post list...");
  const posts = await Post.find({}, { _id: 1, title: 1 }).lean();
  console.log("8. Fetched posts. Count:", posts.length);

  await mongoose.disconnect();
  console.log("9. Disconnected!");
}

run().catch(err => {
  console.error("Caught error:", err);
});
