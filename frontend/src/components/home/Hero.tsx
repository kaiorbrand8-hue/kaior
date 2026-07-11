"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { DEFAULT_HERO_IMAGE } from "@/lib/homepageDefaults";

export default function Hero({ image }: { image?: string }) {
  const { t } = useLanguage();

  return (
    <section className="relative -mt-20 flex h-[80vh] min-h-[560px] items-end overflow-hidden bg-navy-950">
      <Image
        src={image || DEFAULT_HERO_IMAGE}
        alt="KAIOR Men's Wear"
        fill
        priority
        className="hero-zoom object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/10" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <p
          className="hero-fade-up mb-4 text-xs uppercase tracking-widest-lg text-gold-400"
          style={{ animationDelay: "0.1s" }}
        >
          {t("home.heroEyebrow")}
        </p>
        <h1
          className="hero-fade-up font-display text-5xl leading-tight text-cream sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.28s" }}
        >
          {t("home.heroLine1")}
          <br />
          <span className="text-gold-400">{t("home.heroLine2")}</span>
        </h1>
        <div
          className="hero-fade-up mt-8 flex flex-wrap gap-4"
          style={{ animationDelay: "0.46s" }}
        >
          <Link
            href="/shop"
            className="border border-gold-500 bg-gold-500 px-8 py-3 text-sm uppercase tracking-widest-lg text-navy-950 transition-colors hover:bg-transparent hover:text-gold-400"
          >
            {t("home.shopNow")}
          </Link>
          <Link
            href="/shop?isNewArrival=true"
            className="border border-cream/40 px-8 py-3 text-sm uppercase tracking-widest-lg text-cream transition-colors hover:border-gold-400 hover:text-gold-400"
          >
            {t("home.newArrivals")}
          </Link>
        </div>
      </div>

      <div
        aria-hidden
        className="scroll-cue pointer-events-none absolute bottom-6 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="h-8 w-px bg-cream/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
      </div>
    </section>
  );
}
