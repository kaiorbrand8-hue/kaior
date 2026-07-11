import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KAIOR — Men's Wear",
    short_name: "KAIOR",
    description:
      "KAIOR Men's Wear — tailored, timeless menswear essentials. Sharp fits, premium fabrics, effortless elegance.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E27",
    theme_color: "#0A0E27",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
