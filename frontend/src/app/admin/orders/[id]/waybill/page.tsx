"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById, ApiError } from "@/lib/api";
import type { Order } from "@/lib/types";

const SENDER = {
  name: "KAIOR Men's Wear",
  phone: "01507175754",
  address: "Cairo, Egypt",
};

export default function WaybillPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load order"));
  }, [id]);

  useEffect(() => {
    if (!order) return;
    const timer = setTimeout(() => window.print(), 400);
    return () => clearTimeout(timer);
  }, [order]);

  if (error) {
    return <div className="py-24 text-center text-sm text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="py-24 text-center text-sm text-charcoal/50">Loading...</div>;
  }

  const address = order.shippingAddress;
  const customerName = typeof order.user === "string" ? address.fullName : order.user.name;

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-8 text-charcoal print:max-w-none print:p-0">
      <div className="flex items-center justify-between border-b-2 border-navy-900 pb-4">
        <div>
          <h1 className="font-display text-2xl tracking-widest-lg text-navy-900">KAIOR</h1>
          <p className="text-xs uppercase tracking-wide text-charcoal/60">
            Shipping Waybill / بوليصة شحن
          </p>
        </div>
        <div className="text-end text-sm">
          <p className="font-medium text-navy-900">{order.orderNumber}</p>
          <p className="text-charcoal/60">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div className="border border-navy-900/20 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
            Ship From / من
          </p>
          <p className="font-medium text-navy-900">{SENDER.name}</p>
          <p>{SENDER.phone}</p>
          <p>{SENDER.address}</p>
        </div>
        <div className="border border-navy-900/20 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
            Ship To / إلى
          </p>
          <p className="font-medium text-navy-900">{customerName}</p>
          <p>{address.phone}</p>
          <p>
            {address.street}
            {address.building ? `, ${address.building}` : ""}
          </p>
          <p>
            {address.area}, {address.city}
          </p>
          {address.notes && <p className="text-charcoal/60">Note: {address.notes}</p>}
        </div>
      </div>

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-navy-900 text-start">
            <th className="py-2 text-start">Item</th>
            <th className="py-2 text-start">Variant</th>
            <th className="py-2 text-center">Qty</th>
            <th className="py-2 text-end">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i} className="border-b border-navy-900/10">
              <td className="py-2">{item.name}</td>
              <td className="py-2 text-charcoal/70">
                {item.color}
                {item.color && item.size ? " / " : ""}
                {item.size}
              </td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-end">EGP {(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>EGP {order.itemsPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? "Free" : `EGP ${order.shippingPrice.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between border-t-2 border-navy-900 pt-1 text-base font-semibold text-navy-900">
            <span>Amount to Collect (COD)</span>
            <span>EGP {order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-10 text-sm">
        <div>
          <p className="mb-8 text-charcoal/60">Received by / استلمت بواسطة:</p>
          <p className="border-t border-navy-900/40 pt-1">Name &amp; Signature</p>
        </div>
        <div>
          <p className="mb-8 text-charcoal/60">Date / التاريخ:</p>
          <p className="border-t border-navy-900/40 pt-1">&nbsp;</p>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="border border-navy-900 bg-navy-900 px-6 py-2 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800"
        >
          Print
        </button>
      </div>
    </div>
  );
}
