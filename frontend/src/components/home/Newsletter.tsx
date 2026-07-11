"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

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
    <section className="relative overflow-hidden bg-navy-950 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl"
      />
      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <span aria-hidden className="mx-auto mb-5 block h-px w-12 bg-gold-500" />
        <h2 className="font-display text-2xl text-cream sm:text-3xl">{t("home.newsletterTitle")}</h2>
        <p className="mt-3 text-sm text-cream/60">{t("home.newsletterText")}</p>

        {submitted ? (
          <p className="mt-6 text-sm font-medium text-gold-400">{t("home.newsletterThanks")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("home.newsletterPlaceholder")}
              className="w-full border border-cream/20 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-gold-400 focus:outline-none"
            />
            <button
              type="submit"
              className="border border-gold-500 bg-gold-500 px-6 py-3 text-sm uppercase tracking-widest-lg text-navy-950 transition-colors hover:bg-transparent hover:text-gold-400"
            >
              {t("home.newsletterSubmit")}
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
