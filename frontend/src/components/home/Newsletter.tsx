"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl text-navy-900 sm:text-3xl">{t("home.newsletterTitle")}</h2>
        <p className="mt-3 text-sm text-charcoal/60">{t("home.newsletterText")}</p>

        {submitted ? (
          <p className="mt-6 text-sm font-medium text-gold-600">{t("home.newsletterThanks")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("home.newsletterPlaceholder")}
              className="border border-navy-900/20 bg-white px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-navy-900 px-4 py-3 text-sm uppercase tracking-widest-lg text-gold-400 transition-colors hover:bg-navy-800"
            >
              {t("home.newsletterSubmit")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
