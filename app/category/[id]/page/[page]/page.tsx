"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";


type Product = {
  id: string;
  sourceId: string;
  title: string;
  author: string | null;
  price: number | null;
  currency: string;
  imageUrl: string;
  sourceUrl: string;
};

// Fetch paginated products
async function fetchProducts(categoryId: string, page: number) {
  const res = await fetch(
    `/api/categories/${categoryId}/products?page=${page}&limit=10`
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json() as Promise<Product[]>;
}

// Trigger on-demand scraping
async function scrapeCategory(categoryId: string, url: string) {
  const res = await fetch(`/api/scrape/${categoryId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Scraping failed");
  return res.json() as Promise<Product[]>;
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Query products
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products", params.id, page],
    queryFn: () => fetchProducts(params.id, page),
    // keeps showing last page while loading new
    placeholderData: (previousData) => previousData,
  });

  // Mutation to scrape fresh data
  const scrapeMutation = useMutation({
    mutationFn: () =>
      scrapeCategory(
        params.id,
        "https://www.worldofbooks.com/en-gb/collections/fiction-books"
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", params.id, page] });
    },
  });

  if (isLoading) return <p className="p-4">Loading products...</p>;
  if (isError) return <p className="p-4 text-red-500">Error loading products</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <button
            onClick={() => scrapeMutation.mutate()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
            disabled={scrapeMutation.isPending}
          >
            {scrapeMutation.isPending ? "Scraping..." : "Scrape Fresh Data"}
          </button>
        </div>

        {(!products || products.length === 0) && (
          <p className="p-4 text-center text-gray-500">No products found in this category.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products?.map((prod) => (
            <Link
              key={prod.id || prod.sourceId}
              href={`/product/${prod.id || prod.sourceId}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition block overflow-hidden"
            >
              {prod.imageUrl ? (
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-t-xl">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-1">
                  {prod.title}
                </h2>
                <p className="text-xs text-gray-500 mb-2">
                  {prod.author || "Unknown Author"}
                </p>
                <p className="text-sm font-bold text-blue-700">
                  {prod.price ? `${prod.price} ${prod.currency}` : "Price N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 border rounded-lg bg-white shadow">
            Page {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!products || (Array.isArray(products) && products.length < 10)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
