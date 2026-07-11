"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Essence() {
  const { t } = useLanguage();

  const pillars = [
    {
      title: t("home.pillarFitTitle"),
      description: t("home.pillarFitDesc"),
      icon: (
        <path d="M12 3v4M5 8l7 4 7-4M5 8l1 10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-10M12 12v9" />
      ),
    },
    {
      title: t("home.pillarFabricTitle"),
      description: t("home.pillarFabricDesc"),
      icon: <path d="M6 3l3 3-3 3M12 3l3 3-3 3M18 3l3 3-3 3M4 21h16M6 12v9M18 12v9" />,
    },
    {
      title: t("home.pillarBuiltTitle"),
      description: t("home.pillarBuiltDesc"),
      icon: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4Z" />,
    },
  ];

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs uppercase tracking-widest-lg text-gold-600">{t("home.essenceEyebrow")}</p>
          <h2 className="mt-3 font-display text-2xl text-navy-900 sm:text-3xl">
            {t("home.essenceTitle")}
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute inset-x-20 top-10 hidden h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent sm:block"
          />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 100} className="group flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/30 bg-cream transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold-500 group-hover:shadow-[0_0_0_6px_rgba(201,162,39,0.1)]">
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gold-600"
                  >
                    {pillar.icon}
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-widest-lg text-navy-900">
                  {pillar.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-charcoal/60">{pillar.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
