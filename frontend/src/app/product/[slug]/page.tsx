import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/api";
import ProductDetail from "@/components/shop/ProductDetail";
import ReviewsSection from "@/components/shop/ReviewsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product Not Found — KAIOR" };
  const title = `${product.name} — KAIOR`;
  const description = product.shortDescription || product.description;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) notFound();

  return (
    <div>
      <ProductDetail product={product} />
      <ReviewsSection productId={product._id} reviews={product.reviews} />
    </div>
  );
}
