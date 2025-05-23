'use client';

import { useRouter } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';

export default function Login() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignIn />
    </div>
  );
}