"use client"; // This is important for client-side hooks like useSearchParams

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: string;
  title: string;
  imageUrl: string;
  price: number | null;
  currency: string;
  author: string | null;
};

// Function to fetch products based on category ID
async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  // Updated API call as requested
  const res = await fetch(`/api/categories/${categoryId}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId'); // Get the categoryId from the URL

  // Use react-query to fetch products
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', categoryId], // Query key includes categoryId
    queryFn: () => fetchProductsByCategory(categoryId as string),
    enabled: !!categoryId, // Only run this query if categoryId is present
  });

  // Display messages based on the state
  if (!categoryId) {
    return <div className="p-8 text-center">Please select a category to view products.</div>;
  }

  if (isLoading) return <div className="p-8 text-center">Loading products...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error loading products.</div>;
  if (!products || products.length === 0) return <div className="p-8 text-center">No products found for this category.</div>;

  // Render the list of products
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Products in Category {categoryId}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`} // Link to individual product page
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col"
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={200}
                height={300}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center mb-3">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <h3 className="font-medium text-gray-900 line-clamp-2">{product.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.author || "Unknown Author"}</p>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              {product.price ? `${product.price} ${product.currency}` : "Price N/A"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}