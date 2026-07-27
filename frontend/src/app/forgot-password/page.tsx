"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { forgotPassword, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="text-center font-display text-3xl text-navy-900">
        {t("auth.forgotPasswordTitle")}
      </h1>
      <p className="mt-2 text-center text-sm text-charcoal/60">{t("auth.forgotPasswordSubtitle")}</p>

      {submitted ? (
        <p className="mt-10 text-center text-sm font-medium text-gold-600">
          {t("auth.forgotPasswordSent")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
              {t("auth.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-navy-900 bg-navy-900 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800 disabled:opacity-50"
          >
            {loading ? t("auth.sending") : t("auth.sendResetLink")}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-charcoal/60">
        <Link href="/login" className="text-gold-600 underline">
          {t("auth.backToLogin")}
        </Link>
      </p>
    </div>
  );
}
