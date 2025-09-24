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

  if (isLoading) return <p className="p-4 text-center">Loading categories...</p>;
  if (error) return <p className="p-4 text-center text-red-500">Error loading categories</p>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Categories in {params.slug}</h1>
      <ul className="space-y-3 sm:space-y-4">
        {data.map((cat: any) => (
          <li key={cat.id}>
            <Link
              href={`/category/${cat.id}/page/1`}
              className="block p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-200 shadow-sm hover:shadow"
            >
              <span className="text-gray-800 font-medium">{cat.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
