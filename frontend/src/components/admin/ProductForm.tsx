"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, deleteProduct, ApiError } from "@/lib/api";
import type { Category, Product, ProductVariant } from "@/lib/types";
import ImageUploader from "./ImageUploader";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

type FormState = {
  name: string;
  nameAr: string;
  category: string;
  price: string;
  compareAtPrice: string;
  fabric: string;
  fabricAr: string;
  shortDescription: string;
  shortDescriptionAr: string;
  description: string;
  descriptionAr: string;
  images: string[];
  colors: string;
  sizes: string[];
  featured: boolean;
  isNewArrival: boolean;
  active: boolean;
};

function toFormState(product?: Product): FormState {
  return {
    name: product?.name || "",
    nameAr: product?.nameAr || "",
    category: typeof product?.category === "string" ? product.category : product?.category?._id || "",
    price: product ? String(product.price) : "",
    compareAtPrice: product?.compareAtPrice ? String(product.compareAtPrice) : "",
    fabric: product?.fabric || "",
    fabricAr: product?.fabricAr || "",
    shortDescription: product?.shortDescription || "",
    shortDescriptionAr: product?.shortDescriptionAr || "",
    description: product?.description || "",
    descriptionAr: product?.descriptionAr || "",
    images: product?.images || [],
    colors: product?.colors.join(", ") || "",
    sizes: product?.sizes || [],
    featured: product?.featured || false,
    isNewArrival: product?.isNewArrival || false,
    active: product?.active ?? true,
  };
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product?.variants) {
      const map: Record<string, number> = {};
      product.variants.forEach((v) => {
        map[`${v.color}__${v.size}`] = v.stock;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initializing stock table from loaded product
      setStockMap(map);
    }
  }, [product]);

  const colorList = useMemo(
    () => form.colors.split(",").map((c) => c.trim()).filter(Boolean),
    [form.colors]
  );

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const setStock = (color: string, size: string, value: number) => {
    setStockMap((m) => ({ ...m, [`${color}__${size}`]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const variants: ProductVariant[] = [];
    colorList.forEach((color) => {
      form.sizes.forEach((size) => {
        variants.push({ color, size, stock: stockMap[`${color}__${size}`] ?? 0 });
      });
    });

    const payload = {
      name: form.name,
      nameAr: form.nameAr,
      category: form.category,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      fabric: form.fabric,
      fabricAr: form.fabricAr,
      shortDescription: form.shortDescription,
      shortDescriptionAr: form.shortDescriptionAr,
      description: form.description,
      descriptionAr: form.descriptionAr,
      images: form.images,
      colors: colorList,
      sizes: form.sizes,
      variants,
      featured: form.featured,
      isNewArrival: form.isNewArrival,
      active: form.active,
    };

    try {
      if (product) {
        await updateProduct(product._id, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await deleteProduct(product._id);
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Name (English)" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
        <TextField
          label="الاسم (عربي)"
          value={form.nameAr}
          onChange={(v) => setForm((f) => ({ ...f, nameAr: v }))}
          dir="rtl"
        />
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">Category</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
                {c.nameAr ? ` / ${c.nameAr}` : ""}
              </option>
            ))}
          </select>
        </div>
        <TextField
          label="Price (EGP)"
          type="number"
          value={form.price}
          onChange={(v) => setForm((f) => ({ ...f, price: v }))}
          required
        />
        <TextField
          label="Compare-at Price (optional)"
          type="number"
          value={form.compareAtPrice}
          onChange={(v) => setForm((f) => ({ ...f, compareAtPrice: v }))}
        />
        <TextField label="Fabric (English)" value={form.fabric} onChange={(v) => setForm((f) => ({ ...f, fabric: v }))} />
        <TextField
          label="الخامة (عربي)"
          value={form.fabricAr}
          onChange={(v) => setForm((f) => ({ ...f, fabricAr: v }))}
          dir="rtl"
        />
        <TextField
          label="Short Description (English)"
          value={form.shortDescription}
          onChange={(v) => setForm((f) => ({ ...f, shortDescription: v }))}
        />
        <TextField
          label="وصف مختصر (عربي)"
          value={form.shortDescriptionAr}
          onChange={(v) => setForm((f) => ({ ...f, shortDescriptionAr: v }))}
          dir="rtl"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
            Description (English)
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">
            الوصف (عربي)
          </label>
          <textarea
            dir="rtl"
            rows={4}
            value={form.descriptionAr}
            onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
            className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">
          Product Images (up to 8)
        </label>
        <ImageUploader
          images={form.images}
          onChange={(images) => setForm((f) => ({ ...f, images }))}
        />
      </div>

      <TextField
        label="Colors (comma-separated)"
        value={form.colors}
        onChange={(v) => setForm((f) => ({ ...f, colors: v }))}
        placeholder="Navy, Black, White"
      />

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">Sizes</label>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`h-9 w-9 border text-xs ${
                form.sizes.includes(size)
                  ? "border-navy-900 bg-navy-900 text-cream"
                  : "border-navy-900/20 text-charcoal/70"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {colorList.length > 0 && form.sizes.length > 0 && (
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">
            Stock per Variant
          </label>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-navy-900/10 px-3 py-2 text-left">Color \ Size</th>
                  {form.sizes.map((size) => (
                    <th key={size} className="border border-navy-900/10 px-3 py-2">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colorList.map((color) => (
                  <tr key={color}>
                    <td className="border border-navy-900/10 px-3 py-2 font-medium">{color}</td>
                    {form.sizes.map((size) => (
                      <td key={size} className="border border-navy-900/10 px-2 py-1">
                        <input
                          type="number"
                          min={0}
                          value={stockMap[`${color}__${size}`] ?? 0}
                          onChange={(e) => setStock(color, size, Number(e.target.value))}
                          className="w-16 border border-navy-900/10 px-2 py-1 text-center text-sm"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isNewArrival}
            onChange={(e) => setForm((f) => ({ ...f, isNewArrival: e.target.checked }))}
          />
          New Arrival
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          />
          Active (visible in shop)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="border border-navy-900 bg-navy-900 px-8 py-3 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800 disabled:opacity-50"
        >
          {submitting ? "Saving..." : product ? "Save Changes" : "Create Product"}
        </button>
        {product && (
          <button
            type="button"
            onClick={handleDelete}
            className="border border-red-600 px-8 py-3 text-sm uppercase tracking-widest-lg text-red-600 hover:bg-red-600 hover:text-white"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wide text-charcoal/60">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
      />
    </div>
  );
}
