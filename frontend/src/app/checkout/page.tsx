"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateColor } from "@/lib/i18n/colors";
import { createOrder, ApiError } from "@/lib/api";

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
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          product: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shippingAddress: form,
      });
      clearCart();
      router.push(`/order-confirmation/${order._id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

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

          <div className="border border-navy-900/10 bg-cream p-4">
            <p className="text-sm font-medium text-navy-900">{t("checkout.paymentMethod")}</p>
            <p className="mt-1 text-sm text-charcoal/60">{t("checkout.cod")}</p>
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
