"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Share2, Heart, Eye } from "lucide-react"

// Mock links data for profiles (same as in profile-links-manager)
const mockProfileLinks = {
  "profile-1": [
    {
      id: "link-1",
      title: "My Portfolio",
      url: "https://alexjohnson.dev",
      description: "Check out my latest creative work",
      icon: "🎨",
      isActive: true,
      clicks: 245,
      order: 1,
    },
    {
      id: "link-2",
      title: "YouTube Channel",
      url: "https://youtube.com/@alexcreates",
      description: "Creative tutorials and behind-the-scenes",
      icon: "📹",
      isActive: true,
      clicks: 189,
      order: 2,
    },
    {
      id: "link-3",
      title: "Instagram",
      url: "https://instagram.com/alexcreates",
      description: "Daily inspiration and updates",
      icon: "📸",
      isActive: true,
      clicks: 156,
      order: 3,
    },
    {
      id: "link-4",
      title: "Shop My Prints",
      url: "https://shop.alexjohnson.dev",
      description: "Limited edition art prints",
      icon: "🛒",
      isActive: false,
      clicks: 89,
      order: 4,
    },
  ],
  "profile-2": [
    {
      id: "link-5",
      title: "GitHub",
      url: "https://github.com/sarahchen",
      description: "Open source projects and contributions",
      icon: "💻",
      isActive: true,
      clicks: 203,
      order: 1,
    },
    {
      id: "link-6",
      title: "Tech Blog",
      url: "https://sarahtech.blog",
      description: "Latest insights on web development",
      icon: "📝",
      isActive: true,
      clicks: 178,
      order: 2,
    },
    {
      id: "link-7",
      title: "LinkedIn",
      url: "https://linkedin.com/in/sarahchen",
      description: "Professional network and updates",
      icon: "💼",
      isActive: true,
      clicks: 134,
      order: 3,
    },
  ],
  "profile-3": [
    {
      id: "link-8",
      title: "Spotify",
      url: "https://spotify.com/artist/mikemusic",
      description: "Latest tracks and albums",
      icon: "🎵",
      isActive: true,
      clicks: 312,
      order: 1,
    },
    {
      id: "link-9",
      title: "SoundCloud",
      url: "https://soundcloud.com/mikerodriguez",
      description: "Unreleased tracks and demos",
      icon: "🎧",
      isActive: true,
      clicks: 198,
      order: 2,
    },
    {
      id: "link-10",
      title: "Apple Music",
      url: "https://music.apple.com/artist/mikerodriguez",
      description: "Stream on Apple Music",
      icon: "🍎",
      isActive: true,
      clicks: 167,
      order: 3,
    },
  ],
  "profile-4": [
    {
      id: "link-11",
      title: "Fitness Programs",
      url: "https://emmafitness.com/programs",
      description: "Personalized workout plans",
      icon: "💪",
      isActive: true,
      clicks: 189,
      order: 1,
    },
    {
      id: "link-12",
      title: "Nutrition Guide",
      url: "https://emmafitness.com/nutrition",
      description: "Healthy eating made simple",
      icon: "🥗",
      isActive: true,
      clicks: 156,
      order: 2,
    },
    {
      id: "link-13",
      title: "Instagram",
      url: "https://instagram.com/emmafitness",
      description: "Daily motivation and tips",
      icon: "📸",
      isActive: true,
      clicks: 234,
      order: 3,
    },
  ],
  "profile-5": [
    {
      id: "link-14",
      title: "Recipe Collection",
      url: "https://davidcooks.com/recipes",
      description: "My favorite recipes to share",
      icon: "👨‍🍳",
      isActive: true,
      clicks: 278,
      order: 1,
    },
    {
      id: "link-15",
      title: "Cooking Classes",
      url: "https://davidcooks.com/classes",
      description: "Learn to cook like a pro",
      icon: "🍳",
      isActive: true,
      clicks: 145,
      order: 2,
    },
    {
      id: "link-16",
      title: "Instagram",
      url: "https://instagram.com/davidcooks",
      description: "Food photography and tips",
      icon: "📸",
      isActive: true,
      clicks: 198,
      order: 3,
    },
  ],
}

interface PublicPageProps {
  page: any
}

export function PublicPage({ page }: PublicPageProps) {
  const [theme, setTheme] = React.useState<any>(null)
  const [viewCount, setViewCount] = React.useState(page.views)
  const links = (mockProfileLinks[page.id as keyof typeof mockProfileLinks] || [])
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order)

  // Load profile-specific theme
  React.useEffect(() => {
    const pageThemeKey = `page-${page.id}-theme`
    const savedTheme = localStorage.getItem(pageThemeKey)
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme)
        setTheme(themeData)
      } catch (error) {
        console.error("Error loading theme:", error)
      }
    }
  }, [page.id])

  // Simulate view tracking
  React.useEffect(() => {
    // Increment view count (in real app, this would be an API call)
    setViewCount((prev) => prev + 1)
  }, [])

  const handleLinkClick = (link: any) => {
    // Track click (in real app, this would be an API call)
    console.log(`Clicked link: ${link.title}`)
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert("Profile link copied to clipboard!")
    }
  }

  // Helper function to convert hex to HSL
  const hexToHsl = (hex: string): string => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
  }

  // Apply theme styles - ISOLATED from global theme
  const themeStyles = theme
    ? {
        "--profile-primary": hexToHsl(theme.colors.primary),
        "--profile-accent": hexToHsl(theme.colors.accent),
        "--profile-background": hexToHsl(theme.colors.background),
        "--profile-foreground": hexToHsl(theme.colors.foreground),
        "--profile-muted": hexToHsl(theme.colors.muted),
        "--profile-border": hexToHsl(theme.colors.border),
        "--profile-link-background": hexToHsl(theme.colors.linkBackground),
        "--profile-link-foreground": hexToHsl(theme.colors.linkForeground),
        "--profile-radius": theme.colors.borderRadius || "0.75rem",
      }
    : {}

  return (
    <div
      className="profile-page min-h-screen transition-colors"
      style={
        {
          backgroundColor: theme ? theme.colors.background : "#ffffff",
          color: theme ? theme.colors.foreground : "#0f172a",
          ...themeStyles,
        } as React.CSSProperties
      }
    >
      {/* Background Pattern - uses profile theme colors */}
      <div
        className="absolute inset-0"
        style={{
          background: theme
            ? `linear-gradient(135deg, ${theme.colors.primary}10 0%, transparent 50%, ${theme.colors.accent}10 100%)`
            : "linear-gradient(135deg, #8b5cf610 0%, transparent 50%, #06b6d410 100%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-sm" style={{ color: theme ? theme.colors.muted : "#64748b" }}>
              <Eye className="h-4 w-4" />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              style={
                theme
                  ? {
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                      backgroundColor: theme.colors.background,
                    }
                  : {}
              }
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <Avatar
            className="w-24 h-24 mx-auto mb-4 border-4"
            style={{ borderColor: theme ? `${theme.colors.primary}40` : "#8b5cf640" }}
          >
            <AvatarImage src={page.avatar || "/placeholder.svg?height=200&width=200"} alt={page.name} />
            <AvatarFallback
              className="text-2xl"
              style={{
                backgroundColor: theme ? theme.colors.primary : "#8b5cf6",
                color: theme ? theme.colors.background : "#ffffff",
              }}
            >
              {page.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold mb-2">{page.name}</h1>
          <p className="mb-3" style={{ color: theme ? theme.colors.muted : "#64748b" }}>
            @{page.username}
          </p>

          <div className="flex justify-center mb-4">
            <Badge
              variant="secondary"
              className="capitalize"
              style={
                theme
                  ? {
                      backgroundColor: theme.colors.muted,
                      color: theme.colors.foreground,
                    }
                  : {}
              }
            >
              {page.category}
            </Badge>
          </div>

          {page.bio && (
            <p className="text-sm leading-relaxed" style={{ color: theme ? theme.colors.muted : "#64748b" }}>
              {page.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4 mb-8">
          {links.length === 0 ? (
            <Card style={theme ? { backgroundColor: theme.colors.background, borderColor: theme.colors.border } : {}}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ExternalLink className="h-12 w-12 mb-4" style={{ color: theme ? theme.colors.muted : "#64748b" }} />
                <h3 className="text-lg font-semibold mb-2">No links available</h3>
                <p className="text-center" style={{ color: theme ? theme.colors.muted : "#64748b" }}>
                  {`This page doesn't have any active links yet.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            links.map((link) => (
              <Card
                key={link.id}
                className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border-2"
                onClick={() => handleLinkClick(link)}
                style={{
                  backgroundColor: theme ? theme.colors.linkBackground : "#f8fafc",
                  color: theme ? theme.colors.linkForeground : "#0f172a",
                  borderColor: theme ? theme.colors.border : "#e2e8f0",
                  borderRadius: theme ? theme.colors.borderRadius || "0.75rem" : "0.75rem",
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className="w-12 h-12 flex items-center justify-center text-2xl"
                        style={{
                          backgroundColor: theme ? `${theme.colors.linkForeground}20` : "#e2e8f0",
                          borderRadius: theme ? `calc(${theme.colors.borderRadius || "0.75rem"} * 0.7)` : "0.5rem",
                        }}
                      >
                        {link.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{link.title}</h3>
                        {link.description && (
                          <p
                            className="text-sm truncate mt-1"
                            style={{
                              color: theme ? `${theme.colors.linkForeground}80` : "#64748b",
                            }}
                          >
                            {link.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ExternalLink
                      className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ color: theme ? theme.colors.linkForeground : "#0f172a" }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div
            className="flex items-center justify-center gap-2 text-sm mb-4"
            style={{ color: theme ? theme.colors.muted : "#64748b" }}
          >
            <Heart className="h-4 w-4" />
            <span>Made with link-it</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            style={
              theme
                ? {
                    borderColor: theme.colors.border,
                    color: theme.colors.foreground,
                    backgroundColor: theme.colors.background,
                  }
                : {}
            }
          >
            <a href="/" target="_blank" rel="noreferrer">
              Create your own link-it
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
