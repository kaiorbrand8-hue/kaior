"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { resetPassword, ApiError } from "@/lib/api";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useLanguage();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.passwordsDontMatch"));
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-navy-900">{t("auth.resetSuccessTitle")}</h1>
        <p className="mt-3 text-sm text-charcoal/60">{t("auth.resetSuccessText")}</p>
        <Link
          href="/login"
          className="mt-8 inline-block border border-navy-900 bg-navy-900 px-8 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800"
        >
          {t("auth.logIn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="text-center font-display text-3xl text-navy-900">
        {t("auth.resetPasswordTitle")}
      </h1>
      <p className="mt-2 text-center text-sm text-charcoal/60">{t("auth.resetPasswordSubtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
            {t("auth.newPassword")}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
            {t("auth.confirmPassword")}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-navy-900 bg-navy-900 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800 disabled:opacity-50"
        >
          {loading ? t("auth.resetting") : t("auth.resetPassword")}
        </button>
      </form>
    </div>
  );
}
