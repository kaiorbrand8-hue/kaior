"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import type { Category } from "@/lib/types";

export default function Footer({ categories }: { categories: Category[] }) {
  const { locale, t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-cream print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl tracking-widest-lg text-gold-400">KAIOR</h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest-lg text-gold-400">
              {t("footer.shop")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li>
                <Link href="/shop" className="hover:text-gold-400">
                  {t("footer.allProducts")}
                </Link>
              </li>
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-gold-400">
                    {localizeField(cat, "name", locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest-lg text-gold-400">
              {t("footer.customerCare")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li>
                <Link href="/account" className="hover:text-gold-400">
                  {t("footer.myAccount")}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-gold-400">
                  {t("footer.cart")}
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-gold-400">
                  {t("footer.checkout")}
                </Link>
              </li>
              <li className="text-cream/60">{t("footer.codNote")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gold-500/15 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>
            &copy; {year} KAIOR Men&apos;s Wear. {t("footer.rights")}
          </p>
          <p className="tracking-widest-lg uppercase">@KAIOR.OFFICIAL</p>
        </div>
      </div>
    </footer>
  );
}
