"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getReviews, type SentimentAnalysis } from "@/lib/api";
import { formatDate, getSentimentColor, getSentimentIcon } from "@/lib/utils";

export interface ReviewListRef {
  refresh: () => void;
}

const ReviewList = forwardRef<ReviewListRef>((props, ref) => {
  const [reviews, setReviews] = useState<SentimentAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit] = useState(3);

  const fetchReviews = async (pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getReviews(pageNum, limit);
      setReviews(response.reviews);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setPage(response.page);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchReviews(1);
  };

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  useEffect(() => {
    fetchReviews(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchReviews(newPage);
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Review History</h2>
          <div className="text-sm text-gray-600">Total: {total} reviews</div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reviews found</p>
            <p className="text-gray-400 text-sm mt-2">
              Start by analyzing some text!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getSentimentIcon(review.label)}
                      </span>
                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                            review.label
                          )}`}
                        >
                          {review.label}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          Confidence: {(review.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>

                  <p className="text-gray-900 mb-4 leading-relaxed">
                    {review.text}
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Positive</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${review.score.positiveScore * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12">
                          {(review.score.positiveScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Negative</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${review.score.negativeScore * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12">
                          {(review.score.negativeScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Neutral</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full"
                            style={{
                              width: `${review.score.neutralScore * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12">
                          {(review.score.neutralScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Page</span>
                  <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg">
                    {page} of {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

ReviewList.displayName = "ReviewList";

export default ReviewList;
