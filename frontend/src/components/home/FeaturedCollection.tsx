"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";

export default function FeaturedCollection({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  if (!products.length) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-widest-lg text-gold-600">
            {t("home.featuredEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy-900">{t("home.featuredTitle")}</h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/shop"
            className="border border-navy-900 px-8 py-3 text-sm uppercase tracking-widest-lg text-navy-900 transition-colors hover:bg-navy-900 hover:text-cream"
          >
            {t("home.viewAllProducts")}
          </Link>
        </div>
      </div>
    </section>
  );
}
