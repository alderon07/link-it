"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Palette, FolderOpen } from "lucide-react"
import { mockProfiles } from "@/lib/mock-profiles"
import { ProfileThemeEditor } from "@/components/profile-theme-editor"
import { ProfileThemeGallery } from "@/components/profile-theme-gallery"

interface PageThemeManagerProps {
  pageId: string
}

export function PageThemeManager({ pageId }: PageThemeManagerProps) {
  const page = mockProfiles.find((p) => p.id === pageId)

  if (!page) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
            <p className="text-muted-foreground">{`The profile you're looking for doesn't exist.`}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <a href="/admin/profiles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profiles
            </a>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
              <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {profile.category}
            </Badge>
            <Badge variant={profile.isActive ? "default" : "secondary"}>
              {profile.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <Button asChild variant="outline">
          <a href={`/${profile.username}`} target="_blank" rel="noreferrer">
            View Live Profile
          </a>
        </Button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Profile-Specific Themes:</strong> The theme you customize here will only apply to{" "}
          <strong>{profile.name}{`'s`}</strong> profile page. Each profile can have its own unique theme and appearance.
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
          <Card>
            <CardHeader>
              <CardTitle>Theme Gallery</CardTitle>
              <CardDescription>Choose from pre-designed themes for {profile.name}{`'s profile`}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileThemeGallery profileId={profileId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Custom Theme Editor</CardTitle>
              <CardDescription>
                Create a custom theme for {profile.name}{`'s profile`} with real-time preview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileThemeEditor profileId={profileId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
