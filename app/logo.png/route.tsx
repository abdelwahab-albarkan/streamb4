// app/logo.png/route.tsx
// Serves https://streamb4.com/logo.png — the logo URL referenced in the
// Organization JSON-LD schema so Google can discover the official brand logo.
// 400 × 120 px — recommended aspect ratio for structured data logos.
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 400,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "#0A0A0A",
        }}
      >
        {/* Icon: orange circle with play triangle */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF7A00, #FF4500)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "16px solid transparent",
              borderBottom: "16px solid transparent",
              borderLeft: "28px solid #0A0A0A",
              marginLeft: 6,
            }}
          />
        </div>

        {/* Wordmark: STREAMB4 */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "sans-serif",
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#ffffff" }}>STREAM</span>
          <span style={{ color: "#FF7A00" }}>B4</span>
        </div>
      </div>
    ),
    {
      width: 400,
      height: 120,
      headers: {
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    },
  );
}
