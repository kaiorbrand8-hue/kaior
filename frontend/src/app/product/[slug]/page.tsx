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
  return {
    title: `${product.name} — KAIOR`,
    description: product.shortDescription || product.description,
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
