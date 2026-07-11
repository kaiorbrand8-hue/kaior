"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats } from "@/lib/api";
import type { AdminStats } from "@/lib/types";

const CARDS: { key: keyof AdminStats; label: string; href?: string; format?: (v: number) => string }[] = [
  { key: "totalRevenue", label: "Total Revenue", format: (v) => `EGP ${v.toLocaleString()}` },
  { key: "totalOrders", label: "Total Orders", href: "/admin/orders" },
  { key: "pendingOrders", label: "Pending Orders", href: "/admin/orders" },
  { key: "pendingReviews", label: "Pending Reviews", href: "/admin/reviews" },
  { key: "totalProducts", label: "Products", href: "/admin/products" },
  { key: "totalCustomers", label: "Customers", href: "/admin/customers" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-navy-900">Dashboard</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => {
          const value = stats ? (card.format ? card.format(stats[card.key]) : stats[card.key]) : "...";
          const content = (
            <>
              <p className="text-xs uppercase tracking-widest-lg text-charcoal/50">{card.label}</p>
              <p className="mt-2 font-display text-2xl text-navy-900">{value}</p>
            </>
          );
          return card.href ? (
            <Link
              key={card.key}
              href={card.href}
              className="border border-navy-900/10 bg-cream p-5 hover:border-gold-500"
            >
              {content}
            </Link>
          ) : (
            <div key={card.key} className="border border-navy-900/10 bg-cream p-5">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
