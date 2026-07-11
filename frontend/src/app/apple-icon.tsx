import { ImageResponse } from "next/og";
import { buildMonogram } from "@/lib/pwaIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(buildMonogram(size.width), { ...size });
}
