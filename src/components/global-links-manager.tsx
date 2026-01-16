"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, ExternalLink, Copy, Eye, BarChart3, LinkIcon } from "lucide-react"
import { mockPages } from "@/lib/mock-pages"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { PixelDivider } from "@/components/pixel-art/PixelDivider"
import { FadeIn, SlideUp } from "@/components/animations/PageTransition"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"

// Mock links data
const mockLinks = [
  {
    id: "1",
    title: "My Portfolio",
    url: "https://alexjohnson.dev",
    description: "Check out my latest work",
    profileId: "profile-1",
    profileName: "Alex Johnson",
    clicks: 245,
    isActive: true,
    createdAt: "2024-01-15",
    icon: "🎨",
  },
  {
    id: "2",
    title: "YouTube Channel",
    url: "https://youtube.com/@alexcreates",
    description: "Creative tutorials and tips",
    profileId: "profile-1",
    profileName: "Alex Johnson",
    clicks: 189,
    isActive: true,
    createdAt: "2024-01-10",
    icon: "📹",
  },
  {
    id: "3",
    title: "GitHub",
    url: "https://github.com/sarahchen",
    description: "Open source projects",
    profileId: "profile-2",
    profileName: "Sarah Chen",
    clicks: 156,
    isActive: true,
    createdAt: "2024-01-12",
    icon: "💻",
  },
  {
    id: "4",
    title: "Tech Blog",
    url: "https://sarahtech.blog",
    description: "Latest tech insights",
    profileId: "profile-2",
    profileName: "Sarah Chen",
    clicks: 203,
    isActive: true,
    createdAt: "2024-01-08",
    icon: "📝",
  },
  {
    id: "5",
    title: "Spotify",
    url: "https://spotify.com/artist/mikemusic",
    description: "Latest tracks and albums",
    profileId: "profile-3",
    profileName: "Mike Rodriguez",
    clicks: 312,
    isActive: true,
    createdAt: "2024-01-05",
    icon: "🎵",
  },
]

export function GlobalLinksManager() {
  const [links, setLinks] = React.useState(mockLinks)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedPage, setSelectedPage] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("recent")

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.profileName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesProfile = selectedPage === "all" || link.profileId === selectedPage

    return matchesSearch && matchesProfile
  })

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    switch (sortBy) {
      case "clicks":
        return b.clicks - a.clicks
      case "title":
        return a.title.localeCompare(b.title)
      case "profile":
        return a.profileName.localeCompare(b.profileName)
      default: // recent
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const activeLinks = links.filter((link) => link.isActive).length

  const deleteLink = (linkId: string) => {
    setLinks(links.filter((link) => link.id !== linkId))
  }

  const toggleLinkStatus = (linkId: string) => {
    setLinks(links.map((link) => (link.id === linkId ? { ...link, isActive: !link.isActive } : link)))
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-4">
          <StaggerItem>
            <Card variant="pixel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">Total Links</CardTitle>
                <PixelIcon icon="link" size="xs" color="pink" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black pixel-text-shadow">
                  <CountUp value={links.length} duration={0.5} />
                </div>
                <p className="text-xs text-muted-foreground">{activeLinks} active</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card variant="pixel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">Total Clicks</CardTitle>
                <PixelIcon icon="cursor" size="xs" color="teal" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black pixel-text-shadow">
                  <CountUp value={totalClicks} duration={0.8} />
                </div>
                <p className="text-xs text-muted-foreground">Across all identities</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card variant="pixel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">Avg. CTR</CardTitle>
                <PixelIcon icon="arrow" size="xs" color="yellow" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black pixel-text-shadow text-pixel-teal">6.8%</div>
                <p className="text-xs text-muted-foreground">+1.2% from last month</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card variant="pixel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">Top Performer</CardTitle>
                <PixelIcon icon="star" size="xs" color="coral" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black pixel-text-shadow">Spotify</div>
                <p className="text-xs text-muted-foreground">312 clicks</p>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </FadeIn>

      {/* Filters and Search */}
      <SlideUp delay={0.1}>
        <Card variant="pixel">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PixelIcon icon="link" size="sm" color="teal" />
              <CardTitle className="font-black">All Links</CardTitle>
            </div>
            <CardDescription>Manage links across all your identities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PixelDivider variant="dashed" className="mb-4" />
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-full">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search links, URLs, or identities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pixel-border w-full max-w-full"
                />
              </div>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger className="w-full sm:w-[200px] max-w-full pixel-border">
                  <SelectValue placeholder="Filter by identity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Identities</SelectItem>
                  {mockPages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[150px] max-w-full pixel-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="clicks">Most Clicks</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="profile">Identity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      {/* Links List */}
      <SlideUp delay={0.2}>
        <Card variant="pixel" className="w-full max-w-full">
          <CardHeader className="w-full max-w-full">
            <div className="flex items-center justify-between w-full max-w-full">
              <div>
                <div className="flex items-center gap-2">
                  <PixelIcon icon="star" size="sm" color="yellow" />
                  <CardTitle className="font-black">Links ({sortedLinks.length})</CardTitle>
                </div>
                <CardDescription>
                  {selectedPage === "all"
                    ? "Showing all links across identities"
                    : `Showing links for ${mockPages.find((p) => p.id === selectedPage)?.name}`}
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="pixel">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-black pixel-text-shadow">Add New Link</DialogTitle>
                    <DialogDescription>Create a new link for one of your identities</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile" className="font-bold">Identity</Label>
                      <Select>
                        <SelectTrigger className="pixel-border">
                          <SelectValue placeholder="Select an identity" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPages.map((page) => (
                            <SelectItem key={page.id} value={page.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
                                  <AvatarFallback className="text-xs">{page.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {page.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-bold">Title</Label>
                      <Input id="title" placeholder="My Awesome Link" className="pixel-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url" className="font-bold">URL</Label>
                      <Input id="url" placeholder="https://example.com" className="pixel-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="font-bold">Description (optional)</Label>
                      <Input id="description" placeholder="Brief description of the link" className="pixel-border" />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="pixel" className="flex-1">Add Link</Button>
                      <Button variant="pixel-outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <PixelDivider variant="dashed" className="mb-4" />
            {sortedLinks.length === 0 ? (
              <div className="text-center py-8">
                <PixelBorder variant="solid" shadow="default" className="p-4 bg-pixel-coral mx-auto w-fit mb-4">
                  <PixelIcon icon="cross" size="lg" />
                </PixelBorder>
                <h3 className="text-lg font-black pixel-text-shadow mb-2">No links found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search criteria" : "Create your first link to get started"}
                </p>
              </div>
            ) : (
              <StaggerContainer className="space-y-4">
                {sortedLinks.map((link, index) => {
                  const colors = ["bg-pixel-pink", "bg-pixel-teal", "bg-pixel-yellow", "bg-pixel-mint", "bg-pixel-coral"]
                  const colorClass = colors[index % colors.length]

                  return (
                    <StaggerItem key={link.id}>
                      <PixelBorder variant="solid" shadow="sm" className="p-4 bg-card hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform group w-full max-w-full">
                        <div className="flex items-center justify-between gap-2 w-full max-w-full">
                          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                            <div className={`w-10 h-10 ${colorClass} pixel-border flex items-center justify-center text-lg group-hover:pixel-bounce`}>
                              {link.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold truncate group-hover:text-pixel-pink transition-colors">{link.title}</h3>
                                <Badge variant={link.isActive ? "retro" : "secondary"} className="text-xs">
                                  {link.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                              <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs flex-wrap">
                                <span className="text-pixel-teal font-medium truncate">Identity: {link.profileName}</span>
                                <span className="text-pixel-pink font-medium">{link.clicks} clicks</span>
                                <span className="text-muted-foreground truncate">Created {new Date(link.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Button size="sm" variant="pixel-outline" className="h-8 w-8 p-0" asChild>
                              <a href={link.url} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="pixel-outline" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Link
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy URL
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  View Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleLinkStatus(link.id)}
                                  className={link.isActive ? "text-orange-600" : "text-green-600"}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  {link.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteLink(link.id)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </PixelBorder>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            )}
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
