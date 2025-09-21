"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

async function fetchProducts(id: string, page: string) {
  const res = await fetch(`/api/categories/${id}/products?page=${page}&limit=10`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function scrapeCategory(id: string, url: string) {
  const res = await fetch(`/api/scrape/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Scraping failed");
  return res.json();
}

export default function CategoryPage({
  params,
}: {
  params: { id: string; page: string };
}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", params.id, params.page],
    queryFn: () => fetchProducts(params.id, params.page),
  });

  const scrapeMutation = useMutation({
    mutationFn: () =>
      scrapeCategory(
        params.id,
        // 👇 for now hardcode Fiction category URL
        "https://www.worldofbooks.com/en-gb/collections/fiction-books"
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", params.id, params.page],
      });
    },
  });

  if (isLoading) return <p className="p-4">Loading products...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading products</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => scrapeMutation.mutate()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={scrapeMutation.isPending}
        >
          {scrapeMutation.isPending ? "Scraping..." : "Scrape Fresh Data"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((prod: any) => (
          <Link
            key={prod.id}
            href={`/product/${prod.id}`}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition block"
          >
            {prod.imageUrl && (
              <Image
                src={prod.imageUrl}
                alt={prod.title}
                width={150}
                height={200}
                className="mb-2 w-full h-40 object-cover rounded"
              />
            )}
            <h2 className="font-semibold">{prod.title}</h2>
            <p className="text-sm text-gray-600">{prod.author}</p>
            <p className="text-sm font-bold">
              {prod.price} {prod.currency}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
