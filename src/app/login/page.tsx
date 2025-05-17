'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ValidationError } from '@/lib/validate';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setError('');
    setValidationErrors({});
    
    try {
      setIsLoading(true);
      
      // Use our auth service
      await login({ email, password });
      
      // Redirect to admin dashboard after successful login
      router.push('/admin');
    } catch (err) {
      if (err instanceof ValidationError) {
        // Handle validation errors
        const fieldErrors = err.errors.flatten().fieldErrors;
        const typedErrors: Record<string, string[]> = {};
        
        Object.entries(fieldErrors).forEach(([key, value]) => {
          if (value) {
            typedErrors[key] = value;
          }
        });
        
        setValidationErrors(typedErrors);
      } else {
        setError('Authentication failed. Please try again.');
        console.error('Login error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render field errors
  const getFieldError = (field: string) => {
    if (validationErrors[field] && validationErrors[field].length > 0) {
      return validationErrors[field][0];
    }
    return null;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary">
            Or{' '}
            <Link href="/" className="font-medium text-accent hover:text-accent/80">
              go back to home page
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-secondary">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${
                  getFieldError('email') ? 'ring-red-300' : 'ring-gray-300'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary`}
                placeholder="Email address"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-400">{getFieldError('email')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${
                  getFieldError('password') ? 'ring-red-300' : 'ring-gray-300'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary`}
                placeholder="Password"
              />
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-400">{getFieldError('password')}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-pink-500 px-3 py-3 text-sm font-semibold text-white hover:bg-pink-600 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:bg-pink-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}