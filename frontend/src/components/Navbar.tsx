"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { localizeField } from "@/lib/i18n/localize";
import SearchBox from "@/components/SearchBox";
import type { Category } from "@/lib/types";

export default function Navbar({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { locale, toggleLocale, t } = useLanguage();
  const pathname = usePathname();
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !searchOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the search dropdown on any click outside the search button/panel,
  // and whenever the route changes (e.g. clicking a nav link elsewhere).
  useEffect(() => {
    if (!searchOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchButtonRef.current?.contains(target)) return;
      if (searchBoxRef.current?.contains(target)) return;
      setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [searchOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close search whenever the route changes
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = categories.slice(0, 6);

  return (
    <header
      className={`sticky top-0 z-50 text-cream transition-colors duration-300 print:hidden ${
        transparent ? "bg-transparent" : "bg-navy-900 shadow-lg shadow-navy-950/20"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          className="lg:hidden text-cream"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="font-display text-2xl tracking-widest-lg text-gold-400 sm:text-3xl">
          KAIOR
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm uppercase tracking-wide">
          <Link
            href="/shop"
            className={`transition-colors hover:text-gold-400 ${pathname === "/shop" ? "text-gold-400" : ""}`}
          >
            {t("nav.shop")}
          </Link>
          {navLinks.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className={`transition-colors hover:text-gold-400 ${pathname === `/category/${cat.slug}` ? "text-gold-400" : ""}`}
            >
              {localizeField(cat, "name", locale)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLocale}
            className="text-xs font-semibold uppercase tracking-wide text-cream/80 hover:text-gold-400"
            aria-label="Toggle language"
          >
            {locale === "en" ? "AR" : "EN"}
          </button>

          <button
            ref={searchButtonRef}
            aria-label={t("nav.search")}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative group hidden sm:block">
            <Link href={user ? "/account" : "/login"} aria-label={t("nav.account")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
              </svg>
            </Link>
            {user && (
              <div className="invisible absolute end-0 top-full pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="w-44 rounded-sm border border-gold-500/20 bg-navy-800 py-2 text-sm shadow-xl">
                  <div className="px-4 py-1.5 text-gold-300/80 truncate">
                    {t("nav.hi")}, {user.name.split(" ")[0]}
                  </div>
                  <Link href="/account" className="block px-4 py-1.5 hover:text-gold-400">
                    {t("nav.myOrders")}
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-1.5 hover:text-gold-400">
                      {t("nav.adminDashboard")}
                    </Link>
                  )}
                  <button onClick={logout} className="block w-full px-4 py-1.5 text-start hover:text-gold-400">
                    {t("nav.logout")}
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link href="/cart" className="relative flex items-center gap-1" aria-label={t("nav.cart")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-navy-950">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div ref={searchBoxRef}>
          <SearchBox onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <nav className="lg:hidden flex flex-col gap-1 border-t border-gold-500/10 bg-navy-950 px-4 py-4 text-sm uppercase tracking-wide">
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="py-2 hover:text-gold-400">
            {t("nav.shop")}
          </Link>
          {navLinks.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-gold-400"
            >
              {localizeField(cat, "name", locale)}
            </Link>
          ))}
          <div className="mt-2 border-t border-gold-500/10 pt-2">
            {user ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-gold-400">
                  {t("nav.myOrders")}
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-gold-400">
                    {t("nav.adminDashboard")}
                  </Link>
                )}
                <button onClick={logout} className="block w-full py-2 text-start hover:text-gold-400">
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-gold-400">
                {t("nav.loginRegister")}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
