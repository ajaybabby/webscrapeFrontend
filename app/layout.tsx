import '../styles/globals.css';
import ReactQueryClientProvider from '../components/ReactQueryClientProvider';

export const metadata = { title: 'Product Data Explorer', description: 'Browse scraped products' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <ReactQueryClientProvider>
          <header className="p-4 shadow bg-white">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-xl font-bold">Product Data Explorer</h1>
            </div>
          </header>
          <main className="p-6 max-w-6xl mx-auto">{children}</main>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
