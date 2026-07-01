import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "STREAMB4 Blog — IPTV Guides & Streaming Tutorials";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default async function BlogOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #050505 0%, #0d0700 50%, #050505 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 400,
            background: "radial-gradient(ellipse, rgba(255,122,0,0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#FF8C00", letterSpacing: "0.2em" }}>
            KNOWLEDGE CENTER
          </span>
        </div>

        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          IPTV Guides &<br />
          <span style={{ color: "#FF8C00" }}>Streaming Tutorials</span>
        </div>

        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            maxWidth: 650,
          }}
        >
          Expert guides, device setup tutorials and streaming tips from STREAMB4
        </div>

        <div style={{ position: "absolute", bottom: 30, right: 40, color: "rgba(255,255,255,0.2)", fontSize: 16, fontWeight: 600 }}>
          streamb4.com/blog
        </div>
      </div>
    ),
    { ...size }
  );
}
