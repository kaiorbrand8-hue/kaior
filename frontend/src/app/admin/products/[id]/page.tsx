"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCategories, getProductById } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getProductById(id)])
      .then(([cats, prod]) => {
        setCategories(cats);
        setProduct(prod);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-charcoal/50">Loading...</p>;
  if (!product) return <p className="text-sm text-red-600">Product not found.</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-navy-900">Edit Product</h1>
      <div className="mt-6">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
