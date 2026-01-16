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
import { Check, Search, Star, Palette, Eye, Download, ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Id, Doc } from "../../../convex/_generated/dataModel"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { toast } from "sonner"

interface IdentityThemeGalleryProps {
  identityId: Id<"identities">
  identity: Doc<"identities">
  themes: Doc<"themes">[]
  currentThemeId?: Id<"themes">
  onApplyTheme: (themeId: Id<"themes"> | null) => Promise<void>
}

export function IdentityThemeGallery({ 
  identityId, 
  identity, 
  themes, 
  currentThemeId, 
  onApplyTheme 
}: IdentityThemeGalleryProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [isApplying, setIsApplying] = React.useState<string | null>(null)

  const categories = [
    { id: "all", label: "All" },
    { id: "system", label: "System" },
    { id: "custom", label: "My Themes" },
  ]

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = 
      selectedCategory === "all" || 
      (selectedCategory === "system" && !theme.isCustom) ||
      (selectedCategory === "custom" && theme.isCustom)
    return matchesSearch && matchesCategory
  })

  const handleApplyTheme = async (themeId: Id<"themes">) => {
    setIsApplying(themeId)
    try {
      await onApplyTheme(themeId)
      toast.success(`Theme applied to ${identity.name}!`)
    } catch (error) {
      toast.error("Failed to apply theme")
      console.error(error)
    } finally {
      setIsApplying(null)
    }
  }

  const ThemePreview = ({ theme, isSelected }: { theme: Doc<"themes">; isSelected: boolean }) => (
    <Card
      variant="pixel-interactive"
      className={cn("relative overflow-hidden", isSelected && "ring-2 ring-pixel-pink")}
    >
      <div
        className="h-32 p-4 flex flex-col justify-between pixel-border"
        style={{
          background: `linear-gradient(135deg, ${theme.bgColor} 0%, ${theme.accentColor} 100%)`,
          color: theme.textColor,
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-sm">{theme.name}</h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {theme.isCustom ? "Custom" : "System"}
            </Badge>
          </div>
          {isSelected && <PixelIcon icon="star" size="xs" color="yellow" />}
        </div>
        <div className="space-y-2">
          <div className="h-2 rounded-full opacity-80" style={{ backgroundColor: theme.textColor }} />
          <div className="flex gap-1">
            <div className="h-1.5 w-8 rounded-full opacity-60" style={{ backgroundColor: theme.textColor }} />
            <div className="h-1.5 w-6 rounded-full opacity-40" style={{ backgroundColor: theme.textColor }} />
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex gap-3 mb-3">
          <div 
            className="w-6 h-6 rounded pixel-border"
            style={{ backgroundColor: theme.bgColor }}
            title="Background"
          />
          <div 
            className="w-6 h-6 rounded pixel-border"
            style={{ backgroundColor: theme.textColor }}
            title="Text"
          />
          <div 
            className="w-6 h-6 rounded pixel-border"
            style={{ backgroundColor: theme.accentColor }}
            title="Accent"
          />
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="pixel-outline" size="sm" className="flex-1">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-black">{theme.name}</DialogTitle>
                <DialogDescription>Preview how this theme will look on {identity.name}</DialogDescription>
              </DialogHeader>
              <ThemePreviewModal theme={theme} identity={identity} />
            </DialogContent>
          </Dialog>
          <Button 
            variant={isSelected ? "pixel" : "pixel-outline"}
            size="sm" 
            className="flex-1" 
            onClick={() => handleApplyTheme(theme._id)} 
            disabled={isSelected || isApplying === theme._id}
          >
            {isApplying === theme._id ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : isSelected ? (
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
          <PixelBorder variant="solid" shadow="sm" className="p-1 bg-pixel-pink">
            <Check className="h-3 w-3" />
          </PixelBorder>
        </div>
      )}
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <PixelBorder variant="solid" shadow="sm" className="flex-1 bg-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search themes for ${identity.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-0 bg-transparent"
            />
          </div>
        </PixelBorder>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs font-bold">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredThemes.length === 0 ? (
            <Card variant="pixel">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PixelBorder variant="solid" shadow="default" className="p-4 bg-pixel-mint mb-4">
                  <Palette className="h-8 w-8" />
                </PixelBorder>
                <h3 className="text-lg font-bold mb-2">No themes found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search or browse a different category
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredThemes.map((theme) => (
                <ThemePreview 
                  key={theme._id} 
                  theme={theme} 
                  isSelected={currentThemeId === theme._id} 
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ThemePreviewModal({ theme, identity }: { theme: Doc<"themes">; identity: Doc<"identities"> }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="text-center">
          <div
            className="w-8 h-8 rounded-full pixel-border"
            style={{ backgroundColor: theme.bgColor }}
          />
          <p className="text-xs mt-1">Background</p>
        </div>
        <div className="text-center">
          <div
            className="w-8 h-8 rounded-full pixel-border"
            style={{ backgroundColor: theme.textColor }}
          />
          <p className="text-xs mt-1">Text</p>
        </div>
        <div className="text-center">
          <div
            className="w-8 h-8 rounded-full pixel-border"
            style={{ backgroundColor: theme.accentColor }}
          />
          <p className="text-xs mt-1">Accent</p>
        </div>
      </div>

      <PixelBorder variant="solid" shadow="default" className="overflow-hidden">
        <div
          className="p-4"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <Avatar
              className="w-12 h-12 pixel-border"
              style={{ borderColor: theme.accentColor }}
            >
              <AvatarImage src={identity.avatarUrl || "/placeholder.svg?height=100&width=100"} alt="Preview" />
              <AvatarFallback style={{ backgroundColor: theme.accentColor, color: theme.bgColor }}>
                {identity.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold">{identity.name}</h3>
              <p className="text-sm opacity-70">/{identity.slug}</p>
            </div>
            {identity.bio && (
              <p className="text-sm opacity-70">{identity.bio}</p>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <div
              className="p-3 pixel-border flex items-center justify-between"
              style={{
                backgroundColor: theme.accentColor,
                color: theme.bgColor,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 text-xs flex items-center justify-center pixel-border"
                  style={{
                    backgroundColor: `${theme.bgColor}40`,
                    color: theme.bgColor,
                  }}
                >
                  🔗
                </div>
                <span className="text-sm font-bold">Example Link</span>
              </div>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </div>
            <div
              className="p-3 pixel-border flex items-center justify-between"
              style={{
                backgroundColor: theme.accentColor,
                color: theme.bgColor,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 text-xs flex items-center justify-center pixel-border"
                  style={{
                    backgroundColor: `${theme.bgColor}40`,
                    color: theme.bgColor,
                  }}
                >
                  📱
                </div>
                <span className="text-sm font-bold">Another Link</span>
              </div>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </div>
          </div>
        </div>
      </PixelBorder>
    </div>
  )
}
