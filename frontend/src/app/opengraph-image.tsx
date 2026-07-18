import { ImageResponse } from "next/og";

export const alt = "KAIOR — Men's Wear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0E27",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#C9A227",
            letterSpacing: 24,
            fontFamily: "Georgia, serif",
          }}
        >
          KAIOR
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#F5EFE0",
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          Tailored. Refined. Timeless.
        </div>
      </div>
    ),
    { ...size }
  );
}
