'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-purple-700">
          LinkIt
        </Link>
        <div>
          {isAdmin ? (
            <Link
              href="/"
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              View Profile
            </Link>
          ) : (
            <Link
              href="/admin"
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
