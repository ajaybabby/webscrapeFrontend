"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

async function fetchCategories(slug: string) {
  const res = await fetch(`/api/navigation/${slug}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export default function NavigationPage({ params }: { params: { slug: string } }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", params.slug],
    queryFn: () => fetchCategories(params.slug),
  });

  if (isLoading) return <p className="p-4">Loading categories...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading categories</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Categories in {params.slug}</h1>
      <ul className="space-y-2">
        {data.map((cat: any) => (
          <li key={cat.id}>
            <Link
              href={`/category/${cat.id}/page/1`}
              className="block p-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              {cat.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
