import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/api";

const BASE_URL = "https://kaiorshope.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ limit: 200 }).catch(() => ({ items: [], page: 1, pages: 1, total: 0 })),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.items.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: product.createdAt ? new Date(product.createdAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
