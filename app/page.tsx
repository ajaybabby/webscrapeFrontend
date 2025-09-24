"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Category = {
  id: number;
  title: string;
  slug: string;
  parentId: number | null;
};

type Navigation = {
  id: number;
  title: string;
  slug: string;
  categories: Category[];
};

async function fetchNavigation(): Promise<Navigation[]> {
  const res = await fetch("/api/navigation");
  if (!res.ok) throw new Error("Failed to load navigation");
  return res.json();
}

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["navigation"],
    queryFn: fetchNavigation,
  });

  if (isLoading) return <div className="p-8 text-center">Loading navigation...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error loading navigation</div>;
  if (!data || data.length === 0) return <div className="p-8 text-center">No navigation found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Browse by Category</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((nav) => (
          <div
            key={nav.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{nav.title}</h2>
            <ul className="space-y-3">
  {(nav.categories ?? []) // 👈 fallback to [] if undefined
    .filter((c) => !c.parentId) // only top-level
    .map((parent) => (
      <li key={parent.id}>
        {/* Parent category is clickable */}
        <Link
          href={`/products?categoryId=${parent.id}`} // This is correctly set up
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-2 font-medium"
        >
          <span>→</span>
          {parent.title}
        </Link>

        {/* Subcategories */}
        <ul className="ml-6 mt-2 space-y-1">
          {(nav.categories ?? [])
            .filter((child) => child.parentId === parent.id)
            .map((child) => (
              <li key={child.id}>
                <Link
                  href={`/products?categoryId=${child.id}`} // This is also correctly set up
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  {child.title}
                </Link>
              </li>
            ))}
        </ul>
      </li>
    ))}
</ul>

          </div>
        ))}
      </div>
    </div>
  );
}
