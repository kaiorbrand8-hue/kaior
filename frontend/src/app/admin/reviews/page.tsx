"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllReviews, updateReviewStatus, deleteReview } from "@/lib/api";
import type { AdminReviewEntry, ReviewStatus } from "@/lib/types";

const STATUSES: ReviewStatus[] = ["pending", "approved", "rejected"];

const STATUS_STYLES: Record<ReviewStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminReviewsPage() {
  const [entries, setEntries] = useState<AdminReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () =>
    getAllReviews({ status: statusFilter || undefined, limit: 50 }).then((res) =>
      setEntries(res.items)
    );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off a fetch on filter change
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatus = async (productId: string, reviewId: string, status: ReviewStatus) => {
    setBusyId(reviewId);
    try {
      await updateReviewStatus(productId, reviewId, status);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (productId: string, reviewId: string) => {
    if (!confirm("Delete this review permanently?")) return;
    setBusyId(reviewId);
    try {
      await deleteReview(productId, reviewId);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-navy-900">Reviews</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-navy-900/20 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-charcoal/50">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="mt-6 text-sm text-charcoal/50">No reviews found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {entries.map(({ productId, productName, productSlug, review }) => (
            <div key={review._id} className="border border-navy-900/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/product/${productSlug}`}
                    target="_blank"
                    className="text-sm font-medium text-navy-900 hover:underline"
                  >
                    {productName}
                  </Link>
                  <p className="mt-1 text-xs text-charcoal/50">
                    {review.name} ·{" "}
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[review.status]}`}
                >
                  {review.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-gold-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              {review.comment && <p className="mt-2 text-sm text-charcoal/70">{review.comment}</p>}

              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-widest-lg">
                {review.status !== "approved" && (
                  <button
                    disabled={busyId === review._id}
                    onClick={() => handleStatus(productId, review._id!, "approved")}
                    className="border border-green-600 px-4 py-1.5 text-green-700 hover:bg-green-600 hover:text-white disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {review.status !== "rejected" && (
                  <button
                    disabled={busyId === review._id}
                    onClick={() => handleStatus(productId, review._id!, "rejected")}
                    className="border border-red-600 px-4 py-1.5 text-red-700 hover:bg-red-600 hover:text-white disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                {review.status !== "pending" && (
                  <button
                    disabled={busyId === review._id}
                    onClick={() => handleStatus(productId, review._id!, "pending")}
                    className="border border-navy-900/30 px-4 py-1.5 text-charcoal/70 hover:bg-navy-900 hover:text-cream disabled:opacity-50"
                  >
                    Reset to Pending
                  </button>
                )}
                <button
                  disabled={busyId === review._id}
                  onClick={() => handleDelete(productId, review._id!)}
                  className="border border-navy-900/30 px-4 py-1.5 text-charcoal/50 hover:bg-navy-900/5 disabled:opacity-50"
                >
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
