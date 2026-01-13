"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Link, Eye, Trash2, Copy, Settings, ExternalLink, Users } from "lucide-react"
import { mockPages } from "@/lib/mock-pages"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { PixelDivider } from "@/components/pixel-art/PixelDivider"
import { FadeIn, SlideUp } from "@/components/animations/PageTransition"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"

export function PageManager() {
  const [pages, setPages] = React.useState(mockPages)
  const [selectedPage, setSelectedPage] = React.useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [newPage, setNewPage] = React.useState({
    name: "",
    username: "",
    bio: "",
    category: "personal",
  })

  const currentPage= selectedPage ? pages.find((p) => p.id === selectedPage) : null

  const handleCreateProfile = () => {
    const page = {
      id: `profile-${Date.now()}`,
      ...newPage,
      avatar: "/placeholder.svg?height=300&width=300",
      isActive: true,
      linkCount: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    }
    setPages([...pages, page])
    setNewPage({ name: "", username: "", bio: "", category: "personal" })
    setIsCreateDialogOpen(false)
  }

  const togglePageStatus = (pageId: string) => {
    setPages(
      pages.map((page) => (page.id === pageId ? { ...page, isActive: !page.isActive } : page)),
    )
  }

  const deletePage = (pageId: string) => {
    setPages(pages.filter((page) => page.id !== pageId))
    if (selectedPage === pageId) {
      setSelectedPage(null)
    }
  }

  const duplicatePage = (pageId: string) => {
    const originalPage = pages.find((p) => p.id === pageId)
    if (originalPage) {
      const duplicatedPage = {
        ...originalPage,
        id: `profile-${Date.now()}`,
        name: `${originalPage.name} (Copy)`,
        username: `${originalPage.username}-copy`,
        views: 0,
        createdAt: new Date().toISOString(),
      }
      setPages([...pages, duplicatedPage])
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Selection Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <PixelBorder variant="solid" shadow="sm" className="px-3 py-1.5 bg-card">
              <div className="flex items-center gap-2 text-sm">
                <PixelIcon icon="star" size="xs" color="teal" />
                <CountUp value={pages.length} duration={0.5} />
                <span className="text-muted-foreground">pages</span>
              </div>
            </PixelBorder>
            <div className="flex items-center gap-2">
              <Label htmlFor="profile-select" className="text-sm font-bold">
                Select Profile:
              </Label>
              <Select value={selectedPage || ""} onValueChange={setSelectedPage}>
                <SelectTrigger className="w-[250px] pixel-border">
                  <SelectValue placeholder="Choose a profile to manage">
                    {currentPage && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5 pixel-border">
                          <AvatarImage src={currentPage.avatar || "/placeholder.svg"} alt={currentPage.name} />
                          <AvatarFallback className="text-xs">{currentPage.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{currentPage.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
                          <AvatarFallback className="text-xs">{page.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{page.name}</span>
                        <Badge variant={page.isActive ? "retro" : "secondary"} className="text-xs ml-auto">
                          {page.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="pixel">
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Profile</DialogTitle>
              <DialogDescription>Set up a new profile for different purposes or audiences</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={newPage.name}
                  onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                  placeholder="Alex Johnson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newPage.username}
                  onChange={(e) => setNewPage({ ...newPage, username: e.target.value })}
                  placeholder="alexcreates"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={newPage.bio}
                  onChange={(e) => setNewPage({ ...newPage, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newPage.category}
                  onChange={(e) => setNewPage({ ...newPage, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                  <option value="creative">Creative</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="pixel" onClick={handleCreateProfile} className="flex-1">
                  Create Profile
                </Button>
                <Button variant="pixel-outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </FadeIn>

      {/* Selected Profile Management */}
      {currentPage ? (
        <SlideUp delay={0.1}>
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <Card variant="pixel">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <PixelBorder variant="solid" shadow="sm" className="p-0.5 bg-pixel-teal">
                      <Avatar className="h-16 w-16 pixel-border">
                        <AvatarImage src={currentPage.avatar || "/placeholder.svg"} alt={currentPage.name} />
                        <AvatarFallback className="text-lg font-bold bg-pixel-teal">{currentPage.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </PixelBorder>
                    <div>
                      <CardTitle className="text-xl font-black pixel-text-shadow">{currentPage.name}</CardTitle>
                      <CardDescription className="font-medium">@{currentPage.username}</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={currentPage.isActive ? "retro" : "secondary"}>
                          {currentPage.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="capitalize pixel-border">
                          {currentPage.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="pixel-outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={`/admin/pages/${currentPage.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/${currentPage.username}`} target="_blank" rel="noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicatePage(currentPage.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => togglePageStatus(currentPage.id)}
                        className={currentPage.isActive ? "text-orange-600" : "text-green-600"}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {currentPage.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deletePage(currentPage.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <PixelDivider variant="dashed" className="my-2" />
                <p className="text-sm text-muted-foreground">{currentPage.bio}</p>
                <div className="flex justify-between text-sm">
                  <PixelBorder variant="solid" shadow="sm" className="px-2 py-1 bg-pixel-mint">
                    <span className="font-bold">{currentPage.linkCount} links</span>
                  </PixelBorder>
                  <PixelBorder variant="solid" shadow="sm" className="px-2 py-1 bg-pixel-yellow">
                    <span className="font-bold">{currentPage.views} views</span>
                  </PixelBorder>
                  <PixelBorder variant="solid" shadow="sm" className="px-2 py-1 bg-pixel-coral">
                    <span className="font-bold text-xs">Created {new Date(currentPage.createdAt).toLocaleDateString()}</span>
                  </PixelBorder>
                </div>
              </CardContent>
            </Card>

            {/* Profile Management Actions */}
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <Card variant="pixel-interactive" className="cursor-pointer group">
                  <CardContent className="p-6">
                    <a href={`/admin/pages/${currentPage.id}`} className="block">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pixel-teal pixel-border group-hover:pixel-bounce">
                          <PixelIcon icon="star" size="sm" />
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-pixel-pink transition-colors">Edit Profile</h3>
                          <p className="text-sm text-muted-foreground">Update profile information</p>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card variant="pixel-interactive" className="cursor-pointer group">
                  <CardContent className="p-6">
                    <a href={`/admin/pages/${currentPage.id}/links`} className="block">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pixel-mint pixel-border group-hover:pixel-bounce">
                          <PixelIcon icon="link" size="sm" />
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-pixel-pink transition-colors">Manage Links</h3>
                          <p className="text-sm text-muted-foreground">{currentPage.linkCount} links</p>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card variant="pixel-interactive" className="cursor-pointer group">
                  <CardContent className="p-6">
                    <a href={`/admin/pages/${currentPage.id}/themes`} className="block">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pixel-pink pixel-border group-hover:pixel-bounce">
                          <PixelIcon icon="sparkle" size="sm" />
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-pixel-pink transition-colors">Customize Theme</h3>
                          <p className="text-sm text-muted-foreground">Colors & appearance</p>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card variant="pixel-interactive" className="cursor-pointer group">
                  <CardContent className="p-6">
                    <a href={`/${currentPage.username}`} target="_blank" rel="noreferrer" className="block">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pixel-yellow pixel-border group-hover:pixel-bounce">
                          <PixelIcon icon="arrow" size="sm" />
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-pixel-pink transition-colors">View Live Profile</h3>
                          <p className="text-sm text-muted-foreground">See public page</p>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </SlideUp>
      ) : (
        /* No Profile Selected State */
        <FadeIn>
          <Card variant="pixel">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <PixelBorder variant="solid" shadow="default" className="p-4 bg-pixel-mint mx-auto w-fit">
                  <PixelIcon icon="cursor" size="lg" />
                </PixelBorder>
                <div>
                  <h3 className="text-lg font-black pixel-text-shadow">Select a Profile to Manage</h3>
                  <p className="text-muted-foreground">
                    Choose a profile from the dropdown above to edit its settings, manage links, and customize its theme.
                  </p>
                </div>
                {pages.length === 0 && (
                  <Button variant="pixel" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* All Profiles Overview */}
      <SlideUp delay={0.2}>
        <Card variant="pixel">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PixelIcon icon="star" size="sm" color="yellow" />
              <CardTitle className="font-black">All Profiles</CardTitle>
            </div>
            <CardDescription>Overview of all your profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <PixelDivider variant="dashed" className="mb-4" />
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pages.map((page, index) => {
                const colors = ["bg-pixel-pink", "bg-pixel-teal", "bg-pixel-yellow", "bg-pixel-mint", "bg-pixel-coral"]
                const colorClass = colors[index % colors.length]

                return (
                  <StaggerItem key={page.id}>
                    <Card variant="pixel-interactive" className="relative group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <PixelBorder variant="solid" shadow="sm" className={`p-0.5 ${colorClass}`}>
                            <Avatar className="h-10 w-10 pixel-border">
                              <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
                              <AvatarFallback className={`text-sm font-bold ${colorClass}`}>{page.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </PixelBorder>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate group-hover:text-pixel-pink transition-colors">{page.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">@{page.username}</p>
                          </div>
                          <Button
                            variant={selectedPage === page.id ? "pixel" : "pixel-outline"}
                            size="sm"
                            onClick={() => setSelectedPage(page.id)}
                          >
                            {selectedPage === page.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <Badge variant={page.isActive ? "retro" : "secondary"} className="text-xs">
                            {page.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize pixel-border">
                            {page.category}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-pixel-teal">{page.linkCount} links</span>
                          <span className="text-pixel-pink">{page.views} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
