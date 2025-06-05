"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  BarChart3,
  GripVertical,
  ArrowLeft,
  Save,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockProfiles } from "@/lib/mock-profiles"

// Mock links data for specific profiles
const mockProfileLinks = {
  "profile-1": [
    {
      id: "link-1",
      title: "My Portfolio",
      url: "https://alexjohnson.dev",
      description: "Check out my latest creative work",
      icon: "🎨",
      isActive: true,
      clicks: 245,
      order: 1,
      createdAt: "2024-01-15",
    },
    {
      id: "link-2",
      title: "YouTube Channel",
      url: "https://youtube.com/@alexcreates",
      description: "Creative tutorials and behind-the-scenes",
      icon: "📹",
      isActive: true,
      clicks: 189,
      order: 2,
      createdAt: "2024-01-10",
    },
    {
      id: "link-3",
      title: "Instagram",
      url: "https://instagram.com/alexcreates",
      description: "Daily inspiration and updates",
      icon: "📸",
      isActive: true,
      clicks: 156,
      order: 3,
      createdAt: "2024-01-08",
    },
    {
      id: "link-4",
      title: "Shop My Prints",
      url: "https://shop.alexjohnson.dev",
      description: "Limited edition art prints",
      icon: "🛒",
      isActive: false,
      clicks: 89,
      order: 4,
      createdAt: "2024-01-05",
    },
  ],
  "profile-2": [
    {
      id: "link-5",
      title: "GitHub",
      url: "https://github.com/sarahchen",
      description: "Open source projects and contributions",
      icon: "💻",
      isActive: true,
      clicks: 203,
      order: 1,
      createdAt: "2024-01-12",
    },
    {
      id: "link-6",
      title: "Tech Blog",
      url: "https://sarahtech.blog",
      description: "Latest insights on web development",
      icon: "📝",
      isActive: true,
      clicks: 178,
      order: 2,
      createdAt: "2024-01-08",
    },
    {
      id: "link-7",
      title: "LinkedIn",
      url: "https://linkedin.com/in/sarahchen",
      description: "Professional network and updates",
      icon: "💼",
      isActive: true,
      clicks: 134,
      order: 3,
      createdAt: "2024-01-06",
    },
  ],
  "profile-3": [
    {
      id: "link-8",
      title: "Spotify",
      url: "https://spotify.com/artist/mikemusic",
      description: "Latest tracks and albums",
      icon: "🎵",
      isActive: true,
      clicks: 312,
      order: 1,
      createdAt: "2024-01-05",
    },
    {
      id: "link-9",
      title: "SoundCloud",
      url: "https://soundcloud.com/mikerodriguez",
      description: "Unreleased tracks and demos",
      icon: "🎧",
      isActive: true,
      clicks: 198,
      order: 2,
      createdAt: "2024-01-03",
    },
  ],
}

interface PageLinksManagerProps {
  profileId: string
}

export function PageLinksManager({ profileId }: PageLinksManagerProps) {
  const profile = mockProfiles.find((p) => p.id === profileId)
  const [links, setLinks] = React.useState(mockProfileLinks[profileId as keyof typeof mockProfileLinks] || [])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [editingLink, setEditingLink] = React.useState<any>(null)
  const [newLink, setNewLink] = React.useState({
    title: "",
    url: "",
    description: "",
    icon: "🔗",
    isActive: true,
  })

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const activeLinks = links.filter((link) => link.isActive).length

  const handleCreateLink = () => {
    const link = {
      id: `link-${Date.now()}`,
      ...newLink,
      clicks: 0,
      order: links.length + 1,
      createdAt: new Date().toISOString(),
    }
    setLinks([...links, link])
    setNewLink({ title: "", url: "", description: "", icon: "🔗", isActive: true })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateLink = () => {
    setLinks(links.map((link) => (link.id === editingLink.id ? editingLink : link)))
    setEditingLink(null)
  }

  const deleteLink = (linkId: string) => {
    setLinks(links.filter((link) => link.id !== linkId))
  }

  const toggleLinkStatus = (linkId: string) => {
    setLinks(links.map((link) => (link.id === linkId ? { ...link, isActive: !link.isActive } : link)))
  }

  const duplicateLink = (linkId: string) => {
    const originalLink = links.find((l) => l.id === linkId)
    if (originalLink) {
      const duplicatedLink = {
        ...originalLink,
        id: `link-${Date.now()}`,
        title: `${originalLink.title} (Copy)`,
        clicks: 0,
        order: links.length + 1,
        createdAt: new Date().toISOString(),
      }
      setLinks([...links, duplicatedLink])
    }
  }

  const moveLink = (linkId: string, direction: "up" | "down") => {
    const linkIndex = links.findIndex((l) => l.id === linkId)
    if (linkIndex === -1) return

    const newLinks = [...links]
    const targetIndex = direction === "up" ? linkIndex - 1 : linkIndex + 1

    if (targetIndex >= 0 && targetIndex < newLinks.length) {
      ;[newLinks[linkIndex], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[linkIndex]]
      setLinks(newLinks)
    }
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
            <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
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
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Profile
          </a>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
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
            <p className="text-xs text-muted-foreground">This profile only</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Clicks</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{links.length > 0 ? Math.round(totalClicks / links.length) : 0}</div>
            <p className="text-xs text-muted-foreground">Per link</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{links.length > 0 ? Math.max(...links.map((l) => l.clicks)) : 0}</div>
            <p className="text-xs text-muted-foreground">
              {links.length > 0
                ? links.reduce((prev, current) => (prev.clicks > current.clicks ? prev : current)).title
                : "No links"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Links Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Links for {profile.name}</CardTitle>
              <CardDescription>Manage links specifically for this profile</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Link</DialogTitle>
                  <DialogDescription>Create a new link for {profile.name}'s profile</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="My Awesome Link"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={newLink.description}
                      onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                      placeholder="Brief description of the link"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <div className="flex gap-2">
                      <Input
                        id="icon"
                        value={newLink.icon}
                        onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                        placeholder="🔗"
                        className="w-20"
                      />
                      <div className="flex gap-1 flex-wrap">
                        {["🎨", "📹", "📸", "💻", "📝", "🎵", "🛒", "💼", "🎧", "📱"].map((emoji) => (
                          <Button
                            key={emoji}
                            variant="outline"
                            size="sm"
                            onClick={() => setNewLink({ ...newLink, icon: emoji })}
                            className="w-10 h-10 p-0"
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newLink.isActive}
                      onCheckedChange={(checked) => setNewLink({ ...newLink, isActive: checked })}
                    />
                    <Label htmlFor="active">Active (visible on profile)</Label>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateLink} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Links List */}
          {filteredLinks.length === 0 ? (
            <div className="text-center py-8">
              <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No links found" : "No links yet"}</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : `Create the first link for ${profile.name}'s profile`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLinks.map((link, index) => (
                <div
                  key={link.id}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-lg transition-all",
                    link.isActive ? "bg-background" : "bg-muted/50 opacity-75",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="cursor-grab active:cursor-grabbing p-1 h-8 w-8">
                      <GripVertical className="h-4 w-4" />
                    </Button>
                    <div className="text-2xl">{link.icon}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{link.title}</h3>
                      <Badge variant={link.isActive ? "default" : "secondary"} className="text-xs">
                        {link.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                    {link.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{link.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{link.clicks} clicks</span>
                      <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveLink(link.id, "up")}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveLink(link.id, "down")}
                        disabled={index === filteredLinks.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>
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
                        <DropdownMenuItem onClick={() => setEditingLink(link)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateLink(link.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleLinkStatus(link.id)}
                          className={link.isActive ? "text-orange-600" : "text-green-600"}
                        >
                          {link.isActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
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

      {/* Edit Link Dialog */}
      <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>Update the link details</DialogDescription>
          </DialogHeader>
          {editingLink && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingLink.description}
                  onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon</Label>
                <Input
                  id="edit-icon"
                  value={editingLink.icon}
                  onChange={(e) => setEditingLink({ ...editingLink, icon: e.target.value })}
                  className="w-20"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingLink.isActive}
                  onCheckedChange={(checked) => setEditingLink({ ...editingLink, isActive: checked })}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateLink} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingLink(null)} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
