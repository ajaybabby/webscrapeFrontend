"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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

// Fetch search results
async function searchProducts(query: string, page: number) {
  const res = await fetch(`/api/search?q=${query}&page=${page}&limit=10`);
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json() as Promise<Product[]>;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["search", query, page],
    queryFn: () => searchProducts(query, page),
    enabled: !!query, // only run if query exists
  });

  if (!query) {
    return <p className="p-4 text-gray-500">Please enter a search term.</p>;
  }

  if (isLoading) return <p className="p-4">Loading search results...</p>;
  if (isError) return <p className="p-4 text-red-500">Error loading results.</p>;
  if (!products || products.length === 0) {
    return <p className="p-4">No results found for "{query}".</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <Link
            key={prod.id || prod.sourceId}
            href={`/product/${prod.id || prod.sourceId}`}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition block"
          >
            {prod.imageUrl ? (
              <Image
                src={prod.imageUrl}
                alt={prod.title}
                width={150}
                height={200}
                className="mb-2 w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <h2 className="font-semibold text-sm line-clamp-2">{prod.title}</h2>
            <p className="text-xs text-gray-600">{prod.author || "Unknown Author"}</p>
            <p className="text-sm font-bold mt-1">
              {prod.price ? `${prod.price} ${prod.currency}` : "Price N/A"}
            </p>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 sm:mt-8">
        {page > 1 && (
          <Link
            href={`/search?q=${query}&page=${page - 1}`}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-200 rounded hover:bg-gray-300 transition duration-200"
          >
            Previous
          </Link>
        )}
        <span className="text-sm text-gray-700">Page {page}</span>
        {products.length === 10 && (
          <Link
            href={`/search?q=${query}&page=${page + 1}`}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-200 rounded hover:bg-gray-300 transition duration-200"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
