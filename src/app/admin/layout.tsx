'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login page if not authenticated
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="container mx-auto p-4 bg-background text-text">
      {children}
    </div>
  );
}