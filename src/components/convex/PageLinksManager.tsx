"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  Save,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage, usePageLinks, usePageLinkStats, useLinkMutations } from "@/hooks/convex";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface LinkData {
  _id: Id<"links">;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  clickCount: number;
  orderIndex: number;
}

interface PageLinksManagerProps {
  pageId: Id<"pages">;
}

export function PageLinksManager({ pageId }: PageLinksManagerProps) {
  const page = usePage(pageId);
  const links = usePageLinks(pageId);
  const stats = usePageLinkStats(pageId);
  const { createLink, updateLink, deleteLink, reorderLinks } = useLinkMutations();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingLink, setEditingLink] = React.useState<{
    _id: Id<"links">;
    title: string;
    url: string;
    description?: string;
    icon?: string;
    isActive: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newLink, setNewLink] = React.useState({
    title: "",
    url: "",
    description: "",
    icon: "",
    isActive: true,
  });

  const filteredLinks = (links as LinkData[] | undefined)?.filter(
    (link: LinkData) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast.error("Title and URL are required");
      return;
    }

    setIsLoading(true);
    try {
      await createLink({
        pageId,
        title: newLink.title,
        url: newLink.url,
        description: newLink.description || undefined,
        icon: newLink.icon || undefined,
        isActive: newLink.isActive,
      });
      setNewLink({ title: "", url: "", description: "", icon: "", isActive: true });
      setIsCreateDialogOpen(false);
      toast.success("Link created successfully!");
    } catch (error) {
      toast.error("Failed to create link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink) return;

    setIsLoading(true);
    try {
      await updateLink({
        linkId: editingLink._id,
        title: editingLink.title,
        url: editingLink.url,
        description: editingLink.description || undefined,
        icon: editingLink.icon || undefined,
        isActive: editingLink.isActive,
      });
      setEditingLink(null);
      toast.success("Link updated successfully!");
    } catch (error) {
      toast.error("Failed to update link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: Id<"links">) => {
    try {
      await deleteLink({ linkId });
      toast.success("Link deleted");
    } catch (error) {
      toast.error("Failed to delete link");
      console.error(error);
    }
  };

  const toggleLinkStatus = async (linkId: Id<"links">, currentStatus: boolean) => {
    try {
      await updateLink({ linkId, isActive: !currentStatus });
      toast.success(currentStatus ? "Link deactivated" : "Link activated");
    } catch (error) {
      toast.error("Failed to update link");
      console.error(error);
    }
  };

  const moveLink = async (linkId: Id<"links">, direction: "up" | "down") => {
    if (!links) return;
    const typedLinks = links as LinkData[];

    const linkIndex = typedLinks.findIndex((l: LinkData) => l._id === linkId);
    if (linkIndex === -1) return;

    const targetIndex = direction === "up" ? linkIndex - 1 : linkIndex + 1;
    if (targetIndex < 0 || targetIndex >= typedLinks.length) return;

    const newLinkIds = typedLinks.map((l: LinkData) => l._id);
    [newLinkIds[linkIndex], newLinkIds[targetIndex]] = [newLinkIds[targetIndex], newLinkIds[linkIndex]];

    try {
      await reorderLinks({ pageId, linkIds: newLinkIds });
    } catch (error) {
      toast.error("Failed to reorder links");
      console.error(error);
    }
  };

  if (page === undefined || links === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (page === null) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Page not found</h3>
            <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={page.avatarUrl || "/placeholder.svg"} alt={page.name} />
            <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold truncate">{page.name}</h2>
            <p className="text-muted-foreground truncate">/{page.slug}</p>
          </div>
          <Badge variant={page.isPublic ? "default" : "secondary"} className="shrink-0">
            {page.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto shrink-0">
          <a href={`/${page.slug}`} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Page
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
            <div className="text-2xl font-bold">{stats?.totalLinks || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.activeLinks || 0} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClicks?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">This page only</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Clicks</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalLinks ? Math.round((stats.totalClicks || 0) / stats.totalLinks) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per link</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.topLinks?.[0]?.clickCount || 0}</div>
            <p className="text-xs text-muted-foreground truncate">
              {stats?.topLinks?.[0]?.title || "No links"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Links Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="truncate">Links for {page.name}</CardTitle>
              <CardDescription>Manage links for this page</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Link</DialogTitle>
                  <DialogDescription>Create a new link for {page.name}&apos;s page</DialogDescription>
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
                    <Label htmlFor="icon">Icon (optional)</Label>
                    <Input
                      id="icon"
                      value={newLink.icon}
                      onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                      placeholder="star, heart, link, etc."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newLink.isActive}
                      onCheckedChange={(checked) => setNewLink({ ...newLink, isActive: checked })}
                    />
                    <Label htmlFor="active">Active (visible on page)</Label>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateLink} disabled={isLoading} className="flex-1">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
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
                  : `Create the first link for ${page.name}'s page`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLinks.map((link, index) => (
                <div
                  key={link._id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border rounded-lg transition-all",
                    link.isActive ? "bg-background" : "bg-muted/50 opacity-75"
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <Button variant="ghost" size="sm" className="cursor-grab active:cursor-grabbing p-1 h-8 w-8 shrink-0 hidden sm:flex">
                      <GripVertical className="h-4 w-4" />
                    </Button>
                    <div className="text-2xl shrink-0">{link.icon || "🔗"}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium truncate">{link.title}</h3>
                        <Badge variant={link.isActive ? "default" : "secondary"} className="text-xs shrink-0">
                          {link.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                      {link.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{link.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{link.clickCount} clicks</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <div className="hidden sm:flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveLink(link._id, "up")}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveLink(link._id, "down")}
                        disabled={index === filteredLinks.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>
                    <Button size="sm" variant="outline" asChild className="hidden sm:flex">
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
                        <DropdownMenuItem
                          onClick={() =>
                            setEditingLink({
                              _id: link._id,
                              title: link.title,
                              url: link.url,
                              description: link.description,
                              icon: link.icon,
                              isActive: link.isActive,
                            })
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Link
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="sm:hidden">
                          <a href={link.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Link
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => moveLink(link._id, "up")}
                          disabled={index === 0}
                          className="sm:hidden"
                        >
                          ↑ Move Up
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => moveLink(link._id, "down")}
                          disabled={index === filteredLinks.length - 1}
                          className="sm:hidden"
                        >
                          ↓ Move Down
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleLinkStatus(link._id, link.isActive)}
                          className={link.isActive ? "text-orange-600" : "text-green-600"}
                        >
                          {link.isActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                          {link.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteLink(link._id)} className="text-red-600">
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
                  value={editingLink.description || ""}
                  onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon</Label>
                <Input
                  id="edit-icon"
                  value={editingLink.icon || ""}
                  onChange={(e) => setEditingLink({ ...editingLink, icon: e.target.value })}
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
                <Button onClick={handleUpdateLink} disabled={isLoading} className="flex-1">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
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
  );
}
