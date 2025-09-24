"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books..."
        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        aria-label="Search books"
      />
      <button
        type="submit"
        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 whitespace-nowrap"
        aria-label="Search"
      >
        Search
      </button>
    </form>
  );
}
