"use client";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModel";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
              📚 Product Data Explorer
            </h1>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mb-4 space-y-4">
              <div className="space-y-2">
                <Link href="/" className="block py-2 text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
                <Link href="/favourites" className="block py-2 text-gray-600 hover:text-gray-900 transition-colors">Favourites</Link>
              </div>
              <SearchBar />
              <AuthModal />
            </div>
          )}
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                📚 Product Data Explorer
              </h1>
              <nav className="flex gap-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
                <Link href="/favourites" className="text-gray-600 hover:text-gray-900 transition-colors">Favourites</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-2xl">
                <SearchBar />
              </div>
              <AuthModal />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;