"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

async function fetchFavourites() {
  const res = await fetch(`/api/favourites`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch favourites");
  return res.json();
}

export default function FavouritesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["favourites"],
    queryFn: fetchFavourites,
  });

  if (isLoading) return <p className="p-4">Loading favourites...</p>;
  if (isError) return <p className="text-red-500">Error loading favourites</p>;
  if (!data || data.length === 0)
    return <p className="p-4 text-center text-gray-600">No favourites yet. Go add some ❤️</p>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Favourites</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((fav: any) => (
          <Link
            key={fav.id}
            href={`/product/${fav.product.id}`}
            className="p-4 bg-white rounded shadow hover:shadow-lg transition"
          >
            {fav.product.imageUrl ? (
              <Image
                src={fav.product.imageUrl}
                alt={fav.product.title}
                width={150}
                height={200}
                className="mb-2 w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <h2 className="font-semibold text-sm line-clamp-2">
              {fav.product.title}
            </h2>
            <p className="text-xs text-gray-600">
              {fav.product.author || "Unknown Author"}
            </p>
            {fav.product.price && (
              <p className="text-sm font-bold mt-1">
                {fav.product.price} {fav.product.currency}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
