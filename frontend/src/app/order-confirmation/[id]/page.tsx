"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { translateColor } from "@/lib/i18n/colors";
import { getOrderById, ApiError } from "@/lib/api";
import type { Order } from "@/lib/types";
import {
  PAYMENT_NUMBER,
  paymentMethodLabel,
  buildOrderWhatsAppMessage,
  buildWhatsAppLink,
} from "@/lib/payment";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load order"));
  }, [id]);

  if (error) {
    return <div className="py-24 text-center text-sm text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="py-24 text-center text-sm text-charcoal/50">{t("common.loading")}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A0E27" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="font-display text-3xl text-navy-900">{t("orderConfirmation.thankYou")}</h1>
      <p className="mt-3 text-sm text-charcoal/60">
        {t("orderConfirmation.order")}{" "}
        <span className="font-medium text-navy-900">{order.orderNumber}</span>{" "}
        {t("orderConfirmation.placed")}
      </p>

      <div className="mt-10 border border-navy-900/10 bg-cream p-6 text-start">
        <h2 className="text-sm font-semibold uppercase tracking-widest-lg text-navy-900">
          {t("orderConfirmation.details")}
        </h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-charcoal/70">
                {item.name} ({translateColor(item.color || "", locale)}/{item.size}) x{item.quantity}
              </span>
              <span className="text-navy-900">
                {t("common.egp")} {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-navy-900/10 pt-4 text-base font-medium text-navy-900">
          <span>{t("orderConfirmation.total")}</span>
          <span>
            {t("common.egp")} {order.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-6 border border-gold-500/40 bg-cream p-6 text-start">
        <h2 className="text-sm font-semibold uppercase tracking-widest-lg text-navy-900">
          {t("orderConfirmation.paymentTitle")}
        </h2>
        <p className="mt-2 text-sm text-charcoal/70">
          {t("orderConfirmation.paymentInstructions").replace(
            "{method}",
            paymentMethodLabel(order.paymentMethod, locale)
          )}
        </p>
        <p className="mt-2 text-sm text-charcoal/70">
          {t("checkout.transferTo")} <span className="font-semibold text-navy-900">{PAYMENT_NUMBER}</span>
        </p>
        <p className="mt-1 text-sm text-charcoal/70">
          {t("checkout.minDeposit")}{" "}
          <span className="font-semibold text-navy-900">
            {t("common.egp")} {(order.depositAmount || 0).toLocaleString()}
          </span>
        </p>
        <a
          href={buildWhatsAppLink(
            PAYMENT_NUMBER,
            buildOrderWhatsAppMessage({
              locale,
              orderNumber: order.orderNumber,
              totalPrice: order.totalPrice,
              depositAmount: order.depositAmount || 0,
              paymentMethod: order.paymentMethod,
            })
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1fb959]"
        >
          {t("orderConfirmation.sendProof")}
        </a>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/account"
          className="border border-navy-900 bg-navy-900 px-8 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800"
        >
          {t("orderConfirmation.viewOrders")}
        </Link>
        <Link
          href="/shop"
          className="border border-navy-900/20 px-8 py-3 text-sm uppercase tracking-widest-lg text-navy-900 hover:border-navy-900"
        >
          {t("orderConfirmation.continueShopping")}
        </Link>
      </div>
    </div>
  );
}
