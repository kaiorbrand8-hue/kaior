"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ShopHeading({ keyword, total }: { keyword?: string; total: number }) {
  const { t } = useLanguage();

  return (
    <div className="mb-10 text-center">
      <p className="text-xs uppercase tracking-widest-lg text-gold-600">{t("shop.eyebrow")}</p>
      <h1 className="mt-2 font-display text-3xl text-navy-900">{t("shop.title")}</h1>
      {keyword && (
        <p className="mt-2 text-sm text-charcoal/60">
          {t("shop.resultsFor")} &ldquo;{keyword}&rdquo; ({total})
        </p>
      )}
    </div>
  );
}
