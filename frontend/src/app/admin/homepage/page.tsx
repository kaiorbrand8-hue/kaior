"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, updateSiteSettings, uploadImages, ApiError } from "@/lib/api";
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_LOOKBOOK_FEATURE,
  DEFAULT_LOOKBOOK_KNITWEAR,
  DEFAULT_LOOKBOOK_MAIN,
  DEFAULT_LOOKBOOK_SUITING,
} from "@/lib/homepageDefaults";
import type { SiteSettings } from "@/lib/types";

const EMPTY: SiteSettings = {
  heroImage: "",
  lookbookMainImage: "",
  lookbookFeatureImage: "",
  lookbookSuitingImage: "",
  lookbookKnitwearImage: "",
};

function ImageSlot({
  value,
  fallback,
  onChange,
  className = "",
  children,
}: {
  value: string;
  fallback: string;
  onChange: (url: string) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const [url] = await uploadImages([file]);
      onChange(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`group relative overflow-hidden bg-navy-950 ${className}`}>
      <Image src={value || fallback} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
      {children}

      {!value && (
        <span className="absolute start-2 top-2 border border-gold-400/50 bg-navy-950/70 px-2 py-1 text-[10px] uppercase tracking-widest-lg text-gold-400">
          Default
        </span>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-950/0 opacity-0 transition-all duration-300 group-hover:bg-navy-950/65 group-hover:opacity-100">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border border-gold-400 bg-navy-950/80 px-4 py-2 text-xs uppercase tracking-widest-lg text-gold-400 transition-colors hover:bg-gold-500 hover:text-navy-950 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Change Photo"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[11px] uppercase tracking-wide text-cream/70 underline decoration-cream/30 underline-offset-2 hover:text-cream"
          >
            Reset to default
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />

      {error && (
        <p className="absolute inset-x-0 bottom-0 bg-red-600/90 px-2 py-1 text-[10px] text-white">{error}</p>
      )}
    </div>
  );
}

export default function AdminHomepagePage() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const setField = (field: keyof SiteSettings, url: string) => {
    setSettings((s) => ({ ...s, [field]: url }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateSiteSettings(settings);
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save homepage images");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-charcoal/50">Loading...</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-navy-900">Homepage Images</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Hover a photo to replace it — this is exactly how it will look on the homepage.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="whitespace-nowrap border border-navy-900/20 px-4 py-2 text-xs uppercase tracking-widest-lg text-navy-900 transition-colors hover:border-gold-500 hover:text-gold-600"
        >
          View Live Homepage ↗
        </Link>
      </div>

      <div className="mt-10">
        <p className="text-xs uppercase tracking-widest-lg text-gold-600">Hero Banner</p>
        <p className="mt-1 text-sm text-charcoal/50">
          Full-width image behind &ldquo;Tailored. Refined. Timeless.&rdquo;
        </p>
        <ImageSlot
          value={settings.heroImage}
          fallback={DEFAULT_HERO_IMAGE}
          onChange={(url) => setField("heroImage", url)}
          className="mt-3 aspect-[21/9]"
        />
      </div>

      <div className="mt-12">
        <p className="text-xs uppercase tracking-widest-lg text-gold-600">The Lookbook</p>
        <p className="mt-1 text-sm text-charcoal/50">
          The four-photo grid shown further down the homepage.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ImageSlot
            value={settings.lookbookMainImage}
            fallback={DEFAULT_LOOKBOOK_MAIN}
            onChange={(url) => setField("lookbookMainImage", url)}
            className="aspect-[4/5]"
          />
          <ImageSlot
            value={settings.lookbookFeatureImage}
            fallback={DEFAULT_LOOKBOOK_FEATURE}
            onChange={(url) => setField("lookbookFeatureImage", url)}
            className="aspect-[4/5]"
          >
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-center bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/10 px-5">
              <p className="font-display text-2xl text-cream">KAIOR</p>
              <p className="mt-1 text-sm text-gold-300">Tailored Confidence</p>
            </div>
          </ImageSlot>
          <ImageSlot
            value={settings.lookbookSuitingImage}
            fallback={DEFAULT_LOOKBOOK_SUITING}
            onChange={(url) => setField("lookbookSuitingImage", url)}
            className="aspect-[4/3]"
          />
          <ImageSlot
            value={settings.lookbookKnitwearImage}
            fallback={DEFAULT_LOOKBOOK_KNITWEAR}
            onChange={(url) => setField("lookbookKnitwearImage", url)}
            className="aspect-[4/3]"
          />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-navy-900/10 pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-navy-900 bg-navy-900 px-8 py-3 text-sm uppercase tracking-widest-lg text-cream transition-colors hover:bg-navy-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && !error && <p className="text-sm font-medium text-gold-600">Homepage images saved.</p>}
      </div>
    </div>
  );
}
