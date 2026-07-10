"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function SearchBox({ onClose }: { onClose: () => void }) {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing stale results when the query is emptied
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const currentRequest = ++requestId.current;
    const timer = setTimeout(() => {
      getProducts({ keyword: trimmed, limit: 6 })
        .then((res) => {
          if (currentRequest !== requestId.current) return;
          setResults(res.items);
          setSearched(true);
        })
        .catch(() => {
          if (currentRequest !== requestId.current) return;
          setResults([]);
          setSearched(true);
        })
        .finally(() => {
          if (currentRequest === requestId.current) setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/shop?keyword=${encodeURIComponent(query.trim())}`;
  };

  return (
    <div className="border-t border-navy-900/10 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <form onSubmit={submitSearch} className="mx-auto max-w-2xl">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          placeholder={t("nav.searchPlaceholder")}
          className="w-full bg-transparent text-navy-900 placeholder:text-charcoal/40 border-b border-navy-900/20 py-1 focus:outline-none focus:border-gold-500"
        />
      </form>

      {query.trim() && (
        <div
          data-testid="search-results"
          className="mx-auto mt-3 max-w-2xl border border-navy-900/10 bg-white shadow-lg"
        >
          {loading ? (
            <p className="px-4 py-4 text-sm text-charcoal/50">{t("common.loading")}</p>
          ) : results.length > 0 ? (
            <>
              <ul>
                {results.map((product) => (
                  <li key={product._id} className="border-b border-navy-900/5 last:border-b-0">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream"
                    >
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-navy-900">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-charcoal">
                          {localizeField(product, "name", locale)}
                        </p>
                        <p className="text-xs font-medium text-navy-800">
                          {t("common.egp")} {product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/shop?keyword=${encodeURIComponent(query.trim())}`}
                onClick={onClose}
                className="block border-t border-navy-900/10 px-4 py-2.5 text-center text-xs uppercase tracking-widest-lg text-gold-600 hover:bg-cream"
              >
                {t("shop.title")} &rarr;
              </Link>
            </>
          ) : (
            searched && <p className="px-4 py-4 text-sm text-charcoal/50">{t("shop.noResults")}</p>
          )}
        </div>
      )}
    </div>
  );
}
