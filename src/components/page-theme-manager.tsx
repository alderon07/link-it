"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Palette, FolderOpen, LinkIcon } from "lucide-react"
import { mockPages } from "@/lib/mock-pages"
import { PageThemeEditor } from "@/components/page-theme-editor"
import { PageThemeGallery } from "./page-theme-gallery"
import Link from "next/link"

interface PageThemeManagerProps {
  pageId: string
}

export function PageThemeManager({ pageId }: PageThemeManagerProps) {
  const page = mockPages.find((p) => p.id === pageId)

  if (!page) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Page not found</h3>
            <p className="text-muted-foreground">{`The page you're looking for doesn't exist.`}</p>
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
            <Link href="/admin/pages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pages
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
              <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{page.name}</h2>
              <p className="text-muted-foreground">@{page.username}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {page.category}
            </Badge>
            <Badge variant={page.isActive ? "default" : "secondary"}>
              {page.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <Button asChild variant="outline">
          <a href={`/${page.username}`} target="_blank" rel="noreferrer">
            View Live Page
          </a>
        </Button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Page-Specific Themes:</strong> The theme you customize here will only apply to{" "}
          <strong>{page.name}{`'s`}</strong> page. Each page can have its own unique theme and appearance.
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
              <CardDescription>Choose from pre-designed themes for {page.name}{`'s page`}</CardDescription>
            </CardHeader>
            <CardContent>
              <PageThemeGallery pageId={pageId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Custom Theme Editor</CardTitle>
              <CardDescription>
                Create a custom theme for {page.name}{`'s page`} with real-time preview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageThemeEditor pageId={pageId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
