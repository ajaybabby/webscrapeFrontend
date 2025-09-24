"use client";

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
// Define product type
interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  currency: string;
  imageUrl: string;
  sourceUrl: string;
  lastScrapedAt: string | null;
  categoryId: number;
}

// Function to fetch products by category ID
async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  const res = await fetch(`/api/categories/${categoryId}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Main component
export default function CategoryProductsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: categoryId } = params;

  // Use react-query to fetch products
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: () => fetchProductsByCategory(categoryId),
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-base sm:text-lg">Loading products for this category...</p>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <p className="text-red-500">Error loading products. Please try again.</p>
      </div>
    );
  }

  // Handle empty products state
  if (!products || products.length === 0) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <p>No products found for this category.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900">Products in Category {categoryId}</h1>
      
      {/* Product Grid - Responsive Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-3 sm:p-4 flex flex-col h-full transform hover:-translate-y-1"
          >
            {product.imageUrl ? (
              <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-3 bg-gray-50">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill={true}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-100 rounded-md flex items-center justify-center mb-3">
                <span className="text-gray-500 text-sm px-2 text-center">No Image</span>
              </div>
            )}
            <h3 className="font-medium text-gray-900 line-clamp-2 flex-grow">{product.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1">{product.author || "Unknown Author"}</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900 mt-2">
              {product.price ? `${product.price} ${product.currency}` : "Price N/A"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}