import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/checkout",
        "/cart",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/order-confirmation",
      ],
    },
    sitemap: "https://kaiorshope.com/sitemap.xml",
  };
}
