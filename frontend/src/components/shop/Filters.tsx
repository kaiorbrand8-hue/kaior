"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import type { Category } from "@/lib/types";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function Filters({
  categories,
  hideCategory,
}: {
  categories: Category[];
  hideCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, t } = useLanguage();

  const SORTS = [
    { value: "newest", label: t("shop.sortNewest") },
    { value: "price-asc", label: t("shop.sortPriceAsc") },
    { value: "price-desc", label: t("shop.sortPriceDesc") },
    { value: "rating", label: t("shop.sortRating") },
  ];

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeSize = searchParams.get("size");
  const activeSort = searchParams.get("sort") || "newest";
  const activeCategory = searchParams.get("category");

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="mb-8">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest-lg text-navy-900">
          {t("shop.sortBy")}
        </h4>
        <select
          value={activeSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="w-full border border-navy-900/15 bg-white px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {!hideCategory && (
        <div className="mb-8">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest-lg text-navy-900">
            {t("shop.category")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => setParam("category", null)}
                className={`hover:text-gold-600 ${!activeCategory ? "text-gold-600 font-medium" : "text-charcoal/70"}`}
              >
                {t("shop.all")}
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => setParam("category", cat.slug)}
                  className={`hover:text-gold-600 ${activeCategory === cat.slug ? "text-gold-600 font-medium" : "text-charcoal/70"}`}
                >
                  {localizeField(cat, "name", locale)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest-lg text-navy-900">
          {t("shop.sizeLabel")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setParam("size", activeSize === size ? null : size)}
              className={`h-9 w-9 border text-xs transition-colors ${
                activeSize === size
                  ? "border-navy-900 bg-navy-900 text-cream"
                  : "border-navy-900/20 text-charcoal/70 hover:border-navy-900"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
