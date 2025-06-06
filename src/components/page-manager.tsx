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
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-sm text-muted-foreground">{pages.length} pages</span>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="profile-select" className="text-sm font-medium">
              Select Profile:
            </Label>
            <Select value={selectedPage || ""} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Choose a profile to manage">
                  {currentPage && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={currentPage.avatar || "/placeholder.svg"} alt={currentPage.name} />
                        <AvatarFallback className="text-xs">{currentPage.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{currentPage.name}</span>
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
                      <Badge variant={page.isActive ? "default" : "secondary"} className="text-xs ml-auto">
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
            <Button>
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
                <Button onClick={handleCreateProfile} className="flex-1">
                  Create Profile
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Selected Profile Management */}
      {currentPage ? (
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentPage.avatar || "/placeholder.svg"} alt={currentPage.name} />
                    <AvatarFallback className="text-lg">{currentPage.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{currentPage.name}</CardTitle>
                    <CardDescription>@{currentPage.username}</CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={currentPage.isActive ? "default" : "secondary"}>
                        {currentPage.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {currentPage.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu className="self-start">
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
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
              <p className="text-sm text-muted-foreground">{currentPage.bio}</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{currentPage.linkCount} links</span>
                <span>{currentPage.views} views</span>
                <span>Created {new Date(currentPage.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Management Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <a href={`/admin/pages/${currentPage.id}`} className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Edit Profile</h3>
                      <p className="text-sm text-muted-foreground">Update profile information</p>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <a href={`/admin/pages/${currentPage.id}/links`} className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Link className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Manage Links</h3>
                      <p className="text-sm text-muted-foreground">{currentPage.linkCount} links</p>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <a href={`/admin/pages/${currentPage.id}/themes`} className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Customize Theme</h3>
                      <p className="text-sm text-muted-foreground">Colors & appearance</p>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <a href={`/${currentPage.username}`} target="_blank" rel="noreferrer" className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <ExternalLink className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">View Live Profile</h3>
                      <p className="text-sm text-muted-foreground">See public page</p>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* No Profile Selected State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Select a Profile to Manage</h3>
                <p className="text-muted-foreground">
                  Choose a profile from the dropdown above to edit its settings, manage links, and customize its theme.
                </p>
              </div>
              {pages.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Profiles Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Profiles</CardTitle>
          <CardDescription>Overview of all your profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Card key={page.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
                      <AvatarFallback className="text-sm">{page.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{page.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">@{page.username}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPage(page.id)}
                      className={selectedPage === page.id ? "bg-primary text-primary-foreground" : ""}
                    >
                      {selectedPage === page.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Badge variant={page.isActive ? "default" : "secondary"} className="text-xs">
                      {page.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {page.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{page.linkCount} links</span>
                    <span>{page.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
