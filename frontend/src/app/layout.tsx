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
  title: "KAIOR — Men's Wear",
  description:
    "KAIOR Men's Wear — tailored, timeless menswear essentials. Sharp fits, premium fabrics, effortless elegance.",
  appleWebApp: {
    title: "KAIOR",
    statusBarStyle: "black-translucent",
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
