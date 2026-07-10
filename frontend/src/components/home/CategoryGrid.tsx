"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import type { Category } from "@/lib/types";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const { locale, t } = useLanguage();

  if (!categories.length) return null;

  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest-lg text-gold-600">
            {t("home.categoryEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy-900">{t("home.categoryTitle")}</h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((cat) => (
            <Link key={cat._id} href={`/category/${cat.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-navy-900">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-navy-950/25 transition-colors group-hover:bg-navy-950/40" />
                <span className="absolute bottom-4 start-4 font-display text-lg text-cream">
                  {localizeField(cat, "name", locale)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
