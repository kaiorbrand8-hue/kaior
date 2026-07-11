"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({ name, email, password, phone });
      router.push("/account");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="text-center font-display text-3xl text-navy-900">{t("auth.createAccount")}</h1>
      <p className="mt-2 text-center text-sm text-charcoal/60">{t("auth.registerSubtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
            {t("auth.fullName")}
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
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
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
            {t("auth.phone")}
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
            {t("auth.password")}
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-navy-900 bg-navy-900 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800 disabled:opacity-50"
        >
          {loading ? t("auth.creating") : t("auth.createAccount")}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-charcoal/40">
        <div className="h-px flex-1 bg-navy-900/10" />
        or
        <div className="h-px flex-1 bg-navy-900/10" />
      </div>

      <GoogleSignInButton onSuccess={() => router.push("/account")} onError={setError} />

      <p className="mt-6 text-center text-sm text-charcoal/60">
        {t("auth.alreadyHaveAccount")}{" "}
        <Link href="/login" className="text-gold-600 underline">
          {t("auth.logIn")}
        </Link>
      </p>
    </div>
  );
}
