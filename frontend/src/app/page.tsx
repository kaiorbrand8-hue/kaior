import Hero from "@/components/home/Hero";
import Essence from "@/components/home/Essence";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import Lookbook from "@/components/home/Lookbook";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { getCategories, getProducts, getSiteSettings } from "@/lib/api";

export default async function Home() {
  const [categories, featured, settings] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ featured: true, limit: 8 }).catch(() => ({ items: [], page: 1, pages: 1, total: 0 })),
    getSiteSettings().catch(() => null),
  ]);

  return (
    <>
      <Hero image={settings?.heroImage} />
      <Essence />
      <CategoryGrid categories={categories} />
      <FeaturedCollection products={featured.items} />
      <Lookbook
        mainImage={settings?.lookbookMainImage}
        featureImage={settings?.lookbookFeatureImage}
        suitingImage={settings?.lookbookSuitingImage}
        knitwearImage={settings?.lookbookKnitwearImage}
      />
      <Testimonials />
      <Newsletter />
    </>
  );
}
