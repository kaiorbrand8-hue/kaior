import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // The backend runs on localhost in dev, which Next.js treats as a
    // private IP and blocks by default (SSRF guard). Safe here since the
    // remotePatterns above already restrict this to our own upload path.
    // In production the backend will have a real domain and this won't matter.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
