"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOrders, updateOrderStatus } from "@/lib/api";
import type { Order } from "@/lib/types";

const STATUSES: Order["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = () =>
    getAllOrders({ status: statusFilter || undefined, limit: 50 }).then((res) => setOrders(res.items));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off a fetch on filter change
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-navy-900">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-navy-900/20 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-charcoal/50">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-sm text-charcoal/50">No orders found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const customer = typeof order.user === "string" ? null : order.user;
            return (
              <div key={order._id} className="border border-navy-900/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-navy-900">{order.orderNumber}</p>
                    <p className="text-xs text-charcoal/50">
                      {customer ? `${customer.name} — ${customer.email}` : ""} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-navy-900/20 px-3 py-1.5 text-xs uppercase tracking-wide"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 space-y-1 text-sm text-charcoal/70">
                  {order.items.map((item, i) => (
                    <p key={i}>
                      {item.name} ({item.color}/{item.size}) x{item.quantity}
                    </p>
                  ))}
                </div>

                <div className="mt-3 border-t border-navy-900/10 pt-3 text-sm text-charcoal/70">
                  <p>
                    {order.shippingAddress.fullName} · {order.shippingAddress.phone}
                  </p>
                  <p>
                    {order.shippingAddress.street}, {order.shippingAddress.area},{" "}
                    {order.shippingAddress.city}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Link
                    href={`/admin/orders/${order._id}/waybill`}
                    target="_blank"
                    className="border border-navy-900 px-4 py-1.5 text-xs uppercase tracking-widest-lg text-navy-900 hover:bg-navy-900 hover:text-cream"
                  >
                    Print Waybill
                  </Link>
                  <div className="text-sm font-medium text-navy-900">
                    Total: EGP {order.totalPrice.toLocaleString()} (COD)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
