"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CategoryDropdown from "../components/CategoryDropdown";

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

  if (isLoading) return <div className="p-6 sm:p-8 text-center">Loading navigation...</div>;
  if (isError) return <div className="p-6 sm:p-8 text-center text-red-500">Error loading navigation</div>;

  // 🚨 If empty, run scrape automatically
  if (!data || data.length === 0) {
    if (!scrapeMutation.isPending && !scrapeMutation.isSuccess) {
      scrapeMutation.mutate();
    }
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600 text-center px-4">Scraping categories, please wait...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 text-center">Browse by Category</h1>

      {/* Responsive Category Dropdown Component */}
      <CategoryDropdown navigation={data} />
    </div>
  );
}
