'use client';

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // Wait for Clerk to load, then check authentication
    if (isLoaded && !isSignedIn) {
      redirect('/login');
    }
  }, [isLoaded, isSignedIn]);

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="container mx-auto p-4 bg-background text-text">
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render content if not signed in (redirect will handle this)
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 bg-background text-text">
      {children}
    </div>
  );
}