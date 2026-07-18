"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import { translateColor } from "@/lib/i18n/colors";
import type { Product } from "@/lib/types";

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { locale, t } = useLanguage();

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors[0] || "");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const imageCount = product.images.length;
  const goPrevImage = () => setActiveImage((i) => (i - 1 + imageCount) % imageCount);
  const goNextImage = () => setActiveImage((i) => (i + 1) % imageCount);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) goNextImage();
    else goPrevImage();
  };

  const availableSizes = useMemo(() => {
    return product.sizes.filter((s) =>
      product.variants.some((v) => v.color === color && v.size === s && v.stock > 0)
    );
  }, [product, color]);

  const selectedVariant = product.variants.find((v) => v.color === color && v.size === size);
  const maxStock = selectedVariant?.stock ?? 0;

  const productName = localizeField(product, "name", locale);

  const handleAddToCart = () => {
    if (!size) return;
    addItem({
      productId: product._id,
      slug: product.slug,
      name: productName,
      image: product.images[0] || "",
      price: product.price,
      size,
      color,
      quantity,
      stock: maxStock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const categoryName =
    typeof product.category !== "string" ? localizeField(product.category, "name", locale) : "";
  const shortDescription = localizeField(product, "shortDescription", locale);
  const fabric = localizeField(product, "fabric", locale);
  const description = localizeField(product, "description", locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-[4/5] touch-pan-y select-none overflow-hidden bg-navy-900"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {product.images[activeImage] && (
              <Image
                src={product.images[activeImage]}
                alt={productName}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
            {imageCount > 1 && (
              <>
                <button
                  onClick={goPrevImage}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/60 text-cream transition-colors hover:bg-navy-950/80"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={goNextImage}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/60 text-cream transition-colors hover:bg-navy-950/80"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImage === i ? "w-5 bg-gold-400" : "w-1.5 bg-cream/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square overflow-hidden border ${
                    activeImage === i ? "border-gold-500" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${productName} ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 12vw, 22vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {categoryName && (
            <p className="text-xs uppercase tracking-widest-lg text-gold-600">{categoryName}</p>
          )}
          <h1 className="mt-2 font-display text-3xl text-navy-900">{productName}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl font-medium text-navy-900">
              {t("common.egp")} {product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-charcoal/40 line-through">
                {t("common.egp")} {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.numReviews > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-charcoal/60">
              <span className="text-gold-500">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </span>
              <span>
                ({product.numReviews} {t("product.reviews").toLowerCase()})
              </span>
            </div>
          )}

          {shortDescription && <p className="mt-4 text-sm text-charcoal/70">{shortDescription}</p>}

          {/* Color */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest-lg text-navy-900">
                {t("product.color")}:{" "}
                <span className="font-normal normal-case text-charcoal/60">
                  {translateColor(color, locale)}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      setSize("");
                    }}
                    className={`border px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
                      color === c
                        ? "border-navy-900 bg-navy-900 text-cream"
                        : "border-navy-900/20 text-charcoal/70 hover:border-navy-900"
                    }`}
                  >
                    {translateColor(c, locale)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div className="mt-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest-lg text-navy-900">
              {t("product.size")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const inStock = availableSizes.includes(s);
                return (
                  <button
                    key={s}
                    disabled={!inStock}
                    onClick={() => setSize(s)}
                    className={`h-10 w-10 border text-xs transition-colors ${
                      size === s
                        ? "border-navy-900 bg-navy-900 text-cream"
                        : inStock
                          ? "border-navy-900/20 text-charcoal/70 hover:border-navy-900"
                          : "border-navy-900/10 text-charcoal/25 line-through"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest-lg text-navy-900">
              {t("product.quantity")}
            </h3>
            <div className="flex w-fit items-center border border-navy-900/20">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-10 w-10 text-lg"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxStock || 1, q + 1))}
                className="h-10 w-10 text-lg"
              >
                +
              </button>
            </div>
            {size && maxStock > 0 && maxStock <= 5 && (
              <p className="mt-2 text-xs text-gold-600">{t("product.onlyLeft", { n: maxStock })}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={!size}
              className="flex-1 border border-navy-900 bg-navy-900 px-6 py-3 text-sm uppercase tracking-widest-lg text-cream transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? `${t("product.added")} ✓` : t("product.addToCart")}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!size}
              className="flex-1 border border-gold-500 bg-gold-500 px-6 py-3 text-sm uppercase tracking-widest-lg text-navy-950 transition-colors hover:bg-transparent hover:text-gold-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("product.buyNow")}
            </button>
          </div>
          {!size && <p className="mt-2 text-xs text-charcoal/50">{t("product.selectSize")}</p>}

          {fabric && (
            <div className="mt-8 border-t border-navy-900/10 pt-6 text-sm text-charcoal/70">
              <p>
                <span className="font-medium text-navy-900">{t("product.fabric")}: </span>
                {fabric}
              </p>
            </div>
          )}

          {description && (
            <div className="mt-4 text-sm leading-relaxed text-charcoal/70">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
}
