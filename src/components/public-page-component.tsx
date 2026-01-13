"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Share2, Heart, Eye, LinkIcon, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { PixelDivider } from "@/components/pixel-art/PixelDivider"
import { FadeIn, SlideUp } from "@/components/animations/PageTransition"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"
import { trackEvent } from "@/lib/analytics/posthog-client"
import { AnalyticsEvents } from "@/lib/analytics/events"

// Mock links data for profiles
const mockPageLinks = {
  "page-1": [
    {
      id: "link-1",
      title: "My Portfolio",
      url: "https://alexjohnson.dev",
      description: "Check out my latest creative work",
      icon: "star",
      isActive: true,
      clicks: 245,
      order: 1,
    },
    {
      id: "link-2",
      title: "YouTube Channel",
      url: "https://youtube.com/@alexcreates",
      description: "Creative tutorials and behind-the-scenes",
      icon: "play",
      isActive: true,
      clicks: 189,
      order: 2,
    },
    {
      id: "link-3",
      title: "Instagram",
      url: "https://instagram.com/alexcreates",
      description: "Daily inspiration and updates",
      icon: "heart",
      isActive: true,
      clicks: 156,
      order: 3,
    },
    {
      id: "link-4",
      title: "Shop My Prints",
      url: "https://shop.alexjohnson.dev",
      description: "Limited edition art prints",
      icon: "sparkle",
      isActive: false,
      clicks: 89,
      order: 4,
    },
  ],
  "page-2": [
    {
      id: "link-5",
      title: "GitHub",
      url: "https://github.com/sarahchen",
      description: "Open source projects and contributions",
      icon: "code",
      isActive: true,
      clicks: 203,
      order: 1,
    },
    {
      id: "link-6",
      title: "Tech Blog",
      url: "https://sarahtech.blog",
      description: "Latest insights on web development",
      icon: "document",
      isActive: true,
      clicks: 178,
      order: 2,
    },
    {
      id: "link-7",
      title: "LinkedIn",
      url: "https://linkedin.com/in/sarahchen",
      description: "Professional network and updates",
      icon: "user",
      isActive: true,
      clicks: 134,
      order: 3,
    },
  ],
  "page-3": [
    {
      id: "link-8",
      title: "Spotify",
      url: "https://spotify.com/artist/mikemusic",
      description: "Latest tracks and albums",
      icon: "music",
      isActive: true,
      clicks: 312,
      order: 1,
    },
    {
      id: "link-9",
      title: "SoundCloud",
      url: "https://soundcloud.com/mikerodriguez",
      description: "Unreleased tracks and demos",
      icon: "play",
      isActive: true,
      clicks: 198,
      order: 2,
    },
    {
      id: "link-10",
      title: "Apple Music",
      url: "https://music.apple.com/artist/mikerodriguez",
      description: "Stream on Apple Music",
      icon: "heart",
      isActive: true,
      clicks: 167,
      order: 3,
    },
  ],
  "page-4": [
    {
      id: "link-11",
      title: "Fitness Programs",
      url: "https://emmafitness.com/programs",
      description: "Personalized workout plans",
      icon: "bolt",
      isActive: true,
      clicks: 189,
      order: 1,
    },
    {
      id: "link-12",
      title: "Nutrition Guide",
      url: "https://emmafitness.com/nutrition",
      description: "Healthy eating made simple",
      icon: "check",
      isActive: true,
      clicks: 156,
      order: 2,
    },
    {
      id: "link-13",
      title: "Instagram",
      url: "https://instagram.com/emmafitness",
      description: "Daily motivation and tips",
      icon: "heart",
      isActive: true,
      clicks: 234,
      order: 3,
    },
  ],
  "page-5": [
    {
      id: "link-14",
      title: "Recipe Collection",
      url: "https://davidcooks.com/recipes",
      description: "My favorite recipes to share",
      icon: "star",
      isActive: true,
      clicks: 278,
      order: 1,
    },
    {
      id: "link-15",
      title: "Cooking Classes",
      url: "https://davidcooks.com/classes",
      description: "Learn to cook like a pro",
      icon: "play",
      isActive: true,
      clicks: 145,
      order: 2,
    },
    {
      id: "link-16",
      title: "Instagram",
      url: "https://instagram.com/davidcooks",
      description: "Food photography and tips",
      icon: "heart",
      isActive: true,
      clicks: 198,
      order: 3,
    },
  ],
}

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
}

const colorVariants = ["pink", "teal", "yellow", "mint", "coral", "purple", "blue", "orange", "green"] as const

interface PublicPageProps {
  page: {
    id: string
    name: string
    username: string
    bio?: string
    avatar?: string
    category?: string
    views: number
    verified?: boolean
  }
}

export function PublicPageComponent({ page }: PublicPageProps) {
  const [viewCount, setViewCount] = React.useState<number>(page.views)
  const [shareSuccess, setShareSuccess] = React.useState(false)
  const links = (mockPageLinks[page.id as keyof typeof mockPageLinks] || [])
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order)

  // Track page view on mount
  React.useEffect(() => {
    setViewCount((prev) => prev + 1)
    // Track in PostHog
    trackEvent(AnalyticsEvents.PAGE_VIEW, {
      page_id: parseInt(page.id.replace("page-", "")),
      page_slug: page.username,
      page_name: page.name,
      is_public: true,
    })
  }, [page.id, page.username, page.name])

  const handleLinkClick = (link: typeof links[0], index: number) => {
    // Track click in PostHog
    trackEvent(AnalyticsEvents.LINK_CLICK, {
      link_id: parseInt(link.id.replace("link-", "")),
      page_id: parseInt(page.id.replace("page-", "")),
      page_slug: page.username,
      link_url: link.url,
      link_title: link.title,
      link_position: index,
    })
    // Open link
    window.open(link.url, "_blank", "noopener,noreferrer")
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${page.name} - link-it`,
          text: page.bio,
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

  // Get a consistent color based on page id
  const pageColor = colorVariants[parseInt(page.id.replace("page-", "")) % colorVariants.length]

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
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
                  <AvatarImage src={page.avatar || "/placeholder.svg?height=200&width=200"} alt={page.name} />
                  <AvatarFallback className={`text-2xl font-bold bg-pixel-${pageColor}`}>
                    {page.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </PixelBorder>
            </motion.div>

            {/* Name & Username */}
            <h1 className="text-2xl font-black mb-1 pixel-text-shadow">{page.name}</h1>
            <p className="text-muted-foreground mb-3 flex items-center justify-center gap-1">
              @{page.username}
              {page.verified && (
                <span className="inline-flex items-center justify-center w-5 h-5 bg-pixel-yellow pixel-border ml-1">
                  <Star className="w-3 h-3 fill-current" />
                </span>
              )}
            </p>

            {/* Category Badge */}
            {page.category && (
              <div className="flex justify-center mb-4">
                <Badge variant="retro" className="capitalize">
                  {page.category}
                </Badge>
              </div>
            )}

            {/* Bio */}
            {page.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {page.bio}
              </p>
            )}
          </div>
        </SlideUp>

        <PixelDivider variant="dashed" className="mb-8" />

        {/* Links */}
        <div className="mb-8">
          {links.length === 0 ? (
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
              {links.map((link, index) => {
                const linkColor = colorVariants[(index + parseInt(page.id.replace("page-", ""))) % colorVariants.length]
                const iconName = iconMap[link.icon] || "star"

                return (
                  <StaggerItem key={link.id}>
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
