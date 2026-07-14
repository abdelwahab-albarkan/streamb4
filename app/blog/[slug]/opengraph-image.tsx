import { ImageResponse } from "next/og";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";
import { serializeDoc } from "@/lib/serialize";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

async function getPost(slug: string) {
  try {
    await connectDB();
    const doc = await Post.findOne({ slug, status: "published" }).lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return doc ? serializeDoc(doc as any) : null;
  } catch {
    return null;
  }
}

export const alt = "STREAMB4 Blog Article";

export default async function ArticleOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title || "STREAMB4 Blog";
  const category = post?.category || "Streaming Guide";
  const author = post?.author || "STREAMB4 Editorial Team";
  const readingTime = post?.readingTime || 5;

  // Truncate title for display
  const displayTitle = title.length > 80 ? title.slice(0, 77) + "..." : title;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #050505 0%, #0d0700 60%, #050505 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #FF8C00, #FFB300, transparent)",
          }}
        />

        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(255,122,0,0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Category badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 100,
              background: "rgba(255,122,0,0.15)",
              border: "1px solid rgba(255,122,0,0.4)",
              color: "#FF8C00",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>{readingTime} min read</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: displayTitle.length > 60 ? 42 : 52,
            fontWeight: 900,
            color: "white",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            maxWidth: 900,
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {displayTitle}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8C00, #FFB300)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              S
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{author}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>STREAMB4 Blog</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              STREAM<span style={{ color: "#FF8C00" }}>B4</span>
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
