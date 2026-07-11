import { ImageResponse } from "next/og";
import { buildMonogram } from "@/lib/pwaIcon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(buildMonogram(size.width), { ...size });
}
