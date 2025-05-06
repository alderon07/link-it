'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
 
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin page error:', error)
  }, [error])
 
  const router = useRouter()
 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
        <p className="mb-6 text-gray-700">{error.message || 'An unexpected error occurred'}</p>
        <div className="flex space-x-4">
          <button
            onClick={() => reset()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Go back home
          </button>
        </div>
      </div>
    </div>
  )
}