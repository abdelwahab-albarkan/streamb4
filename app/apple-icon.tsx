// app/apple-icon.tsx — generates /apple-icon (180×180 apple-touch-icon)
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          borderRadius: 40,
        }}
      >
        {/* Orange ring */}
        <div
          style={{
            width: 148,
            height: 148,
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
              width: 126,
              height: 126,
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
                borderTop: "32px solid transparent",
                borderBottom: "32px solid transparent",
                borderLeft: "56px solid #FF7A00",
                marginLeft: 8,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
