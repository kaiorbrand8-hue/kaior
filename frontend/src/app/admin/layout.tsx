"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login?redirect=/admin");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin") {
    return <div className="py-24 text-center text-sm text-charcoal/50">Loading admin dashboard...</div>;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8 print:block print:max-w-none print:p-0">
      <aside className="lg:w-52 lg:shrink-0 print:hidden">
        <h2 className="font-display text-xl text-navy-900">KAIOR Admin</h2>
        <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-3 py-2 text-sm ${
                pathname === item.href
                  ? "bg-navy-900 text-cream"
                  : "text-charcoal/70 hover:bg-navy-900/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
