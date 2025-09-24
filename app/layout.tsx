import "../styles/globals.css";
import ReactQueryClientProvider from "../components/ReactQueryClientProvider";
import SearchBar from "../components/SearchBar";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "../components/AuthModel";
import Link from "next/link";

export const metadata = {
  title: "Product Data Explorer",
  description: "Browse scraped products",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <ReactQueryClientProvider>
          <AuthProvider>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
              <nav className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
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
              </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500">
                  © {new Date().getFullYear()} Product Data Explorer. All rights reserved.
                </p>
              </div>
            </footer>
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
