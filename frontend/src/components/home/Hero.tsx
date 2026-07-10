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
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/10" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="mb-4 text-xs uppercase tracking-widest-lg text-gold-400">
          {t("home.heroEyebrow")}
        </p>
        <h1 className="font-display text-5xl leading-tight text-cream sm:text-6xl lg:text-7xl">
          {t("home.heroLine1")}
          <br />
          {t("home.heroLine2")}
        </h1>
        <div className="mt-8 flex flex-wrap gap-4">
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
    </section>
  );
}
