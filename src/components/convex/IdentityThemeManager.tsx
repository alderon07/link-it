"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Palette, FolderOpen, Loader2 } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import Link from "next/link"
import { IdentityThemeEditor } from "./IdentityThemeEditor"
import { IdentityThemeGallery } from "./IdentityThemeGallery"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"

interface IdentityThemeManagerProps {
  identityId: Id<"identities">
}

export function IdentityThemeManager({ identityId }: IdentityThemeManagerProps) {
  const identity = useQuery(api.identities.queries.getIdentity, { identityId })
  const availableThemes = useQuery(api.themes.queries.getAllAvailableThemes)
  const updateIdentity = useMutation(api.identities.mutations.updateIdentity)

  if (identity === undefined || availableThemes === undefined) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!identity) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Identity not found</h3>
            <p className="text-muted-foreground">{`The identity you're looking for doesn't exist.`}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentTheme = identity.themeId 
    ? availableThemes.find(t => t._id === identity.themeId) 
    : null

  const handleApplyTheme = async (themeId: Id<"themes"> | null) => {
    await updateIdentity({
      identityId,
      themeId: themeId ?? undefined,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="pixel-outline" size="sm">
            <Link href="/admin/identities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Identities
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <PixelBorder variant="solid" shadow="sm" className="p-0.5 bg-pixel-teal">
              <Avatar className="h-12 w-12 pixel-border">
                <AvatarImage src={identity.avatarUrl || "/placeholder.svg"} alt={identity.name} />
                <AvatarFallback className="bg-pixel-teal font-bold">{identity.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </PixelBorder>
            <div>
              <h2 className="text-xl font-bold">{identity.name}</h2>
              <p className="text-muted-foreground">/{identity.slug}</p>
            </div>
            <Badge variant={identity.isPublic ? "retro" : "secondary"}>
              {identity.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
        </div>
        <Button asChild variant="pixel-outline">
          <a href={`/${identity.slug}`} target="_blank" rel="noreferrer">
            View Live Identity
          </a>
        </Button>
      </div>

      {currentTheme && (
        <PixelBorder variant="solid" shadow="sm" className="p-4 bg-card">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded pixel-border"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.bgColor} 0%, ${currentTheme.accentColor} 100%)` 
              }}
            />
            <div className="flex-1">
              <h3 className="font-bold">Current Theme: {currentTheme.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentTheme.isCustom ? "Custom Theme" : "System Theme"}
              </p>
            </div>
            <Button 
              variant="pixel-outline" 
              size="sm"
              onClick={() => handleApplyTheme(null)}
            >
              Remove Theme
            </Button>
          </div>
        </PixelBorder>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 pixel-border">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Identity-Specific Themes:</strong> The theme you customize here will only apply to{" "}
          <strong>{identity.name}</strong>. Each identity can have its own unique theme and appearance.
        </p>
      </div>

      <Tabs defaultValue="gallery" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Theme Gallery
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Custom Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <Card variant="pixel">
            <CardHeader>
              <CardTitle className="font-black pixel-text-shadow">Theme Gallery</CardTitle>
              <CardDescription>Choose from pre-designed themes for {identity.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <IdentityThemeGallery 
                identityId={identityId}
                identity={identity}
                themes={availableThemes}
                currentThemeId={identity.themeId}
                onApplyTheme={handleApplyTheme}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor">
          <Card variant="pixel">
            <CardHeader>
              <CardTitle className="font-black pixel-text-shadow">Custom Theme Editor</CardTitle>
              <CardDescription>
                Create a custom theme for {identity.name} with real-time preview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IdentityThemeEditor 
                identityId={identityId}
                identity={identity}
                currentTheme={currentTheme}
                onApplyTheme={handleApplyTheme}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
