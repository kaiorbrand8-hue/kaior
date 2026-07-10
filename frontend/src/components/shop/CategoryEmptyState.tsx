"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CategoryEmptyState() {
  const { t } = useLanguage();
  return <p className="py-20 text-center text-sm text-charcoal/50">{t("category.empty")}</p>;
}
