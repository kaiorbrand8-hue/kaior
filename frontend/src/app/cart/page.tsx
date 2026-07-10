"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateColor } from "@/lib/i18n/colors";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total } = useCart();
  const { locale, t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl text-navy-900">{t("cart.emptyTitle")}</h1>
        <p className="mt-3 text-sm text-charcoal/60">{t("cart.emptyText")}</p>
        <Link
          href="/shop"
          className="mt-8 inline-block border border-navy-900 bg-navy-900 px-8 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-navy-900">{t("cart.title")}</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 border-b border-navy-900/10 pb-6"
            >
              <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-navy-900">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-display text-base text-navy-900">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-charcoal/50">
                      {translateColor(item.color, locale)} / {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    aria-label={t("cart.remove")}
                    title={t("cart.remove")}
                    className="flex items-center gap-1 text-xs text-charcoal/40 hover:text-red-600"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-.8 12.2a2 2 0 0 1-2 1.8H8.8a2 2 0 0 1-2-1.8L6 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="hidden sm:inline">{t("cart.remove")}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-navy-900/20">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                      }
                      className="h-8 w-8 text-base"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                      }
                      className="h-8 w-8 text-base"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-medium text-navy-900">
                    {t("common.egp")} {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit border border-navy-900/10 bg-cream p-6">
          <h2 className="font-display text-lg text-navy-900">{t("cart.orderSummary")}</h2>
          <div className="mt-4 space-y-2 text-sm text-charcoal/70">
            <div className="flex justify-between">
              <span>{t("cart.subtotal")}</span>
              <span>
                {t("common.egp")} {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("cart.shipping")}</span>
              <span>{shipping === 0 ? t("cart.free") : `${t("common.egp")} ${shipping.toLocaleString()}`}</span>
            </div>
            {shipping > 0 && <p className="text-xs text-gold-600">{t("cart.freeShippingNote")}</p>}
          </div>
          <div className="mt-4 flex justify-between border-t border-navy-900/10 pt-4 text-base font-medium text-navy-900">
            <span>{t("cart.total")}</span>
            <span>
              {t("common.egp")} {total.toLocaleString()}
            </span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full border border-navy-900 bg-navy-900 py-3 text-center text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800"
          >
            {t("cart.proceedToCheckout")}
          </Link>
          <p className="mt-3 text-center text-xs text-charcoal/50">{t("cart.codNote")}</p>
        </div>
      </div>
    </div>
  );
}
