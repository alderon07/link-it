"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Save, RotateCcw, Eye, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id, Doc } from "../../../convex/_generated/dataModel"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { toast } from "sonner"

interface CustomTheme {
  name: string
  bgColor: string
  textColor: string
  accentColor: string
  buttonStyle: string
  fontFamily: string
}

interface IdentityThemeEditorProps {
  identityId: Id<"identities">
  identity: Doc<"identities">
  currentTheme?: Doc<"themes"> | null
  onApplyTheme: (themeId: Id<"themes"> | null) => Promise<void>
}

export function IdentityThemeEditor({ 
  identityId, 
  identity, 
  currentTheme,
  onApplyTheme 
}: IdentityThemeEditorProps) {
  const createTheme = useMutation(api.themes.mutations.createTheme)
  const updateTheme = useMutation(api.themes.mutations.updateTheme)
  
  const [themeName, setThemeName] = React.useState(`${identity.name} Custom Theme`)
  const [colors, setColors] = React.useState<CustomTheme>({
    name: "custom",
    bgColor: currentTheme?.bgColor || "#1a1a2e",
    textColor: currentTheme?.textColor || "#eaeaea",
    accentColor: currentTheme?.accentColor || "#e94560",
    buttonStyle: currentTheme?.buttonStyle || "solid",
    fontFamily: currentTheme?.fontFamily || "system",
  })

  const [previewMode, setPreviewMode] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  // Update colors when currentTheme changes
  React.useEffect(() => {
    if (currentTheme) {
      setThemeName(currentTheme.name)
      setColors({
        name: currentTheme.name,
        bgColor: currentTheme.bgColor,
        textColor: currentTheme.textColor,
        accentColor: currentTheme.accentColor,
        buttonStyle: currentTheme.buttonStyle || "solid",
        fontFamily: currentTheme.fontFamily || "system",
      })
    }
  }, [currentTheme])

  const handleColorChange = (colorKey: keyof CustomTheme, value: string) => {
    setColors((prev) => ({ ...prev, [colorKey]: value }))
  }

  const applyPreview = () => {
    setPreviewMode(true)
  }

  const resetPreview = () => {
    setPreviewMode(false)
    // Reset to current theme or defaults
    if (currentTheme) {
      setColors({
        name: currentTheme.name,
        bgColor: currentTheme.bgColor,
        textColor: currentTheme.textColor,
        accentColor: currentTheme.accentColor,
        buttonStyle: currentTheme.buttonStyle || "solid",
        fontFamily: currentTheme.fontFamily || "system",
      })
      setThemeName(currentTheme.name)
    } else {
      setColors({
        name: "custom",
        bgColor: "#1a1a2e",
        textColor: "#eaeaea",
        accentColor: "#e94560",
        buttonStyle: "solid",
        fontFamily: "system",
      })
      setThemeName(`${identity.name} Custom Theme`)
    }
  }

  const saveTheme = async () => {
    if (!themeName.trim()) {
      toast.error("Theme name is required")
      return
    }

    setIsSaving(true)
    try {
      let themeId: Id<"themes">

      // If we're editing an existing custom theme, update it
      if (currentTheme?.isCustom && currentTheme._id) {
        await updateTheme({
          themeId: currentTheme._id,
          name: themeName,
          bgColor: colors.bgColor,
          textColor: colors.textColor,
          accentColor: colors.accentColor,
          buttonStyle: colors.buttonStyle,
          fontFamily: colors.fontFamily,
        })
        themeId = currentTheme._id
        toast.success("Theme updated successfully!")
      } else {
        // Create a new custom theme
        const newTheme = await createTheme({
          name: themeName,
          bgColor: colors.bgColor,
          textColor: colors.textColor,
          accentColor: colors.accentColor,
          buttonStyle: colors.buttonStyle,
          fontFamily: colors.fontFamily,
        })
        themeId = newTheme!._id
        toast.success("Theme created successfully!")
      }

      // Apply the theme to the identity
      await onApplyTheme(themeId)
      setPreviewMode(false)
    } catch (error) {
      toast.error("Failed to save theme")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card variant="pixel">
          <CardHeader>
            <CardTitle className="font-black pixel-text-shadow">{identity.name}&apos;s Custom Theme</CardTitle>
            <CardDescription>Create a unique theme specifically for {identity.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-name" className="font-bold">Theme Name</Label>
              <PixelBorder variant="solid" shadow="sm" className="bg-card">
                <Input
                  id="theme-name"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Enter theme name"
                  className="border-0 bg-transparent"
                />
              </PixelBorder>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bgColor" className="font-bold">Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={colors.bgColor}
                    onChange={(e) => handleColorChange("bgColor", e.target.value)}
                    className="w-12 h-10 p-1 pixel-border"
                  />
                  <PixelBorder variant="solid" shadow="sm" className="flex-1 bg-card">
                    <Input
                      value={colors.bgColor}
                      onChange={(e) => handleColorChange("bgColor", e.target.value)}
                      placeholder="#1a1a2e"
                      className="border-0 bg-transparent uppercase"
                    />
                  </PixelBorder>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor" className="font-bold">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={colors.textColor}
                    onChange={(e) => handleColorChange("textColor", e.target.value)}
                    className="w-12 h-10 p-1 pixel-border"
                  />
                  <PixelBorder variant="solid" shadow="sm" className="flex-1 bg-card">
                    <Input
                      value={colors.textColor}
                      onChange={(e) => handleColorChange("textColor", e.target.value)}
                      placeholder="#eaeaea"
                      className="border-0 bg-transparent uppercase"
                    />
                  </PixelBorder>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor" className="font-bold">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={colors.accentColor}
                    onChange={(e) => handleColorChange("accentColor", e.target.value)}
                    className="w-12 h-10 p-1 pixel-border"
                  />
                  <PixelBorder variant="solid" shadow="sm" className="flex-1 bg-card">
                    <Input
                      value={colors.accentColor}
                      onChange={(e) => handleColorChange("accentColor", e.target.value)}
                      placeholder="#e94560"
                      className="border-0 bg-transparent uppercase"
                    />
                  </PixelBorder>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonStyle" className="font-bold">Button Style</Label>
                <PixelBorder variant="solid" shadow="sm" className="bg-card">
                  <Select 
                    value={colors.buttonStyle} 
                    onValueChange={(value) => handleColorChange("buttonStyle", value)}
                  >
                    <SelectTrigger className="border-0 bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="soft">Soft</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                    </SelectContent>
                  </Select>
                </PixelBorder>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="fontFamily" className="font-bold">Font Family</Label>
              <PixelBorder variant="solid" shadow="sm" className="bg-card">
                <Select 
                  value={colors.fontFamily} 
                  onValueChange={(value) => handleColorChange("fontFamily", value)}
                >
                  <SelectTrigger className="border-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="poppins">Poppins</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </PixelBorder>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button onClick={applyPreview} variant="pixel-outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              {previewMode && (
                <Button onClick={resetPreview} variant="pixel-outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
              <Button onClick={saveTheme} variant="pixel" className="flex-1" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Theme
              </Button>
            </div>

            {previewMode && (
              <PixelBorder variant="solid" shadow="sm" className="p-3 bg-pixel-mint">
                <p className="text-sm font-bold">
                  Preview mode active. Click &quot;Save Theme&quot; to apply to {identity.name} or &quot;Reset&quot; to cancel.
                </p>
              </PixelBorder>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card variant="pixel">
          <CardHeader>
            <CardTitle className="font-black pixel-text-shadow">{identity.name}&apos;s Preview</CardTitle>
            <CardDescription>See how the theme will look on {identity.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <PixelBorder variant="solid" shadow="default" className="overflow-hidden">
              <div
                className="space-y-4 p-4"
                style={{
                  backgroundColor: previewMode ? colors.bgColor : (currentTheme?.bgColor || "#1a1a2e"),
                  color: previewMode ? colors.textColor : (currentTheme?.textColor || "#eaeaea"),
                }}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <Avatar 
                    className="w-16 h-16 pixel-border" 
                    style={{ 
                      borderColor: `${previewMode ? colors.accentColor : (currentTheme?.accentColor || "#e94560")}40` 
                    }}
                  >
                    <AvatarImage src={identity.avatarUrl || "/placeholder.svg?height=200&width=200"} alt="Preview" />
                    <AvatarFallback 
                      style={{ 
                        backgroundColor: previewMode ? colors.accentColor : (currentTheme?.accentColor || "#e94560"), 
                        color: previewMode ? colors.bgColor : (currentTheme?.bgColor || "#1a1a2e")
                      }}
                    >
                      {identity.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold">{identity.name}</h3>
                  <p className="text-sm opacity-70">
                    /{identity.slug}
                  </p>
                  {identity.bio && (
                    <p className="text-sm opacity-70">
                      {identity.bio}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Card
                    className="pixel-border"
                    style={{
                      backgroundColor: previewMode ? colors.accentColor : (currentTheme?.accentColor || "#e94560"),
                      color: previewMode ? colors.bgColor : (currentTheme?.bgColor || "#1a1a2e"),
                      borderColor: previewMode ? colors.accentColor : (currentTheme?.accentColor || "#e94560"),
                    }}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 flex items-center justify-center pixel-border"
                          style={{
                            backgroundColor: `${previewMode ? colors.bgColor : (currentTheme?.bgColor || "#1a1a2e")}40`,
                          }}
                        >
                          🎨
                        </div>
                        <div>
                          <h4 className="font-bold">My Portfolio</h4>
                          <p className="text-xs opacity-70">Check out my work</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 opacity-70" />
                    </CardContent>
                  </Card>

                  <Card
                    className="pixel-border"
                    style={{
                      backgroundColor: previewMode ? colors.accentColor : (currentTheme?.accentColor || "#e94560"),
                      color: previewMode ? colors.bgColor : (currentTheme?.bgColor || "#1a1a2e"),
                      borderColor: previewMode ? colors.accentColor : (currentTheme?.accentColor || "#e94560"),
                    }}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 flex items-center justify-center pixel-border"
                          style={{
                            backgroundColor: `${previewMode ? colors.bgColor : (currentTheme?.bgColor || "#1a1a2e")}40`,
                          }}
                        >
                          📹
                        </div>
                        <div>
                          <h4 className="font-bold">YouTube Channel</h4>
                          <p className="text-xs opacity-70">Latest tutorials</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 opacity-70" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </PixelBorder>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
