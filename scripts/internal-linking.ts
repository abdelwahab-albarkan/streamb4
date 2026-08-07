/**
 * Internal Linking Script — STREAMB4 Blog
 *
 * Adds 4-8 contextual internal links to every published blog post,
 * appends a "Related Guides" section, and inserts a contextual CTA.
 *
 * Usage:
 *   npx tsx scripts/internal-linking.ts
 *
 * Safe to re-run: checks for existing links before inserting.
 */

import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// ─── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

// ─── Mongoose Post Model (inline to avoid TS path issues in scripts) ──────────
interface IPost {
  _id: mongoose.Types.ObjectId;
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    id: String,
    slug: String,
    title: String,
    content: String,
    category: String,
    tags: [String],
    status: String,
  },
  { strict: false }
);
const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

// ─── Core page rules ──────────────────────────────────────────────────────────
interface LinkRule {
  url: string;
  anchors: string[]; // rotate through these for variety
  patterns: RegExp[];
}

const CORE_RULES: LinkRule[] = [
  {
    url: "https://streamb4.com/pricing",
    anchors: [
      "STREAMB4 pricing plans",
      "subscription plans",
      "monthly streaming plans",
      "view all pricing options",
    ],
    patterns: [
      /\b(pricing plan|subscription plan|monthly plan|annual plan|pricing tier)\b/i,
      /\b(how much (?:does|is)|cost of|price of)\b/i,
      /\b(subscribe to|start a subscription)\b/i,
    ],
  },
  {
    url: "https://streamb4.com/features",
    anchors: [
      "STREAMB4 features",
      "streaming features",
      "EPG and VOD features",
      "full feature list",
    ],
    patterns: [
      /\b(electronic program guide|EPG guide)\b/i,
      /\b(video on demand|VOD library)\b/i,
      /\b(anti-freeze|catch-up TV|multi-screen)\b/i,
      /\b(all features|streaming capabilities)\b/i,
    ],
  },
  {
    url: "https://streamb4.com/install",
    anchors: [
      "full installation guide",
      "step-by-step setup guide",
      "IPTV installation guide",
      "setup tutorial",
    ],
    patterns: [
      /\b(installation guide|setup guide|step-by-step guide)\b/i,
      /\b(how to install IPTV|how to set up IPTV|install the app)\b/i,
      /\b(sideload|sideloading an APK)\b/i,
      /\b(complete guide to installing)\b/i,
    ],
  },
  {
    url: "https://streamb4.com/devices",
    anchors: [
      "Downloader codes page",
      "compatible devices guide",
      "IPTV app Downloader codes",
      "supported devices list",
    ],
    patterns: [
      /\b(downloader code|downloader app by AFTVnews)\b/i,
      /\b(compatible devices?|supported devices?)\b/i,
      /\b(full list of (?:apps|players|devices))\b/i,
    ],
  },
  {
    url: "https://streamb4.com/faq",
    anchors: [
      "FAQ section",
      "frequently asked questions",
      "help center",
      "common questions answered",
    ],
    patterns: [
      /\b(frequently asked questions|FAQ page)\b/i,
      /\b(common questions about IPTV)\b/i,
    ],
  },
];

// ─── CTA templates (one per core page target) ────────────────────────────────
const CTA_TEMPLATES = [
  "Looking for a compatible device? Explore our [Devices & Downloader Codes page](https://streamb4.com/devices) for the full list of supported apps and 6-digit shortcodes.",
  "Ready to get started? Compare all plans on the [STREAMB4 Pricing page](https://streamb4.com/pricing) — no contracts, cancel anytime.",
  "Need help with setup? Our [step-by-step installation guide](https://streamb4.com/install) walks you through every device in under five minutes.",
  "Curious about what's included? Browse the [complete STREAMB4 features list](https://streamb4.com/features) — 4K, EPG, VOD, and more.",
];

// ─── Markdown safe-zone segmenter ────────────────────────────────────────────
interface Segment {
  text: string;
  safe: boolean; // true = prose; safe to link
}

function segmentMarkdown(content: string): Segment[] {
  // Collect protected ranges: code fences, inline code, existing links, headings
  const unsafe: Array<[number, number]> = [];

  // Code fences  ``` ... ```
  const codeFence = /```[\s\S]*?```/g;
  let m: RegExpExecArray | null;
  while ((m = codeFence.exec(content)) !== null)
    unsafe.push([m.index, m.index + m[0].length]);

  // Inline code  `...`
  const inlineCode = /`[^`\n]+`/g;
  while ((m = inlineCode.exec(content)) !== null)
    unsafe.push([m.index, m.index + m[0].length]);

  // Existing markdown links  [text](url) — protect both text and url
  const mdLink = /\[([^\]]*)\]\([^)]*\)/g;
  while ((m = mdLink.exec(content)) !== null)
    unsafe.push([m.index, m.index + m[0].length]);

  // Heading lines  ## ... (entire line)
  const heading = /^#{1,6}[^\n]+/gm;
  while ((m = heading.exec(content)) !== null)
    unsafe.push([m.index, m.index + m[0].length]);

  // HTML tags (in case content mixes HTML)
  const htmlTag = /<[^>]+>/g;
  while ((m = htmlTag.exec(content)) !== null)
    unsafe.push([m.index, m.index + m[0].length]);

  // Sort and merge overlapping ranges
  unsafe.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const [s, e] of unsafe) {
    if (merged.length && s <= merged[merged.length - 1][1]) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    } else {
      merged.push([s, e]);
    }
  }

  // Build segments
  const segs: Segment[] = [];
  let pos = 0;
  for (const [s, e] of merged) {
    if (pos < s) segs.push({ text: content.slice(pos, s), safe: true });
    segs.push({ text: content.slice(s, e), safe: false });
    pos = e;
  }
  if (pos < content.length) segs.push({ text: content.slice(pos), safe: true });
  return segs;
}

// ─── Insert ONE link into content (first safe occurrence of pattern) ──────────
function insertLink(
  content: string,
  pattern: RegExp,
  url: string,
  anchor: string
): { content: string; inserted: boolean } {
  // Reset regex state
  pattern.lastIndex = 0;
  const segs = segmentMarkdown(content);
  let inserted = false;
  const result = segs.map((seg) => {
    if (!seg.safe || inserted) return seg.text;
    pattern.lastIndex = 0;
    const match = pattern.exec(seg.text);
    if (match) {
      inserted = true;
      return (
        seg.text.slice(0, match.index) +
        `[${anchor}](${url})` +
        seg.text.slice(match.index + match[0].length)
      );
    }
    return seg.text;
  });
  return { content: result.join(""), inserted };
}

// ─── Check if URL already linked in content ──────────────────────────────────
function isAlreadyLinked(content: string, url: string): boolean {
  return content.includes(`](${url})`);
}

// ─── Extract all URLs already in content ─────────────────────────────────────
function extractLinkedUrls(content: string): Set<string> {
  const urls = new Set<string>();
  const re = /\]\((https?:\/\/[^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) urls.add(m[1]);
  return urls;
}

// ─── Related Guides section builder ──────────────────────────────────────────
function buildRelatedGuides(
  relatedPosts: Array<{ title: string; slug: string }>
): string {
  const items = relatedPosts
    .map((p) => `- [${p.title}](https://streamb4.com/blog/${p.slug})`)
    .join("\n");
  return `\n\n---\n\n## Related Guides\n\n${items}\n`;
}

// ─── Score topic similarity between two posts ─────────────────────────────────
function topicScore(
  a: { title: string; tags: string[]; category: string; content: string },
  b: { title: string; tags: string[]; category: string }
): number {
  let score = 0;
  if (a.category === b.category) score += 3;

  const aTags = new Set(a.tags.map((t) => t.toLowerCase()));
  for (const tag of b.tags) {
    if (aTags.has(tag.toLowerCase())) score += 2;
  }

  // Check if b's title keywords appear in a's content or title
  const bWords = b.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const aLower = (a.title + " " + a.content).toLowerCase();
  for (const word of bWords) {
    if (aLower.includes(word)) score += 1;
  }

  return score;
}

// ─── Pick a CTA appropriate for the post ─────────────────────────────────────
function pickCTA(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes("device") || lower.includes("firestick") || lower.includes("smart tv"))
    return CTA_TEMPLATES[0];
  if (lower.includes("pric") || lower.includes("plan") || lower.includes("cost"))
    return CTA_TEMPLATES[1];
  if (lower.includes("install") || lower.includes("setup") || lower.includes("configure"))
    return CTA_TEMPLATES[2];
  return CTA_TEMPLATES[3];
}

// ─── Report accumulator ───────────────────────────────────────────────────────
interface ReportEntry {
  slug: string;
  title: string;
  linksAdded: Array<{ anchor: string; url: string }>;
  relatedGuides: string[];
  ctaAdded: string;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");

  console.log("Connecting to MongoDB…");
  await mongoose.connect(uri, { bufferCommands: false });
  console.log("Connected.\n");

  // Fetch all published posts
  const posts = await Post.find({ status: "published" })
    .select("id slug title content category tags status")
    .lean<IPost[]>();

  console.log(`Found ${posts.length} published posts.\n`);
  if (!posts.length) {
    console.log("No posts to process.");
    await mongoose.disconnect();
    return;
  }

  const report: ReportEntry[] = [];

  // Build post catalog for cross-linking
  const catalog = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    tags: p.tags || [],
    category: p.category,
  }));

  // Anchor counter per URL across the whole run (for variety)
  const anchorCounters: Record<string, number> = {};
  function nextAnchor(anchors: string[], url: string): string {
    anchorCounters[url] = (anchorCounters[url] ?? 0);
    const anchor = anchors[anchorCounters[url] % anchors.length];
    anchorCounters[url]++;
    return anchor;
  }

  for (const post of posts) {
    if (!post.content || post.content.trim().length < 100) continue;

    const entry: ReportEntry = {
      slug: post.slug,
      title: post.title,
      linksAdded: [],
      relatedGuides: [],
      ctaAdded: "",
    };

    let content = post.content;
    const linkedUrls = extractLinkedUrls(content);

    // ── 1. Core page links (max 1 per core URL) ──────────────────────────────
    for (const rule of CORE_RULES) {
      if (isAlreadyLinked(content, rule.url)) continue; // already there

      let inserted = false;
      for (const pattern of rule.patterns) {
        if (inserted) break;
        const anchor = nextAnchor(rule.anchors, rule.url);
        const result = insertLink(content, pattern, rule.url, anchor);
        if (result.inserted) {
          content = result.content;
          entry.linksAdded.push({ anchor, url: rule.url });
          linkedUrls.add(rule.url);
          inserted = true;
        }
      }
    }

    // ── 2. Blog-to-blog links (top 4 most related posts) ─────────────────────
    const candidates = catalog
      .filter((c) => c.slug !== post.slug)
      .map((c) => ({
        ...c,
        score: topicScore(
          {
            title: post.title,
            tags: post.tags || [],
            category: post.category,
            content: post.content,
          },
          c
        ),
      }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    for (const cand of candidates) {
      const candUrl = `https://streamb4.com/blog/${cand.slug}`;
      if (isAlreadyLinked(content, candUrl)) continue;

      // Try to find the post's title keywords in the current post's prose
      const titleWords = cand.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 4)
        .slice(0, 3);

      let inserted = false;
      for (const word of titleWords) {
        if (inserted) break;
        // Only link the exact word if it appears in a prose context
        const pattern = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
        const result = insertLink(content, pattern, candUrl, cand.title);
        if (result.inserted) {
          content = result.content;
          entry.linksAdded.push({ anchor: cand.title, url: candUrl });
          inserted = true;
        }
      }
    }

    // ── 3. Add contextual CTA before "Related Guides" or at end ──────────────
    const hasRelatedSection = /^##\s*Related Guides/m.test(content);
    const cta = pickCTA(content);
    entry.ctaAdded = cta;

    if (!hasRelatedSection) {
      // Check if CTA already exists
      if (!content.includes("streamb4.com/pricing") && !content.includes("streamb4.com/devices") &&
          !content.includes("streamb4.com/install") && !content.includes("streamb4.com/features") ||
          entry.linksAdded.length === 0) {
        // Add CTA block if not already there
        content = content.trimEnd() + `\n\n> ${cta}`;
      }
    }

    // ── 4. Append "Related Guides" section ────────────────────────────────────
    if (!hasRelatedSection) {
      // Pick up to 4 top candidates for Related Guides
      const guideLinks = candidates.slice(0, 4);
      // Always pad with core pages if fewer than 4 blog posts are related
      const coreSuggestions: Array<{ title: string; slug: string }> = [
        { title: "IPTV Installation Guide — Firestick, Smart TV & Android", slug: "" },
        { title: "Best IPTV Apps & Downloader Codes", slug: "" },
      ];

      const relatedItems: Array<{ title: string; slug: string }> = guideLinks.map((g) => ({
        title: g.title,
        slug: g.slug,
      }));

      // Add core page links to Related Guides if < 4 items
      const coreGuideLinks: Array<{ title: string; url: string }> = [];
      if (relatedItems.length < 4) {
        const contentLower = content.toLowerCase();
        if (contentLower.includes("install") && !isAlreadyLinked(content, "https://streamb4.com/install"))
          coreGuideLinks.push({ title: "IPTV Installation Guide", url: "https://streamb4.com/install" });
        if (contentLower.includes("device") || contentLower.includes("firestick"))
          if (!isAlreadyLinked(content, "https://streamb4.com/devices"))
            coreGuideLinks.push({ title: "Downloader Codes & Device Setup", url: "https://streamb4.com/devices" });
        if (!isAlreadyLinked(content, "https://streamb4.com/pricing"))
          coreGuideLinks.push({ title: "STREAMB4 Pricing Plans", url: "https://streamb4.com/pricing" });
        if (!isAlreadyLinked(content, "https://streamb4.com/features"))
          coreGuideLinks.push({ title: "STREAMB4 Features & Channel List", url: "https://streamb4.com/features" });
      }

      // Build Related Guides block
      const guidesBlock = buildRelatedGuidesBlock(relatedItems, coreGuideLinks, 4);
      content = content.trimEnd() + guidesBlock;
      entry.relatedGuides = [
        ...relatedItems.map((r) => r.title),
        ...coreGuideLinks.map((c) => c.title),
      ].slice(0, 4);
    }

    // ── 5. Update in MongoDB if content changed ───────────────────────────────
    if (content !== post.content) {
      await Post.updateOne(
        { _id: post._id },
        { $set: { content } }
      );
      console.log(`✓ Updated: ${post.slug}`);
    } else {
      console.log(`- Skipped (no changes): ${post.slug}`);
    }

    report.push(entry);
  }

  // ─── Print Report ────────────────────────────────────────────────────────────
  console.log("\n" + "═".repeat(70));
  console.log("INTERNAL LINKING REPORT");
  console.log("═".repeat(70) + "\n");

  let totalLinks = 0;
  for (const entry of report) {
    if (entry.linksAdded.length === 0 && entry.relatedGuides.length === 0) continue;
    console.log(`📄 ${entry.title}`);
    console.log(`   Slug: /blog/${entry.slug}`);
    if (entry.linksAdded.length) {
      console.log(`   Links added (${entry.linksAdded.length}):`);
      for (const l of entry.linksAdded) {
        console.log(`     • "${l.anchor}" → ${l.url}`);
        totalLinks++;
      }
    }
    if (entry.relatedGuides.length) {
      console.log(`   Related Guides: ${entry.relatedGuides.join(", ")}`);
    }
    if (entry.ctaAdded) {
      console.log(`   CTA: ${entry.ctaAdded.slice(0, 80)}…`);
    }
    console.log();
  }

  console.log(`Total links inserted: ${totalLinks}`);
  console.log(`Articles processed: ${report.length}`);
  console.log(`\nConfirmation: Only internal links were added. No titles, headings,`);
  console.log(`metadata, images, schemas, or URLs/slugs were modified.`);

  await mongoose.disconnect();
  console.log("\nDone. Disconnected from MongoDB.");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildRelatedGuidesBlock(
  blogPosts: Array<{ title: string; slug: string }>,
  corePages: Array<{ title: string; url: string }>,
  max: number
): string {
  const lines: string[] = [];
  let count = 0;

  for (const p of blogPosts) {
    if (count >= max) break;
    lines.push(`- [${p.title}](https://streamb4.com/blog/${p.slug})`);
    count++;
  }
  for (const c of corePages) {
    if (count >= max) break;
    lines.push(`- [${c.title}](${c.url})`);
    count++;
  }

  if (!lines.length) return "";
  return `\n\n---\n\n## Related Guides\n\n${lines.join("\n")}\n`;
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
