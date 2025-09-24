"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string;
  sourceId: string;
  title: string;
  author: string | null;
  price: number | null;
  currency: string;
  imageUrl: string;
  sourceUrl: string;
  lastScrapedAt?: string | null;
};

async function fetchProduct(id: string) {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

async function fetchRelated(id: string) {
  const res = await fetch(`/api/products/${id}/related`);
  if (!res.ok) throw new Error("Failed to fetch related products");
  return res.json() as Promise<Product[]>;
}

async function addToFavourites(productId: string) {
  const res = await fetch(`/api/favourites/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to add favourite");
  return res.json();
}

async function fetchReviews(productId: string) {
  const res = await fetch(`/api/reviews/product/${productId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

async function addReview(productId: string, review: { rating: number; comment?: string }) {
  const res = await fetch(`/api/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error("Failed to add review");
  return res.json();
}

export default function ProductPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => fetchProduct(params.id as string),
  });

  const { data: related } = useQuery({
    queryKey: ["related", params.id],
    queryFn: () => fetchRelated(params.id as string),
    enabled: !!product,
  });

  const favouriteMutation = useMutation({
    mutationFn: () => addToFavourites(params.id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      alert("✅ Added to favourites");
    },
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", params.id],
    queryFn: () => fetchReviews(params.id as string),
  });

  const addReviewMutation = useMutation({
    mutationFn: (review: { rating: number; comment?: string }) =>
      addReview(params.id as string, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", params.id] });
      setComment("");
      setRating(5);
    },
  });

  if (isLoading) return <div className="p-8 text-center">Loading product...</div>;
  if (!product) return <div className="p-8 text-center text-red-500">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          <div className="md:w-1/3">
            {product.imageUrl ? (
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill={true}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 px-4 text-center">No Image Available</span>
              </div>
            )}
          </div>

          <div className="md:w-2/3 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
            <p className="text-lg sm:text-xl text-gray-600">{product.author || "Unknown Author"}</p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {product.price ? `${product.price} ${product.currency}` : "Price not available"}
              </p>
              <button
                onClick={() => favouriteMutation.mutate()}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={favouriteMutation.isPending}
              >
                {favouriteMutation.isPending ? "Adding..." : "❤️ Add to Favourites"}
              </button>
            </div>

            {product.lastScrapedAt && (
              <p className="text-sm text-gray-500">
                Last updated: {new Date(product.lastScrapedAt).toLocaleString()}
              </p>
            )}

            <Link
              href={product.sourceUrl}
              target="_blank"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
            >
              View on World of Books
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related && related.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/product/${r.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-3 sm:p-4 flex flex-col h-full"
              >
                {r.imageUrl ? (
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-3">
                    <Image
                      src={r.imageUrl}
                      alt={r.title}
                      fill={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-200 rounded-md flex items-center justify-center mb-3">
                    <span className="text-gray-500 px-2 text-center text-sm">No Image</span>
                  </div>
                )}
                <h3 className="font-medium text-gray-900 line-clamp-2 flex-grow">{r.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{r.author || "Unknown Author"}</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {r.price ? `${r.price} ${r.currency}` : "Price N/A"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>

        {/* Add Review Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addReviewMutation.mutate({ rating, comment });
          }}
          className="mb-8 p-4 border rounded-lg bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {"⭐".repeat(r)} ({r})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Share your thoughts..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={addReviewMutation.isPending}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* Reviews List */}
        {isLoadingReviews ? (
          <div className="text-center py-4">Loading reviews...</div>
        ) : reviews?.length === 0 ? (
          <p className="text-center text-gray-600">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews?.map((rev: any) => (
              <div key={rev.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{rev.user?.name || "Anonymous"}</span>
                    <span className="text-yellow-500">{"⭐".repeat(rev.rating)}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{rev.comment || "No comment"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
