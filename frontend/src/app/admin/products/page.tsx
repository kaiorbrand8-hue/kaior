"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ includeInactive: true, limit: 48 })
      .then((res) => setProducts(res.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-navy-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="border border-navy-900 bg-navy-900 px-5 py-2 text-xs uppercase tracking-widest-lg text-cream hover:bg-navy-800"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-charcoal/50">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-900/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="py-2">Product</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-navy-900/5">
                  <td className="flex items-center gap-3 py-3">
                    <div className="relative h-12 w-10 overflow-hidden bg-navy-900">
                      {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                    </div>
                    <span className="text-navy-900">{p.name}</span>
                  </td>
                  <td className="py-3 text-charcoal/70">EGP {p.price.toLocaleString()}</td>
                  <td className="py-3 text-charcoal/70">{p.totalStock}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link href={`/admin/products/${p._id}`} className="text-xs uppercase text-gold-600 underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="py-10 text-center text-sm text-charcoal/50">No products yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
