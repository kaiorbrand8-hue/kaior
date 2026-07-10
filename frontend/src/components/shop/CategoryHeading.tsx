"use client";

import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import type { Category } from "@/lib/types";

export default function CategoryHeading({ category }: { category: Category }) {
  const { locale, t } = useLanguage();

  return (
    <div className="mb-10 text-center">
      <p className="text-xs uppercase tracking-widest-lg text-gold-600">{t("category.eyebrow")}</p>
      <h1 className="mt-2 font-display text-3xl text-navy-900">
        {localizeField(category, "name", locale)}
      </h1>
      {category.description && (
        <p className="mx-auto mt-2 max-w-lg text-sm text-charcoal/60">
          {localizeField(category, "description", locale)}
        </p>
      )}
    </div>
  );
}
