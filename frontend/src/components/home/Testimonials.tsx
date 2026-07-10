"use client";

import { useLanguage } from "@/context/LanguageContext";

const TESTIMONIALS = {
  en: [
    {
      quote:
        "The tailoring is impeccable — feels like a made-to-measure suit off the rack. KAIOR is my go-to now.",
      name: "Ahmed K.",
    },
    {
      quote: "Fabric quality is on another level. The shirts hold their shape wash after wash.",
      name: "Youssef R.",
    },
    {
      quote:
        "Sharp, minimal, and exactly what I look for in menswear. Delivery was fast too.",
      name: "Karim S.",
    },
  ],
  ar: [
    {
      quote: "التفصيل ممتاز — حاسس إني لابس بدلة مفصّلة مخصوص. KAIOR بقت وجهتي الأساسية.",
      name: "أحمد ك.",
    },
    {
      quote: "جودة الخامة مختلفة تماماً. القمصان بتحافظ على شكلها بعد كل غسلة.",
      name: "يوسف ر.",
    },
    {
      quote: "أنيق وبسيط وبالظبط اللي بدور عليه في الملابس الرجالي. والتوصيل كان سريع.",
      name: "كريم س.",
    },
  ],
};

export default function Testimonials() {
  const { locale, t } = useLanguage();
  const testimonials = TESTIMONIALS[locale];

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest-lg text-gold-600">
            {t("home.testimonialsEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy-900">{t("home.testimonialsTitle")}</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="relative bg-navy-900 p-8 text-cream">
              <span className="font-display text-4xl text-gold-500">&ldquo;</span>
              <p className="mt-2 text-sm leading-relaxed text-cream/85">{testimonial.quote}</p>
              <p className="mt-6 font-display text-sm text-gold-300">— {testimonial.name} —</p>
              <div className="mt-2 flex gap-0.5 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>&#9733;</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
