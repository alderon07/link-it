"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Share2, Heart, Eye, LinkIcon, Star } from "lucide-react"
import { motion } from "framer-motion"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { PixelDivider } from "@/components/pixel-art/PixelDivider"
import { FadeIn, SlideUp } from "@/components/animations/PageTransition"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"
import { trackEvent } from "@/lib/analytics/posthog-client"
import { AnalyticsEvents } from "@/lib/analytics/events"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id, Doc } from "../../convex/_generated/dataModel"

const iconMap: Record<string, "star" | "heart" | "arrow" | "check" | "cross" | "plus" | "minus" | "sparkle" | "diamond" | "coin" | "lightning" | "fire" | "link" | "cursor"> = {
  star: "star",
  heart: "heart",
  play: "diamond",
  sparkle: "sparkle",
  code: "link",
  document: "coin",
  music: "sparkle",
  bolt: "lightning",
  check: "check",
  user: "star",
  fire: "fire",
  "bar-chart": "coin",
  ticket: "sparkle",
  "shopping-bag": "diamond",
  lock: "cross",
  github: "link",
  linkedin: "star",
  twitter: "heart",
  instagram: "heart",
}

const colorVariants = ["pink", "teal", "yellow", "mint", "coral", "purple", "blue", "orange", "green"] as const

interface IdentityWithUser {
  _id: Id<"identities">
  name: string
  slug: string
  bio?: string
  avatarUrl?: string
  isPublic: boolean
  viewCount: number
  themeId?: Id<"themes">
  user: {
    username: string
    displayName?: string
    avatarUrl?: string
  }
  theme?: Doc<"themes"> | null
}

interface Link {
  _id: Id<"links">
  title: string
  url?: string
  type?: "link" | "header" | "divider"
  description?: string
  icon?: string
  isActive?: boolean
  orderIndex?: number
  clickCount?: number
}

interface PublicIdentityPageProps {
  identity: IdentityWithUser
  links: Link[]
  onView?: () => void
}

export function PublicIdentityPage({ identity, links, onView }: PublicIdentityPageProps) {
  const [viewCount, setViewCount] = React.useState<number>(identity.viewCount || 0)
  const [shareSuccess, setShareSuccess] = React.useState(false)
  const trackClick = useMutation(api.links.public.trackClick)

  // Sort and filter links
  const activeLinks = links
    .filter((link) => link.isActive !== false && link.type !== "divider")
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))

  // Track page view on mount
  React.useEffect(() => {
    setViewCount((prev) => prev + 1)
    onView?.()
    
    // Track in PostHog
    trackEvent(AnalyticsEvents.PAGE_VIEW, {
      page_id: identity._id,
      page_slug: identity.slug,
      page_name: identity.name,
      is_public: true,
    })
  }, [identity._id, identity.slug, identity.name, onView])

  const handleLinkClick = async (link: Link, index: number) => {
    // Track click in PostHog
    trackEvent(AnalyticsEvents.LINK_CLICK, {
      link_id: link._id,
      page_id: identity._id,
      page_slug: identity.slug,
      link_url: link.url,
      link_title: link.title,
      link_position: index,
    })

    // Track click in Convex
    await trackClick({ linkId: link._id })

    // Open link
    if (link.url) {
      window.open(link.url, "_blank", "noopener,noreferrer")
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${identity.name} - link-it`,
          text: identity.bio,
          url: url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      await navigator.clipboard.writeText(url)
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
    }
  }

  // Get a consistent color based on identity id hash
  const idHash = identity._id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const pageColor = colorVariants[idHash % colorVariants.length]

  // Apply theme styles if available
  const themeStyles = identity.theme
    ? {
        "--theme-bg": identity.theme.bgColor,
        "--theme-text": identity.theme.textColor,
        "--theme-accent": identity.theme.accentColor,
      } as React.CSSProperties
    : {}

  return (
    <div 
      className="min-h-screen bg-background text-foreground relative overflow-hidden"
      style={themeStyles}
    >
      {/* Pixel Grid Background */}
      <div className="fixed inset-0 pixel-grid opacity-20 pointer-events-none" />

      {/* Floating decorations */}
      <motion.div
        className="absolute top-20 right-10 hidden md:block"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <PixelIcon icon="star" size="default" color="yellow" />
      </motion.div>
      <motion.div
        className="absolute top-40 left-10 hidden md:block"
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <PixelIcon icon="heart" size="default" color="pink" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        {/* Header Stats */}
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <PixelBorder variant="solid" shadow="sm" className="px-3 py-1.5 bg-card">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-pixel-teal" />
                <CountUp value={viewCount} duration={1} />
                <span className="text-muted-foreground">views</span>
              </div>
            </PixelBorder>
            <Button
              variant="pixel-outline"
              size="sm"
              onClick={handleShare}
              className="relative"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {shareSuccess ? "Copied!" : "Share"}
            </Button>
          </div>
        </FadeIn>

        {/* Profile Header */}
        <SlideUp delay={0.1}>
          <div className="text-center mb-8">
            {/* Avatar */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <PixelBorder variant="solid" shadow="default" className={`p-1 bg-pixel-${pageColor}`}>
                <Avatar className="w-24 h-24 pixel-border">
                  <AvatarImage 
                    src={identity.avatarUrl || identity.user.avatarUrl || "/placeholder.svg?height=200&width=200"} 
                    alt={identity.name} 
                  />
                  <AvatarFallback className={`text-2xl font-bold bg-pixel-${pageColor}`}>
                    {identity.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </PixelBorder>
            </motion.div>

            {/* Name & Username */}
            <h1 className="text-2xl font-black mb-1 pixel-text-shadow">{identity.name}</h1>
            <p className="text-muted-foreground mb-3 flex items-center justify-center gap-1">
              @{identity.user.username}
            </p>

            {/* Bio */}
            {identity.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {identity.bio}
              </p>
            )}
          </div>
        </SlideUp>

        <PixelDivider variant="dashed" className="mb-8" />

        {/* Links */}
        <div className="mb-8">
          {activeLinks.length === 0 ? (
            <FadeIn>
              <PixelBorder variant="solid" shadow="default" className="p-8 bg-card text-center">
                <PixelIcon icon="cross" size="lg" color="coral" className="mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">No Links Yet</h3>
                <p className="text-muted-foreground text-sm">
                  This page doesn&apos;t have any active links yet.
                </p>
              </PixelBorder>
            </FadeIn>
          ) : (
            <StaggerContainer className="space-y-4">
              {activeLinks.map((link, index) => {
                const linkColor = colorVariants[(index + idHash) % colorVariants.length]
                const iconName = iconMap[link.icon || "star"] || "star"

                return (
                  <StaggerItem key={link._id}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: -2, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        variant="pixel-interactive"
                        className="cursor-pointer group"
                        onClick={() => handleLinkClick(link, index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className={`w-12 h-12 bg-pixel-${linkColor} pixel-border flex items-center justify-center flex-shrink-0 group-hover:pixel-shake`}>
                              <PixelIcon icon={iconName} size="sm" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold truncate group-hover:text-pixel-pink transition-colors">
                                {link.title}
                              </h3>
                              {link.description && (
                                <p className="text-sm text-muted-foreground truncate mt-0.5">
                                  {link.description}
                                </p>
                              )}
                            </div>

                            {/* Arrow */}
                            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-pixel-pink transition-colors flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          )}
        </div>

        {/* Footer */}
        <FadeIn delay={0.5}>
          <div className="text-center">
            <PixelDivider variant="stars" className="mb-6" />

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Heart className="h-4 w-4 text-pixel-coral" />
              <span>Made with link-it</span>
            </div>

            <Button variant="pixel-outline" size="sm" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                <LinkIcon className="h-4 w-4 mr-2" />
                Create your own link-it
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
