"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-navy-900">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.isNewArrival && (
          <span className="absolute start-3 top-3 bg-gold-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-950">
            {t("product_card.new")}
          </span>
        )}
        {hasDiscount && (
          <span className="absolute end-3 top-3 bg-navy-950/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-400">
            {t("product_card.sale")}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-display text-base text-charcoal group-hover:text-navy-800">
          {localizeField(product, "name", locale)}
        </h3>
        {typeof product.category !== "string" && (
          <p className="text-xs uppercase tracking-wide text-charcoal/50">
            {localizeField(product.category, "name", locale)}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-navy-800">
            {t("common.egp")} {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-charcoal/40 line-through">
              {t("common.egp")} {product.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
