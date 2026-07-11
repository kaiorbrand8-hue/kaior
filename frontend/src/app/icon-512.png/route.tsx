import { ImageResponse } from "next/og";
import { buildMonogram } from "@/lib/pwaIcon";

export async function GET() {
  return new ImageResponse(buildMonogram(512), { width: 512, height: 512 });
}
