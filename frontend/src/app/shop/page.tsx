import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/shop/Filters";
import Pagination from "@/components/shop/Pagination";
import ShopHeading from "@/components/shop/ShopHeading";
import EmptyState from "@/components/shop/EmptyState";

type SearchParams = {
  keyword?: string;
  category?: string;
  size?: string;
  sort?: string;
  page?: string;
  isNewArrival?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [categories, result] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({
      keyword: params.keyword,
      category: params.category,
      size: params.size,
      sort: params.sort,
      isNewArrival: params.isNewArrival === "true",
      page: params.page ? Number(params.page) : 1,
      limit: 12,
    }).catch(() => ({ items: [], page: 1, pages: 1, total: 0 })),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <ShopHeading keyword={params.keyword} total={result.total} />

      <div className="flex flex-col gap-10 lg:flex-row">
        <Suspense>
          <Filters categories={categories} />
        </Suspense>

        <div className="flex-1">
          {result.items.length === 0 ? (
            <EmptyState />
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
