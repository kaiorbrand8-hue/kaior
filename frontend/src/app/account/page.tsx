"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateColor } from "@/lib/i18n/colors";
import { getMyOrders } from "@/lib/api";
import type { Order } from "@/lib/types";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { locale, t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      getMyOrders()
        .then(setOrders)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) {
    return <div className="py-24 text-center text-sm text-charcoal/50">{t("common.loading")}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-navy-900">{t("account.title")}</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {user.name} — {user.email}
          </p>
        </div>
        <div className="flex gap-3">
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="border border-navy-900 px-5 py-2 text-xs uppercase tracking-widest-lg text-navy-900 hover:bg-navy-900 hover:text-cream"
            >
              {t("account.adminDashboard")}
            </Link>
          )}
          <button
            onClick={logout}
            className="border border-navy-900/20 px-5 py-2 text-xs uppercase tracking-widest-lg text-charcoal/70 hover:border-navy-900"
          >
            {t("account.logout")}
          </button>
        </div>
      </div>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-widest-lg text-navy-900">
        {t("account.orderHistory")}
      </h2>

      {loading ? (
        <p className="mt-6 text-sm text-charcoal/50">{t("account.loadingOrders")}</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-sm text-charcoal/50">
          {t("account.noOrders")}{" "}
          <Link href="/shop" className="text-gold-600 underline">
            {t("account.startShopping")}
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-navy-900/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-navy-900">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal/50">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}
                >
                  {t(`status.${order.status}`)}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-charcoal/70">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.name} ({translateColor(item.color || "", locale)}/{item.size}) x{item.quantity}
                  </p>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-navy-900/10 pt-3">
                <span className="text-sm font-medium text-navy-900">
                  {t("account.total")}: {t("common.egp")} {order.totalPrice.toLocaleString()}
                </span>
                <Link
                  href={`/order-confirmation/${order._id}`}
                  className="text-xs uppercase tracking-wide text-gold-600 underline"
                >
                  {t("account.viewDetails")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
