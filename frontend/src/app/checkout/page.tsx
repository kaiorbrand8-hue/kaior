"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateColor } from "@/lib/i18n/colors";
import { createOrder, ApiError } from "@/lib/api";
import {
  PAYMENT_NUMBER,
  calculateDeposit,
  paymentMethodLabel,
  buildOrderWhatsAppMessage,
  buildWhatsAppLink,
  type PaymentMethod,
} from "@/lib/payment";

type FormState = {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  building: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  city: "",
  area: "",
  street: "",
  building: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { locale, t } = useLanguage();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("instapay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefilling form once auth user resolves
      setForm((f) => ({ ...f, fullName: user.name, phone: user.phone || "" }));
    }
  }, [user]);

  if (authLoading || !user) {
    return <div className="py-24 text-center text-sm text-charcoal/50">{t("common.loading")}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-navy-900">{t("checkout.emptyCartTitle")}</h1>
        <Link href="/shop" className="mt-6 inline-block text-sm text-gold-600 underline">
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  const handleChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    // Open the tab synchronously (within the click's call stack) so browsers
    // don't treat it as an unrequested popup once the async order call resolves.
    const whatsappTab = window.open("", "_blank");
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          product: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shippingAddress: form,
        paymentMethod,
      });
      const message = buildOrderWhatsAppMessage({
        locale,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        depositAmount: order.depositAmount,
        paymentMethod: order.paymentMethod,
      });
      if (whatsappTab) whatsappTab.location.href = buildWhatsAppLink(PAYMENT_NUMBER, message);
      clearCart();
      router.push(`/order-confirmation/${order._id}`);
    } catch (err) {
      whatsappTab?.close();
      setError(err instanceof ApiError ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const deposit = calculateDeposit(total);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-navy-900">{t("checkout.title")}</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest-lg text-navy-900">
            {t("checkout.shippingAddress")}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("checkout.fullName")} value={form.fullName} onChange={handleChange("fullName")} required />
            <Field label={t("checkout.phone")} value={form.phone} onChange={handleChange("phone")} required />
            <Field label={t("checkout.city")} value={form.city} onChange={handleChange("city")} required />
            <Field label={t("checkout.area")} value={form.area} onChange={handleChange("area")} required />
            <Field label={t("checkout.street")} value={form.street} onChange={handleChange("street")} required />
            <Field label={t("checkout.building")} value={form.building} onChange={handleChange("building")} />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
              {t("checkout.notes")}
            </label>
            <textarea
              value={form.notes}
              onChange={handleChange("notes")}
              rows={3}
              className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest-lg text-navy-900">
              {t("checkout.paymentMethod")}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["instapay", "vodafone_cash"] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`border p-4 text-start transition-colors ${
                    paymentMethod === method
                      ? "border-gold-500 bg-cream"
                      : "border-navy-900/15 hover:border-navy-900/30"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-navy-900">
                    <span
                      className={`h-3.5 w-3.5 shrink-0 rounded-full border ${
                        paymentMethod === method ? "border-gold-500 bg-gold-500" : "border-navy-900/30"
                      }`}
                    />
                    {paymentMethodLabel(method, locale)}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 border border-navy-900/10 bg-cream p-4 text-sm">
              <p className="text-navy-900">
                {t("checkout.transferTo")} <span className="font-semibold">{PAYMENT_NUMBER}</span>
              </p>
              <p className="mt-1 text-charcoal/70">
                {t("checkout.minDeposit")}{" "}
                <span className="font-semibold text-navy-900">
                  {t("common.egp")} {deposit.toLocaleString()}
                </span>
              </p>
              <p className="mt-2 text-xs text-charcoal/60">{t("checkout.whatsappNote")}</p>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full border border-navy-900 bg-navy-900 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800 disabled:opacity-50 sm:w-auto sm:px-10"
          >
            {submitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
          </button>
        </form>

        <div className="h-fit border border-navy-900/10 bg-cream p-6">
          <h2 className="font-display text-lg text-navy-900">{t("cart.orderSummary")}</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                <span className="text-charcoal/70">
                  {item.name} ({translateColor(item.color, locale)}/{item.size}) x{item.quantity}
                </span>
                <span className="text-navy-900">
                  {t("common.egp")} {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-navy-900/10 pt-4 text-sm text-charcoal/70">
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
          </div>
          <div className="mt-4 flex justify-between border-t border-navy-900/10 pt-4 text-base font-medium text-navy-900">
            <span>{t("cart.total")}</span>
            <span>
              {t("common.egp")} {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">{label}</label>
      <input
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
      />
    </div>
  );
}
