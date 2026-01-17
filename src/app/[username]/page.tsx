'use client'

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { notFound } from "next/navigation"
import { PublicIdentityPage } from "@/components/public-identity-page"

interface PublicPageProps {
  params: Promise<{
    username: string // This is actually the identity slug from the URL
  }>
}

export default function PublicPage({ params }: PublicPageProps) {
  const { username: slug } = use(params)
  
  // Get identity by slug
  const identity = useQuery(api.identities.public.getPublicIdentity, { slug })
  
  const links = useQuery(
    api.links.public.getPublicIdentityLinks,
    identity?._id ? { identityId: identity._id } : "skip"
  )

  // Loading state
  if (identity === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Not found
  if (!identity) {
    notFound()
  }

  return (
    <PublicIdentityPage 
      identity={identity} 
      links={links ?? []} 
    />
  )
}
