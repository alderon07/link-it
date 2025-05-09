'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated, logout, getCurrentUser } from '@/lib/auth';
import dynamic from 'next/dynamic';

// Dynamically import ThemeToggle with no SSR to avoid hydration issues
const ThemeToggle = dynamic(() => import('./ThemeToggle').then(mod => mod.ThemeToggle), { 
  ssr: false 
});

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  // Check for logged in status on mount and pathname change
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      if (authStatus) {
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
    
    // Add event listener for storage changes (logout from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-primary">
          LinkIt
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              {user && (
                <span className="hidden items-center text-sm text-text md:flex">
                  {user.email}
                </span>
              )}
              {!isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-text hover:bg-secondary/80"
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/"
                  className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-text hover:bg-secondary/80"
                >
                  View Profile
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary/80"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {!isLoginPage && (
                <Link
                  href="/login"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
