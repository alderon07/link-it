'use client'

import { notFound } from "next/navigation"
import { PublicPageComponent } from "@/components/public-page-component"
import { mockPages } from "@/lib/mock-pages"

interface PublicPageProps {
  params: {
    username: string
  }
}

export default function PublicPage({ params }: PublicPageProps) {
  const page = mockPages.find((p) => p.username === params.username)

  if (!page) {
    notFound()
  }

  if (!page.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page Unavailable</h1>
          <p className="text-muted-foreground">This page is currently inactive.</p>
        </div>
      </div>
    )
  }

  return <PublicPageComponent page={page} />
}
