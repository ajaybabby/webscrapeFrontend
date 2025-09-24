import "../styles/globals.css";
import ReactQueryClientProvider from "../components/ReactQueryClientProvider";
import { AuthProvider } from "./context/AuthContext";
import Link from "next/link";
import Header from "../components/Header";

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
            {/* Use the new Header component */}
            <Header />

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
