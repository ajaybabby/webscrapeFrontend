'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

async function fetchNav() {
  const res = await fetch('/api/navigation');
  if (!res.ok) throw new Error('Failed to fetch navigation');
  return res.json();
}

export default function HomePage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['navigation'], queryFn: fetchNav });

  if (isLoading) return <p>Loading navigation...</p>;
  if (error) return <p className="text-red-600">Failed to load navigation</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      <ul className="space-y-2">
        {data?.map((nav: any) => (
          <li key={nav.slug}>
            <Link className="text-blue-600 hover:underline" href={`/navigation/${nav.slug}`}>
              {nav.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
