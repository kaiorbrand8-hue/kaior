"use client";

import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  ApiError,
} from "@/lib/api";
import type { Category } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY = { name: "", nameAr: "", description: "", descriptionAr: "", image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => getCategories().then(setCategories);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      nameAr: cat.nameAr || "",
      description: cat.description || "",
      descriptionAr: cat.descriptionAr || "",
      image: cat.image || "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save category");
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    await deleteCategory(cat._id);
    await load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-navy-900">Categories</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-3 border border-navy-900/10 bg-cream p-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest-lg text-navy-900">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>
        <input
          required
          placeholder="Name (English)"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
        <input
          dir="rtl"
          placeholder="الاسم (عربي)"
          value={form.nameAr}
          onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
          className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
        <input
          placeholder="Description (English)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
        <input
          dir="rtl"
          placeholder="الوصف (عربي)"
          value={form.descriptionAr}
          onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
          className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-charcoal/60">
            Category Image
          </label>
          <ImageUploader
            images={form.image ? [form.image] : []}
            onChange={(images) => setForm((f) => ({ ...f, image: images[0] || "" }))}
            multiple={false}
            max={1}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            className="border border-navy-900 bg-navy-900 px-6 py-2 text-xs uppercase tracking-widest-lg text-cream hover:bg-navy-800"
          >
            {editingId ? "Save Changes" : "Add Category"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-navy-900/20 px-6 py-2 text-xs uppercase tracking-widest-lg text-charcoal/70"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="mt-6 text-sm text-charcoal/50">Loading...</p>
      ) : (
        <div className="mt-8 space-y-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between border border-navy-900/10 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-navy-900">
                  {cat.name}
                  {cat.nameAr && <span className="text-charcoal/50"> / {cat.nameAr}</span>}
                </p>
                {cat.description && <p className="text-xs text-charcoal/50">{cat.description}</p>}
              </div>
              <div className="flex gap-4 text-xs uppercase tracking-wide">
                <button onClick={() => startEdit(cat)} className="text-gold-600 underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(cat)} className="text-red-600 underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
