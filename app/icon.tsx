// app/icon.tsx — generates /icon (used as favicon by Next.js)
// Sizes: Next.js serves this at multiple resolutions automatically.
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          borderRadius: 96,
        }}
      >
        {/* Outer orange ring */}
        <div
          style={{
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF7A00, #FF4500)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Inner dark circle */}
          <div
            style={{
              width: 360,
              height: 360,
              borderRadius: "50%",
              background: "#0A0A0A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Play triangle */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "90px solid transparent",
                borderBottom: "90px solid transparent",
                borderLeft: "160px solid #FF7A00",
                marginLeft: 24,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
