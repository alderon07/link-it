'use client'

import { use } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { notFound } from "next/navigation"
import { PublicIdentityPage } from "@/components/public-identity-page"

interface PublicPageProps {
  params: Promise<{
    username: string
  }>
}

export default function PublicPage({ params }: PublicPageProps) {
  const { username } = use(params)
  
  // Get the identity by username from Convex
  const identity = useQuery(api.identities.public.getPublicIdentityByUsername, { username })
  const links = useQuery(
    api.links.public.getPublicIdentityLinks,
    identity?._id ? { identityId: identity._id } : "skip"
  )
  const recordView = useMutation(api.identities.public.recordIdentityView)

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
  if (identity === null) {
    notFound()
  }

  return (
    <PublicIdentityPage 
      identity={identity} 
      links={links ?? []} 
      onView={() => recordView({ identityId: identity._id })}
    />
  )
}
