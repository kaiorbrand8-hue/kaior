import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialHub from "@/components/SocialHub";
import PwaRegister from "@/components/PwaRegister";
import { getCategories } from "@/lib/api";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaiorshope.com"),
  title: "KAIOR — Men's Wear",
  description:
    "KAIOR Men's Wear — tailored, timeless menswear essentials. Sharp fits, premium fabrics, effortless elegance.",
  appleWebApp: {
    title: "KAIOR",
    statusBarStyle: "black-translucent",
  },
  verification: {
    google: "PBa2_9ieyegTn-wIvkWuJNrEtUn1nxkGMgIxqHAREjg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0E27",
};

// Runs before hydration so a returning Arabic-preference visitor doesn't see
// an LTR flash while React mounts and LanguageContext reads localStorage.
const setInitialDirScript = `
try {
  var l = localStorage.getItem('kaior_locale');
  if (l === 'ar') {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }
} catch (e) {}
`;

// Tells Google this domain is the official site for the KAIOR brand, and
// links it to our social profiles — helps brand-name searches ("kaior")
// resolve to this site instead of unrelated results.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KAIOR",
  url: "https://kaiorshope.com",
  logo: "https://kaiorshope.com/icon-512.png",
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_TIKTOK_URL,
  ].filter(Boolean),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories().catch(() => []);

  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialDirScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">
        <Providers>
          <Navbar categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer categories={categories} />
          <SocialHub />
          <PwaRegister />
        </Providers>
      </body>
    </html>
  );
}
