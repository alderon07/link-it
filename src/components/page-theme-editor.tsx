"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Save, RotateCcw, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockProfiles } from "@/lib/mock-profiles"

interface CustomTheme {
  name: string
  primary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
  linkBackground: string
  linkForeground: string
  borderRadius: string
}

interface PageThemeEditorProps {
  pageId: string
}

export function PageThemeEditor({ pageId }: PageThemeEditorProps) {
  const page = mockProfiles.find((p) => p.id === pageId)
  const [themeName, setThemeName] = React.useState(`${page?.name || "Page"} Custom Theme`)
  const [colors, setColors] = React.useState<CustomTheme>({
    name: "custom",
    primary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#0f172a",
    foreground: "#f8fafc",
    muted: "#334155",
    border: "#475569",
    linkBackground: "#8b5cf6",
    linkForeground: "#ffffff",
    borderRadius: "0.75rem",
  })

  const [previewMode, setPreviewMode] = React.useState(false)

  // Load saved theme for this profile
  React.useEffect(() => {
    const profileThemeKey = `profile-${profileId}-custom-theme`
    const savedTheme = localStorage.getItem(profileThemeKey)
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme)
        setColors(theme)
        setThemeName(theme.name || `${profile?.name || "Profile"} Custom Theme`)
      } catch (error) {
        console.error("Error loading saved theme:", error)
      }
    }
  }, [profileId, profile?.name])

  const handleColorChange = (colorKey: keyof CustomTheme, value: string) => {
    setColors((prev) => ({ ...prev, [colorKey]: value }))
  }

  const applyPreview = () => {
    setPreviewMode(true)
    // Apply theme temporarily for preview - only to the preview container
    const previewContainer = document.querySelector(`[data-theme-preview="${profileId}"]`) as HTMLElement
    if (previewContainer) {
      previewContainer.style.setProperty("--primary", hexToHsl(colors.primary))
      previewContainer.style.setProperty("--accent", hexToHsl(colors.accent))
      previewContainer.style.setProperty("--background", hexToHsl(colors.background))
      previewContainer.style.setProperty("--foreground", hexToHsl(colors.foreground))
      previewContainer.style.setProperty("--muted", hexToHsl(colors.muted))
      previewContainer.style.setProperty("--border", hexToHsl(colors.border))
      previewContainer.style.setProperty("--link-background", hexToHsl(colors.linkBackground))
      previewContainer.style.setProperty("--link-foreground", hexToHsl(colors.linkForeground))
      previewContainer.style.setProperty("--radius", colors.borderRadius)
    }
  }

  const resetPreview = () => {
    setPreviewMode(false)
    // Reset preview container styles
    const previewContainer = document.querySelector(`[data-theme-preview="${profileId}"]`) as HTMLElement
    if (previewContainer) {
      previewContainer.style.removeProperty("--primary")
      previewContainer.style.removeProperty("--accent")
      previewContainer.style.removeProperty("--background")
      previewContainer.style.removeProperty("--foreground")
      previewContainer.style.removeProperty("--muted")
      previewContainer.style.removeProperty("--border")
      previewContainer.style.removeProperty("--link-background")
      previewContainer.style.removeProperty("--link-foreground")
      previewContainer.style.removeProperty("--radius")
    }
  }

  const saveTheme = () => {
    // Save the custom theme for this specific profile
    const customTheme = {
      ...colors,
      name: themeName,
      id: `custom-${profileId}`,
      type: "custom",
      profileId,
    }

    // Save to profile-specific storage
    const profileThemeKey = `profile-${profileId}-custom-theme`
    const profileActiveThemeKey = `profile-${profileId}-theme`

    localStorage.setItem(profileThemeKey, JSON.stringify(customTheme))
    localStorage.setItem(profileActiveThemeKey, JSON.stringify(customTheme))

    console.log("Saving theme for profile:", profileId, customTheme)

    setPreviewMode(false)

    // Show success message
    alert(`Custom theme saved for ${profile?.name}! Visit their live profile to see the changes.`)
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

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{profile.name}{`'s Custom Theme`}</CardTitle>
            <CardDescription>Create a unique theme specifically for {profile.name} {`'s profile`}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Theme Name</Label>
              <Input
                id="theme-name"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="Enter theme name"
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={colors.primary}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={colors.primary}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent"
                    type="color"
                    value={colors.accent}
                    onChange={(e) => handleColorChange("accent", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={colors.accent}
                    onChange={(e) => handleColorChange("accent", e.target.value)}
                    placeholder="#06b6d4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={colors.background}
                    onChange={(e) => handleColorChange("background", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={colors.background}
                    onChange={(e) => handleColorChange("background", e.target.value)}
                    placeholder="#0f172a"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foreground">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="foreground"
                    type="color"
                    value={colors.foreground}
                    onChange={(e) => handleColorChange("foreground", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={colors.foreground}
                    onChange={(e) => handleColorChange("foreground", e.target.value)}
                    placeholder="#f8fafc"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="muted">Muted Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="muted"
                    type="color"
                    value={colors.muted}
                    onChange={(e) => handleColorChange("muted", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={colors.muted}
                    onChange={(e) => handleColorChange("muted", e.target.value)}
                    placeholder="#334155"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="border">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="border"
                    type="color"
                    value={colors.border}
                    onChange={(e) => handleColorChange("border", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={colors.border}
                    onChange={(e) => handleColorChange("border", e.target.value)}
                    placeholder="#475569"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkBackground">Link Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="linkBackground"
                    type="color"
                    value={colors.linkBackground}
                    onChange={(e) => handleColorChange("linkBackground", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={colors.linkBackground}
                    onChange={(e) => handleColorChange("linkBackground", e.target.value)}
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkForeground">Link Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="linkForeground"
                    type="color"
                    value={colors.linkForeground}
                    onChange={(e) => handleColorChange("linkForeground", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={colors.linkForeground}
                    onChange={(e) => handleColorChange("linkForeground", e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <div className="space-y-3">
                <Select value={colors.borderRadius} onValueChange={(value) => handleColorChange("borderRadius", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None (0)</SelectItem>
                    <SelectItem value="0.125rem">XS (2px)</SelectItem>
                    <SelectItem value="0.25rem">SM (4px)</SelectItem>
                    <SelectItem value="0.375rem">Default (6px)</SelectItem>
                    <SelectItem value="0.5rem">MD (8px)</SelectItem>
                    <SelectItem value="0.75rem">LG (12px)</SelectItem>
                    <SelectItem value="1rem">XL (16px)</SelectItem>
                    <SelectItem value="1.5rem">2XL (24px)</SelectItem>
                    <SelectItem value="9999px">Full (Pill)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "None", value: "0" },
                    { label: "Small", value: "0.25rem" },
                    { label: "Medium", value: "0.75rem" },
                    { label: "Large", value: "1.5rem" },
                  ].map((preset) => (
                    <Button
                      key={preset.value}
                      variant={colors.borderRadius === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleColorChange("borderRadius", preset.value)}
                      className="text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button onClick={applyPreview} variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              {previewMode && (
                <Button onClick={resetPreview} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
              <Button onClick={saveTheme} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Theme
              </Button>
            </div>

            {previewMode && (
              <div className="p-3 bg-accent/20 rounded-md">
                <p className="text-sm text-accent-foreground">
                  Preview mode active. Click "Save Theme" to apply to {profile.name}'s profile or "Reset" to cancel.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{profile.name}'s Profile Preview</CardTitle>
            <CardDescription>See how the theme will look on {profile.name}'s profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              data-theme-preview={profileId}
              className="space-y-4 p-4 rounded-lg border-2 border-dashed border-border"
              style={{
                backgroundColor: colors.background,
                color: colors.foreground,
                borderColor: colors.border,
              }}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <Avatar className="w-16 h-16 border-4" style={{ borderColor: `${colors.primary}40` }}>
                  <AvatarImage src={profile.avatar || "/placeholder.svg?height=200&width=200"} alt="Preview" />
                  <AvatarFallback style={{ backgroundColor: colors.primary, color: colors.background }}>
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold">{profile.name}</h3>
                <p className="text-sm" style={{ color: colors.muted }}>
                  @{profile.username}
                </p>
                <Badge variant="secondary" style={{ backgroundColor: colors.muted, color: colors.foreground }}>
                  {profile.category}
                </Badge>
                <p className="text-sm" style={{ color: colors.muted }}>
                  {profile.bio}
                </p>
              </div>

              <div className="space-y-3">
                <Card
                  className="border-2"
                  style={{
                    backgroundColor: colors.linkBackground,
                    color: colors.linkForeground,
                    borderColor: colors.border,
                    borderRadius: colors.borderRadius,
                  }}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 flex items-center justify-center"
                        style={{
                          backgroundColor: `${colors.linkForeground}20`,
                          color: colors.linkForeground,
                          borderRadius: `calc(${colors.borderRadius} * 0.5)`,
                        }}
                      >
                        🎨
                      </div>
                      <div>
                        <h4 className="font-medium">My Portfolio</h4>
                        <p className="text-xs opacity-70">Check out my work</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </CardContent>
                </Card>

                <Card
                  className="border-2"
                  style={{
                    backgroundColor: colors.linkBackground,
                    color: colors.linkForeground,
                    borderColor: colors.border,
                    borderRadius: colors.borderRadius,
                  }}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 flex items-center justify-center"
                        style={{
                          backgroundColor: `${colors.linkForeground}20`,
                          color: colors.linkForeground,
                          borderRadius: `calc(${colors.borderRadius} * 0.5)`,
                        }}
                      >
                        📹
                      </div>
                      <div>
                        <h4 className="font-medium">YouTube Channel</h4>
                        <p className="text-xs opacity-70">Latest tutorials</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
