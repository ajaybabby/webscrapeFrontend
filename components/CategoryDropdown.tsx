"use client";
import { useState } from "react";
import Link from "next/link";

// Simple SVG icons instead of lucide-react
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

interface Category {
  id: number;
  title: string;
  slug: string;
  parentId: number | null;
}

interface Navigation {
  id: number;
  title: string;
  slug: string;
  categories: Category[];
}

interface CategoryDropdownProps {
  navigation: Navigation[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ navigation }) => {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (categoryId: number) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  return (
    <div className="w-full">
      {/* Mobile Navigation - Collapsible Menu */}
      <div className="md:hidden mb-8">
        {navigation.map((nav) => (
          <div key={nav.id} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(nav.id)}
            >
              <span>{nav.title}</span>
              {expanded[nav.id] ? (
<ChevronDown />
              ) : (
<ChevronRight />
              )}
            </button>
            
            {expanded[nav.id] && (
              <div className="px-4 pb-4">
                {nav.categories
                  ?.filter((c) => !c.parentId)
                  .map((parent) => (
                    <div key={parent.id} className="mb-2">
                      <Link
                        href={`/categories/${parent.id}/products`}
                        className="block p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        {parent.title}
                      </Link>
                      
                      <div className="ml-4 mt-1">
                        {nav.categories
                          ?.filter((child) => child.parentId === parent.id)
                          .map((child) => (
                            <Link
                              key={child.id}
                              href={`/categories/${child.id}/products`}
                              className="block p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md text-sm transition-colors"
                            >
                              {child.title}
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Navigation - Dropdown on Hover */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {navigation.map((nav) => (
            <div key={nav.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">{nav.title}</h2>
              </div>
              <div className="p-4">
                {nav.categories
                  ?.filter((c) => !c.parentId)
                  .map((parent) => (
                    <div key={parent.id} className="relative mb-3 last:mb-0 group">
                      <Link
                        href={`/categories/${parent.id}/products`}
                        className="flex items-center text-gray-800 hover:text-blue-600 font-medium py-1.5 transition-colors"
                      >
                        <span>{parent.title}</span>
                        {nav.categories?.filter((c) => c.parentId === parent.id).length > 0 && (
                          <ChevronDown />
                        )}
                      </Link>
                       
                      {nav.categories?.filter((c) => c.parentId === parent.id).length > 0 && (
                        <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg p-3 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-left group-hover:scale-100 scale-95">
                          {nav.categories
                            ?.filter((child) => child.parentId === parent.id)
                            .map((child) => (
                              <Link
                                key={child.id}
                                href={`/categories/${child.id}/products`}
                                className="block p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-sm"
                              >
                                {child.title}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;