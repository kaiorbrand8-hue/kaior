"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { createReview, ApiError } from "@/lib/api";
import type { Review } from "@/lib/types";

export default function ReviewsSection({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const alreadyReviewed = user && reviews.some((r) => r.user === user._id);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await createReview(productId, { rating, comment });
      setStatus("done");
      setComment("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit review");
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <h2 className="font-display text-2xl text-navy-900">{t("product.reviews")}</h2>

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-charcoal/50">{t("product.noReviews")}</p>
      ) : (
        <div className="mt-6 space-y-6">
          {reviews.map((r, i) => (
            <div key={i} className="border-b border-navy-900/10 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-gold-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
                <span className="text-sm font-medium text-navy-900">{r.name}</span>
              </div>
              {r.comment && <p className="mt-2 text-sm text-charcoal/70">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 max-w-lg">
        {!user ? (
          <p className="text-sm text-charcoal/60">
            <Link href="/login" className="text-gold-600 underline">
              {t("product.loginToReview")}
            </Link>{" "}
            {t("product.loginToReviewSuffix")}
          </p>
        ) : alreadyReviewed ? (
          <p className="text-sm text-charcoal/60">{t("product.alreadyReviewed")}</p>
        ) : status === "done" ? (
          <p className="text-sm font-medium text-gold-600">{t("product.thankYouReview")}</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest-lg text-navy-900">
              {t("product.writeReview")}
            </h3>
            <div className="flex gap-1 text-2xl text-gold-500">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)}>
                  {n <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("product.reviewPlaceholder")}
              rows={3}
              className="w-full border border-navy-900/20 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="border border-navy-900 bg-navy-900 px-6 py-2 text-sm uppercase tracking-widest-lg text-cream hover:bg-navy-800 disabled:opacity-50"
            >
              {status === "loading" ? t("product.submitting") : t("product.submitReview")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
