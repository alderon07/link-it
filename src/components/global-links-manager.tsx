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
import { mockProfiles } from "@/lib/mock-profiles"

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
  const [selectedProfile, setSelectedProfile] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("recent")

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.profileName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesProfile = selectedProfile === "all" || link.profileId === selectedProfile

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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{links.length}</div>
            <p className="text-xs text-muted-foreground">{activeLinks} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. CTR</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.8%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Spotify</div>
            <p className="text-xs text-muted-foreground">312 clicks</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Links</CardTitle>
          <CardDescription>Manage links across all your profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links, URLs, or profiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProfile} onValueChange={setSelectedProfile}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Profiles</SelectItem>
                {mockProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="clicks">Most Clicks</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Links ({sortedLinks.length})</CardTitle>
              <CardDescription>
                {selectedProfile === "all"
                  ? "Showing all links across profiles"
                  : `Showing links for ${mockProfiles.find((p) => p.id === selectedProfile)?.name}`}
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Link</DialogTitle>
                  <DialogDescription>Create a new link for one of your profiles</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile">Profile</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                                <AvatarFallback className="text-xs">{profile.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {profile.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="My Awesome Link" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input id="url" placeholder="https://example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input id="description" placeholder="Brief description of the link" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Add Link</Button>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {sortedLinks.length === 0 ? (
            <div className="text-center py-8">
              <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No links found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search criteria" : "Create your first link to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-2xl">{link.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{link.title}</h3>
                        <Badge variant={link.isActive ? "default" : "secondary"} className="text-xs">
                          {link.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Profile: {link.profileName}</span>
                        <span>{link.clicks} clicks</span>
                        <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
