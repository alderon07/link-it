'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated, logout, getCurrentUser } from '@/lib/auth';
import { LogIn, LogOut, User, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
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
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white shadow-xs">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-pink-600">
          link-it
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              {user && (
                <span className="text-text hidden items-center text-sm md:flex">
                  {user.email}
                </span>
              )}
              {!isAdmin && (
                <Button variant="secondary" asChild>
                  <Link href="/admin" title="Dashboard">
                    <Gauge />
                    <span className="hidden sm:inline">dashboard</span>
                  </Link>
                </Button>
              )}
              {isAdmin && (
                <Button variant="secondary" asChild>
                  <Link href="/" title="View Profile">
                    <User />
                    <span className="hidden sm:inline">profile</span>
                  </Link>
                </Button>
              )}
              <Button variant="secondary" onClick={handleLogout} title="Logout">
                <LogOut />
                <span className="hidden sm:inline">logout</span>
              </Button>
            </>
          ) : (
            <>
              {!isLoginPage && (
                <Button variant="secondary" title='Login' asChild>
                  <Link href="/login" title="Login">
                    <LogIn />
                    <span className="hidden sm:inline">login</span>
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
