'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated, logout, getCurrentUser } from '@/lib/auth';
import { LogIn, LogOut, User, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserButton, SignedIn, SignedOut, useUser, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const isAdmin = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';
  const { user } = useUser();
  console.log(user);
  

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white shadow-xs">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-pink-600">
          LinkIt
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <SignedIn>
            <SignOutButton>
              <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
