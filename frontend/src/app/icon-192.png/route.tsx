import { ImageResponse } from "next/og";
import { buildMonogram } from "@/lib/pwaIcon";

export async function GET() {
  return new ImageResponse(buildMonogram(192), { width: 192, height: 192 });
}
