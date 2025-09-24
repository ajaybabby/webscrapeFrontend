"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

type Navigation = {
  id: number;
  title: string;
  slug: string;
  categories: {
    id: number;
    title: string;
    slug: string;
    parentId: number | null;
  }[];
};

// Fetch navigation
async function fetchNavigation(): Promise<Navigation[]> {
  const res = await fetch("/api/navigation");
  if (!res.ok) throw new Error("Failed to load navigation");
  return res.json();
}

// Trigger scrape if DB is empty
async function scrapeNavigation(): Promise<Navigation[]> {
  const res = await fetch("/api/navigation/scrape", { method: "POST" });
  if (!res.ok) throw new Error("Scraping failed");
  return res.json();
}

export default function HomePage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["navigation"],
    queryFn: fetchNavigation,
  });

  const scrapeMutation = useMutation({
    mutationFn: scrapeNavigation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
    },
  });

  if (isLoading) return <div className="p-8 text-center">Loading navigation...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error loading navigation</div>;

  // 🚨 If empty, run scrape automatically
  if (!data || data.length === 0) {
    if (!scrapeMutation.isPending && !scrapeMutation.isSuccess) {
      scrapeMutation.mutate();
    }
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Scraping categories, please wait...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Browse by Category</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((nav) => (
          <div key={nav.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{nav.title}</h2>
            <ul className="space-y-3">
              {nav.categories
                ?.filter((c) => !c.parentId) // parent categories
                .map((parent) => (
                  <li key={parent.id}>
                    <Link
                      href={`/categories/${parent.id}/products`}
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 font-medium"
                    >
                      <span>→</span>
                      {parent.title}
                    </Link>
                    <ul className="ml-6 mt-2 space-y-1">
                      {nav.categories
                        ?.filter((child) => child.parentId === parent.id)
                        .map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/categories/${child.id}/products`}
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
