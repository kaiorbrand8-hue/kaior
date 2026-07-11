"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import type { Category } from "@/lib/types";
import Reveal from "./Reveal";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const { locale, t } = useLanguage();

  if (!categories.length) return null;

  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-widest-lg text-gold-600">
            {t("home.categoryEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy-900">{t("home.categoryTitle")}</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((cat, i) => (
            <Reveal key={cat._id} delay={Math.min(i, 4) * 80}>
              <Link href={`/category/${cat.slug}`} className="group block">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent transition-colors group-hover:from-navy-950/90" />
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                    <span className="font-display text-lg text-cream">
                      {localizeField(cat, "name", locale)}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 -translate-x-2 items-center justify-center rounded-full border border-cream/40 text-cream opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:translate-x-2 rtl:group-hover:translate-x-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="rtl:rotate-180"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
