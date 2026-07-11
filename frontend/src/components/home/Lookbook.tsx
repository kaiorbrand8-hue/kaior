"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import {
  DEFAULT_LOOKBOOK_FEATURE,
  DEFAULT_LOOKBOOK_KNITWEAR,
  DEFAULT_LOOKBOOK_MAIN,
  DEFAULT_LOOKBOOK_SUITING,
} from "@/lib/homepageDefaults";
import Reveal from "./Reveal";

export default function Lookbook({
  mainImage,
  featureImage,
  suitingImage,
  knitwearImage,
}: {
  mainImage?: string;
  featureImage?: string;
  suitingImage?: string;
  knitwearImage?: string;
}) {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-20">
      <Reveal className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-widest-lg text-gold-600">{t("home.lookbookEyebrow")}</p>
        <h2 className="mt-3 font-display text-3xl text-navy-900">{t("home.lookbookTitle")}</h2>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
        <Reveal className="group relative aspect-[4/5] overflow-hidden bg-navy-950 sm:aspect-auto">
          <Image
            src={mainImage || DEFAULT_LOOKBOOK_MAIN}
            alt="KAIOR lookbook"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Reveal>

        <Reveal
          delay={100}
          className="relative flex min-h-[280px] flex-col justify-center overflow-hidden bg-navy-800 px-10 py-10 text-cream"
        >
          <Image
            src={featureImage || DEFAULT_LOOKBOOK_FEATURE}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />
          <div className="relative">
            <h3 className="font-display text-4xl">KAIOR</h3>
            <p className="mt-3 text-lg text-gold-300">{t("home.lookbookHeading")}</p>
            <p className="mt-3 max-w-xs text-sm text-cream/70">{t("home.lookbookText")}</p>
          </div>
        </Reveal>

        <Reveal delay={150} className="group relative aspect-[4/3] overflow-hidden bg-navy-900">
          <Image
            src={suitingImage || DEFAULT_LOOKBOOK_SUITING}
            alt="Suiting"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Reveal>
        <Reveal delay={200} className="group relative aspect-[4/3] overflow-hidden bg-navy-900">
          <Image
            src={knitwearImage || DEFAULT_LOOKBOOK_KNITWEAR}
            alt="Knitwear"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Reveal>
      </div>
    </section>
  );
}
