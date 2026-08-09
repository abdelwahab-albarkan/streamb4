/**
 * Fix structural issues in 3 mid-length articles:
 * 1. best-iptv-for-usa-2026     — remove "Executive Summary" heading, add ToC if missing
 * 2. best-iptv-for-canada-2026  — same
 * 3. best-iptv-for-android-tv-2026 — wrong first H2 "Best IPTV for Firestick" -> "Quick Overview"
 * Run: node scripts/fix-structural-issues.js
 */

const fs   = require("fs");
const path = require("path");

const envLines = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8").split("\n");
for (const l of envLines) {
  const i = l.indexOf("=");
  if (i > 0 && !process.env[l.slice(0, i).trim()]) process.env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}

const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({ slug: String, content: String }, { strict: false });
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  console.log("Connected.\n");

  // ── Fix 1 & 2: Executive Summary heading in USA and Canada guides ──────────
  const execSummarySlugs = [
    "best-iptv-for-usa-2026",
    "best-iptv-for-canada-2026-complete-guide-for-canadian",
  ];

  for (const slug of execSummarySlugs) {
    const post = await Post.findOne({ slug }).select("slug content").lean();
    if (!post) { console.log("NOT FOUND: " + slug); continue; }

    let content = post.content;
    const before = content;

    // Replace "## Executive Summary" (case-insensitive, possible trailing text) with "## Overview"
    // This covers variations like "## Executive Summary", "## Executive Summary\n", etc.
    content = content.split("## Executive Summary").join("## Overview");
    content = content.split("## EXECUTIVE SUMMARY").join("## Overview");
    content = content.split("## Executive summary").join("## Overview");

    if (content === before) {
      console.log("No 'Executive Summary' found in: " + slug);
      console.log("  (checking first 500 chars of content...)");
      console.log("  " + before.slice(0, 500).replace(/\n/g, " | "));
      continue;
    }

    await Post.updateOne({ slug }, { $set: { content } });
    console.log("OK " + slug + " — Executive Summary -> Overview");
  }

  // ── Fix 3: Wrong first H2 in Android TV article ───────────────────────────
  const androidSlug = "best-iptv-for-android-tv-2026";
  const androidPost = await Post.findOne({ slug: androidSlug }).select("slug content").lean();
  if (!androidPost) {
    console.log("NOT FOUND: " + androidSlug);
  } else {
    let content = androidPost.content;
    const before = content;

    // The wrong H2 is "Best IPTV for Firestick in 2026: Quick Overview"
    // It should be "Best IPTV for Android TV in 2026: Quick Overview"
    content = content.split("Best IPTV for Firestick in 2026: Quick Overview").join("Best IPTV for Android TV in 2026: Quick Overview");

    if (content === before) {
      console.log("Pattern not found in: " + androidSlug + " — showing first H2 found:");
      const h2Match = content.match(/^## .+/m);
      console.log("  " + (h2Match ? h2Match[0] : "(none)"));
    } else {
      await Post.updateOne({ slug: androidSlug }, { $set: { content } });
      console.log("OK " + androidSlug + " — fixed wrong H2");
    }
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch(err => { console.error("Fatal:", err.message); process.exit(1); });
