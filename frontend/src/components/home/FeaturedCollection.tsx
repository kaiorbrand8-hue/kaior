"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";
import Reveal from "./Reveal";

export default function FeaturedCollection({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  if (!products.length) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-widest-lg text-gold-600">
            {t("home.featuredEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy-900">{t("home.featuredTitle")}</h2>
          <span aria-hidden className="mt-4 h-px w-12 bg-gold-500" />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product, i) => (
            <Reveal key={product._id} delay={Math.min(i, 4) * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 border border-navy-900 px-8 py-3 text-sm uppercase tracking-widest-lg text-navy-900 transition-colors hover:bg-navy-900 hover:text-cream"
          >
            {t("home.viewAllProducts")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
