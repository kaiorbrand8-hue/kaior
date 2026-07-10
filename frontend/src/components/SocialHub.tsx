"use client";

import { useEffect, useRef, useState } from "react";

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.11-1.55a9.9 9.9 0 0 0 4.93 1.31c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.81 14.02c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.12.09-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2.01.89 2.16.07.14.12.31.02.5-.1.2-.15.31-.3.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.2.72-.84.92-1.13.19-.29.39-.24.65-.14.27.1 1.69.8 1.98.94.29.15.48.22.55.35.07.12.07.7-.16 1.36Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="white" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M14 9h2.5V6.5H14C11.8 6.5 10 8.3 10 10.5V12H8v3h2v6h3v-6h2.4l.6-3H13v-1.2c0-.7.3-1.8 1-1.8Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M16.5 3c.3 2 1.7 3.6 3.5 4v3c-1.3 0-2.6-.4-3.5-1v6.5a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3a2.5 2.5 0 1 0 1.5 2.3V3h3Z" />
    </svg>
  );
}

export default function SocialHub() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201000000000";
  const whatsappMessage = encodeURIComponent("Hello KAIOR, I'd like to ask about a product.");

  const LINKS = [
    {
      key: "tiktok",
      href: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/@kaior.official",
      label: "TikTok",
      bg: "bg-black",
      icon: <TikTokIcon />,
    },
    {
      key: "facebook",
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/kaior.official",
      label: "Facebook",
      bg: "bg-[#1877F2]",
      icon: <FacebookIcon />,
    },
    {
      key: "instagram",
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/kaior.official",
      label: "Instagram",
      bg: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
      icon: <InstagramIcon />,
    },
    {
      key: "whatsapp",
      href: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      label: "WhatsApp",
      bg: "bg-[#25D366]",
      icon: <WhatsAppIcon />,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden" ref={wrapperRef}>
      <div className="relative h-14 w-14">
        {LINKS.map((link, i) => (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            tabIndex={open ? 0 : -1}
            style={{
              bottom: `${68 + i * 60}px`,
              transitionDelay: open ? `${i * 40}ms` : `${(LINKS.length - i) * 30}ms`,
            }}
            className={`absolute inset-x-0 mx-auto flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-navy-950/30 ring-2 ring-white/20 transition-all duration-300 ${link.bg} ${
              open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-75 opacity-0"
            }`}
          >
            {link.icon}
          </a>
        ))}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle social links"
          aria-expanded={open}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-500 bg-navy-900 text-gold-400 shadow-lg shadow-navy-950/40 transition-transform hover:scale-105"
        >
          <span className="relative block h-6 w-6">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`absolute inset-0 transition-all duration-300 ${
                open ? "scale-50 opacity-0" : "scale-100 opacity-100"
              }`}
            >
              <circle cx="18" cy="5" r="2.6" />
              <circle cx="6" cy="12" r="2.6" />
              <circle cx="18" cy="19" r="2.6" />
              <path d="M8.3 10.6 15.7 6.4M8.3 13.4l7.4 4.2" strokeLinecap="round" />
            </svg>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`absolute inset-0 transition-all duration-300 ${
                open ? "scale-100 opacity-100" : "scale-50 rotate-90 opacity-0"
              }`}
            >
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
