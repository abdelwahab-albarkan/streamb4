/**
 * Modernize stub blog articles — STREAMB4
 * Reads content from scripts/articles/*.md and saves to MongoDB.
 * Run: node scripts/modernize-articles.js
 */

const fs   = require("fs");
const path = require("path");

// Load .env.local
const envLines = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8").split("\n");
for (const l of envLines) {
  const i = l.indexOf("=");
  if (i > 0 && !process.env[l.slice(0, i).trim()]) process.env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}

const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({ slug: String, content: String, status: String }, { strict: false });
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

// Load articles from scripts/articles/*.md
const articlesDir = path.join(process.cwd(), "scripts", "articles");
const ARTICLES = {};
for (const f of fs.readdirSync(articlesDir)) {
  if (!f.endsWith(".md")) continue;
  const slug = f.replace(/\.md$/, "");
  ARTICLES[slug] = fs.readFileSync(path.join(articlesDir, f), "utf-8").trim();
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");

  console.log("Connecting to MongoDB…");
  await mongoose.connect(uri, { bufferCommands: false });
  console.log("Connected.\n");

  const slugs = Object.keys(ARTICLES);
  console.log("Articles to process: " + slugs.length);

  let updated = 0;
  const report = [];

  for (const slug of slugs) {
    const content = ARTICLES[slug];
    const existing = await Post.findOne({ slug }).select("slug content").lean();
    if (!existing) {
      console.log("NOT FOUND: " + slug);
      continue;
    }

    const oldWords = (existing.content || "").split(/\s+/).filter(Boolean).length;
    const newWords = content.split(/\s+/).filter(Boolean).length;

    await Post.updateOne({ slug }, { $set: { content } });
    console.log("OK " + slug);
    console.log("   " + oldWords + " words -> " + newWords + " words (+" + (newWords - oldWords) + ")");
    report.push({ slug, oldWords, newWords });
    updated++;
  }

  console.log("\n" + "=".repeat(60));
  console.log("MODERNIZATION COMPLETE");
  console.log("=".repeat(60));
  console.log("Articles updated: " + updated);
  let totalOld = 0, totalNew = 0;
  for (const r of report) { totalOld += r.oldWords; totalNew += r.newWords; }
  console.log("Total words before: " + totalOld);
  console.log("Total words after:  " + totalNew);
  console.log("Net new words:      +" + (totalNew - totalOld));

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch(err => { console.error("Fatal:", err.message); process.exit(1); });
