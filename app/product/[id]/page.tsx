"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";

async function fetchProduct(id: string) {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-4">Loading product...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading product</p>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {data.imageUrl && (
          <Image
            src={data.imageUrl}
            alt={data.title}
            width={200}
            height={300}
            className="rounded shadow"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-lg text-gray-600">{data.author}</p>
          <p className="mt-2 font-bold text-xl">
            {data.price} {data.currency}
          </p>
          {data.details && (
            <div className="mt-4">
              <p>{data.details.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                ISBN: {data.details.isbn}
              </p>
              <p className="text-sm text-gray-500">
                Language: {data.details.language} | Format: {data.details.format}
              </p>
            </div>
          )}
        </div>
      </div>

      {data.reviews && data.reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <ul className="space-y-3">
            {data.reviews.map((review: any) => (
              <li key={review.id} className="border p-3 rounded">
                <p className="font-semibold">
                  {review.user} — ⭐ {review.rating}
                </p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
