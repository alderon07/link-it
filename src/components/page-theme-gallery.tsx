"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, Search, Star, Palette, Eye, Download, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { galleryThemes } from "@/lib/gallery-themes"
import { mockProfiles } from "@/lib/mock-profiles"

interface PageThemeGalleryProps {
  profileId: string
}

export function PageThemeGallery({ profileId }: PageThemeGalleryProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [appliedTheme, setAppliedTheme] = React.useState<string | null>(null)

  const profile = mockProfiles.find((p) => p.id === profileId)

  const categories = [
    { id: "all", label: "All Themes" },
    { id: "professional", label: "Professional" },
    { id: "creative", label: "Creative" },
    { id: "minimal", label: "Minimal" },
    { id: "vibrant", label: "Vibrant" },
    { id: "dark", label: "Dark" },
    { id: "seasonal", label: "Seasonal" },
  ]

  const filteredThemes = galleryThemes.filter((theme) => {
    const matchesSearch =
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || theme.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const applyTheme = (theme: any) => {
    // Store the theme for this specific profile
    const profileThemeKey = `profile-${profileId}-theme`
    localStorage.setItem(profileThemeKey, JSON.stringify(theme))
    setAppliedTheme(theme.id)

    // Show success message
    alert(`Theme "${theme.name}" applied to ${profile?.name}'s profile! Visit the live profile to see the changes.`)
  }

  // Load applied theme on mount
  React.useEffect(() => {
    const profileThemeKey = `profile-${profileId}-theme`
    const savedTheme = localStorage.getItem(profileThemeKey)
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme)
        setAppliedTheme(theme.id)
      } catch (error) {
        console.error("Error loading saved theme:", error)
      }
    }
  }, [profileId])

  const ThemePreview = ({ theme, isSelected }: { theme: any; isSelected: boolean }) => (
    <Card
      className={cn("relative overflow-hidden transition-all hover:shadow-lg", isSelected && "ring-2 ring-primary")}
    >
      <div
        className="h-32 p-4 flex flex-col justify-between"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
          color: theme.colors.foreground,
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm">{theme.name}</h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {theme.category}
            </Badge>
          </div>
          {theme.featured && <Star className="h-4 w-4 fill-current" />}
        </div>
        <div className="space-y-2">
          <div className="h-2 rounded-full opacity-80" style={{ backgroundColor: theme.colors.foreground }} />
          <div className="flex gap-1">
            <div className="h-1.5 w-8 rounded-full opacity-60" style={{ backgroundColor: theme.colors.foreground }} />
            <div className="h-1.5 w-6 rounded-full opacity-40" style={{ backgroundColor: theme.colors.foreground }} />
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{theme.name}</DialogTitle>
                <DialogDescription>{theme.description}</DialogDescription>
              </DialogHeader>
              <ThemePreviewModal theme={theme} profile={profile} />
            </DialogContent>
          </Dialog>
          <Button size="sm" className="flex-1" onClick={() => applyTheme(theme)} disabled={isSelected}>
            {isSelected ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Applied
              </>
            ) : (
              <>
                <Download className="h-3 w-3 mr-1" />
                Apply
              </>
            )}
          </Button>
        </div>
      </CardContent>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        </div>
      )}
    </Card>
  )

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search themes for ${profile.name}'s profile...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredThemes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Palette className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No themes found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search or browse a different category
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredThemes.map((theme) => {
                const isSelected = appliedTheme === theme.id

                return <ThemePreview key={theme.id} theme={theme} isSelected={isSelected} />
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ThemePreviewModal({ theme, profile }: { theme: any; profile: any }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(theme.colors)
          .slice(0, 8)
          .map(([key, color]) => (
            <div key={key} className="text-center">
              <div
                className="w-8 h-8 rounded-full border-2 border-border"
                style={{ backgroundColor: color as string }}
              />
              <p className="text-xs mt-1 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
            </div>
          ))}
      </div>

      <div
        className="p-4 rounded-lg border-2 border-dashed"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          color: theme.colors.foreground,
          borderRadius: theme.colors.borderRadius || "0.75rem",
        }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar
            className="w-12 h-12 border-2"
            style={{
              borderColor: theme.colors.primary,
              borderRadius: `calc(${theme.colors.borderRadius || "0.75rem"} * 1.5)`,
            }}
          >
            <AvatarImage src={profile?.avatar || "/placeholder.svg?height=100&width=100"} alt="Preview" />
            <AvatarFallback style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
              {profile?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold">{profile?.name || "Profile Name"}</h3>
            <p className="text-sm opacity-70">@{profile?.username || "username"}</p>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div
            className="p-2 border flex items-center justify-between"
            style={{
              backgroundColor: theme.colors.linkBackground,
              color: theme.colors.linkForeground,
              borderColor: theme.colors.border,
              borderRadius: theme.colors.borderRadius || "0.75rem",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 text-xs flex items-center justify-center"
                style={{
                  backgroundColor: `${theme.colors.linkForeground}20`,
                  color: theme.colors.linkForeground,
                  borderRadius: `calc(${theme.colors.borderRadius || "0.75rem"} * 0.5)`,
                }}
              >
                🎨
              </div>
              <span className="text-sm font-medium">Portfolio</span>
            </div>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </div>
          <div
            className="p-2 border flex items-center justify-between"
            style={{
              backgroundColor: theme.colors.linkBackground,
              color: theme.colors.linkForeground,
              borderColor: theme.colors.border,
              borderRadius: theme.colors.borderRadius || "0.75rem",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 text-xs flex items-center justify-center"
                style={{
                  backgroundColor: `${theme.colors.linkForeground}20`,
                  color: theme.colors.linkForeground,
                  borderRadius: `calc(${theme.colors.borderRadius || "0.75rem"} * 0.5)`,
                }}
              >
                📱
              </div>
              <span className="text-sm font-medium">Contact</span>
            </div>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </div>
        </div>
      </div>
    </div>
  )
}
