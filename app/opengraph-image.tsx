import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "STREAMB4 — Premium IPTV Service | 50,000+ Channels in 4K";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default async function OgImage() {
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
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 400,
            background: "radial-gradient(ellipse, rgba(255,122,0,0.15), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "2px solid #FF8C00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,140,0,0.1)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderLeft: "18px solid #FF8C00",
                marginLeft: 4,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            STREAM<span style={{ color: "#FF8C00" }}>B4</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          Premium IPTV Service
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            marginBottom: 40,
            maxWidth: 700,
          }}
        >
          50,000+ Live Channels · 4K Ultra HD · Instant Activation
        </div>

        {/* Pill tags */}
        <div style={{ display: "flex", gap: 12 }}>
          {["No Contracts", "Free 24hr Trial", "All Devices"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                border: "1px solid rgba(255,122,0,0.4)",
                background: "rgba(255,122,0,0.1)",
                color: "#FF8C00",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 40,
            color: "rgba(255,255,255,0.25)",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          streamb4.com
        </div>
      </div>
    ),
    { ...size }
  );
}
