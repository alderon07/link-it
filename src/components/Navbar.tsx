'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated, logout, getCurrentUser } from '@/lib/auth';
import dynamic from 'next/dynamic';
import { IconDashboard, IconLogout, IconLogin, IconUser} from '@tabler/icons-react';
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
      <div className="flex items-center justify-between px-2 py-2 sm:px-6 sm:py-3">
        <Link href="/" className="text-lg font-bold text-primary">
          link-it 
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* <ThemeToggle /> */}
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
                  className="flex items-center rounded-md bg-secondary p-2 text-sm font-medium text-text hover:bg-secondary/80 sm:px-4 sm:py-2"
                  title="Dashboard"
                >
                  <IconDashboard/>
                  <span className="hidden sm:ml-2 sm:inline">Dashboard</span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/"
                  className="flex items-center rounded-md bg-secondary p-2 text-sm font-medium text-text hover:bg-accent sm:px-4 sm:py-2"
                  title="View Profile"
                >
                  <IconUser/>
                  <span className="hidden sm:ml-2 sm:inline">View Profile</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center rounded-md bg-secondary p-2 text-sm font-medium text-text hover:bg-accent sm:px-4 sm:py-2"
                title="Logout"
              >
                <IconLogout/>
                <span className="hidden sm:ml-2 sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              {!isLoginPage && (
                <Link
                  href="/login"
                  className="flex items-center rounded-md bg-secondary p-2 text-sm font-medium text-text hover:bg-accent sm:px-4 sm:py-2"
                  title="Login"
                >
                  <IconLogin/>
                  <span className="hidden sm:ml-2 sm:inline">login</span>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
