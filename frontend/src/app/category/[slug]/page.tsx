import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/shop/Filters";
import Pagination from "@/components/shop/Pagination";
import CategoryHeading from "@/components/shop/CategoryHeading";
import CategoryEmptyState from "@/components/shop/CategoryEmptyState";

type SearchParams = { size?: string; sort?: string; page?: string };

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) notFound();

  const [categories, result] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({
      category: slug,
      size: sp.size,
      sort: sp.sort,
      page: sp.page ? Number(sp.page) : 1,
      limit: 12,
    }).catch(() => ({ items: [], page: 1, pages: 1, total: 0 })),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <CategoryHeading category={category} />

      <div className="flex flex-col gap-10 lg:flex-row">
        <Suspense>
          <Filters categories={categories} hideCategory />
        </Suspense>

        <div className="flex-1">
          {result.items.length === 0 ? (
            <CategoryEmptyState />
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {result.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <Suspense>
            <Pagination page={result.page} pages={result.pages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
