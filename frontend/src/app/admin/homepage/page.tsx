"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import { getSiteSettings, updateSiteSettings, ApiError } from "@/lib/api";
import { DEFAULT_HERO_IMAGE, DEFAULT_LOOKBOOK_MAIN } from "@/lib/homepageDefaults";
import type { SiteSettings } from "@/lib/types";

const EMPTY: SiteSettings = {
  heroImage: "",
  lookbookMainImage: "",
  lookbookFeatureImage: "",
  lookbookSuitingImage: "",
  lookbookKnitwearImage: "",
};

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

  const setField = (field: keyof SiteSettings) => (urls: string[]) => {
    setSettings((s) => ({ ...s, [field]: urls[0] || "" }));
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
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-navy-900">Homepage Images</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Control the hero banner and lookbook photos shown on the homepage. Leave a field empty to
        use the default placeholder.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">
            Hero Banner (full-width image behind &ldquo;Tailored. Refined. Timeless.&rdquo;)
          </label>
          <ImageUploader
            images={settings.heroImage ? [settings.heroImage] : []}
            onChange={setField("heroImage")}
            multiple={false}
            max={1}
          />
          {!settings.heroImage && (
            <p className="mt-1 text-xs text-charcoal/40">Currently using default: {DEFAULT_HERO_IMAGE}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">
            Lookbook — Large Left Photo
          </label>
          <ImageUploader
            images={settings.lookbookMainImage ? [settings.lookbookMainImage] : []}
            onChange={setField("lookbookMainImage")}
            multiple={false}
            max={1}
          />
          {!settings.lookbookMainImage && (
            <p className="mt-1 text-xs text-charcoal/40">Currently using default: {DEFAULT_LOOKBOOK_MAIN}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">
            Lookbook — Top Right Panel Background (behind the &ldquo;KAIOR / Tailored
            Confidence&rdquo; text)
          </label>
          <ImageUploader
            images={settings.lookbookFeatureImage ? [settings.lookbookFeatureImage] : []}
            onChange={setField("lookbookFeatureImage")}
            multiple={false}
            max={1}
          />
          {!settings.lookbookFeatureImage && (
            <p className="mt-1 text-xs text-charcoal/40">Using default placeholder</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">
              Lookbook — Bottom Left Photo (&ldquo;Suiting&rdquo;)
            </label>
            <ImageUploader
              images={settings.lookbookSuitingImage ? [settings.lookbookSuitingImage] : []}
              onChange={setField("lookbookSuitingImage")}
              multiple={false}
              max={1}
            />
            {!settings.lookbookSuitingImage && (
              <p className="mt-1 text-xs text-charcoal/40">Using default placeholder</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">
              Lookbook — Bottom Right Photo (&ldquo;Knitwear&rdquo;)
            </label>
            <ImageUploader
              images={settings.lookbookKnitwearImage ? [settings.lookbookKnitwearImage] : []}
              onChange={setField("lookbookKnitwearImage")}
              multiple={false}
              max={1}
            />
            {!settings.lookbookKnitwearImage && (
              <p className="mt-1 text-xs text-charcoal/40">Using default placeholder</p>
            )}
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-4 text-sm font-medium text-gold-600">Homepage images saved.</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 border border-navy-900 bg-navy-900 px-8 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
