"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Pagination({ page, pages }: { page: number; pages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dir } = useLanguage();

  if (pages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  const prevArrow = dir === "rtl" ? "→" : "←";
  const nextArrow = dir === "rtl" ? "←" : "→";

  return (
    <div className="mt-14 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        className="h-9 w-9 border border-navy-900/20 text-sm disabled:opacity-30"
      >
        {prevArrow}
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i + 1)}
          className={`h-9 w-9 border text-sm ${
            page === i + 1
              ? "border-navy-900 bg-navy-900 text-cream"
              : "border-navy-900/20 text-charcoal/70 hover:border-navy-900"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => goTo(page + 1)}
        className="h-9 w-9 border border-navy-900/20 text-sm disabled:opacity-30"
      >
        {nextArrow}
      </button>
    </div>
  );
}
