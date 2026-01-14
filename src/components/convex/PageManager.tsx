"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Eye, Trash2, Copy, Settings, Loader2 } from "lucide-react";
import { PixelBorder } from "@/components/pixel-art/PixelBorder";
import { PixelIcon } from "@/components/pixel-art/PixelIcon";
import { PixelDivider } from "@/components/pixel-art/PixelDivider";
import { FadeIn, SlideUp } from "@/components/animations/PageTransition";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { CountUp } from "@/components/animations/CountUp";
import { useUserPages, usePageMutations, useSlugAvailable } from "@/hooks/convex";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

export function PageManager() {
  const pages = useUserPages();
  const { createPage, updatePage, deletePage } = usePageMutations();

  const [selectedPageId, setSelectedPageId] = React.useState<Id<"pages"> | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newPage, setNewPage] = React.useState({
    name: "",
    slug: "",
    bio: "",
    isPublic: true,
  });

  // Check slug availability
  const slugAvailable = useSlugAvailable(newPage.slug);

  const currentPage = selectedPageId ? pages?.find((p) => p._id === selectedPageId) : null;

  const handleCreatePage = async () => {
    if (!newPage.name || !newPage.slug) {
      toast.error("Name and slug are required");
      return;
    }

    if (slugAvailable === false) {
      toast.error("This slug is already taken");
      return;
    }

    setIsLoading(true);
    try {
      await createPage({
        name: newPage.name,
        slug: newPage.slug.toLowerCase(),
        bio: newPage.bio || undefined,
        isPublic: newPage.isPublic,
      });
      setNewPage({ name: "", slug: "", bio: "", isPublic: true });
      setIsCreateDialogOpen(false);
      toast.success("Identity created successfully!");
    } catch (error) {
      toast.error("Failed to create identity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePageStatus = async (pageId: Id<"pages">, currentStatus: boolean) => {
    try {
      await updatePage({ pageId, isPublic: !currentStatus });
      toast.success(currentStatus ? "Identity deactivated" : "Identity activated");
    } catch (error) {
      toast.error("Failed to update identity");
      console.error(error);
    }
  };

  const handleDeletePage = async (pageId: Id<"pages">) => {
    try {
      await deletePage({ pageId });
      if (selectedPageId === pageId) {
        setSelectedPageId(null);
      }
      toast.success("Identity deleted");
    } catch (error) {
      toast.error("Failed to delete identity");
      console.error(error);
    }
  };

  if (pages === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Identity Selection Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <PixelBorder variant="solid" shadow="sm" className="px-3 py-1.5 bg-card">
              <div className="flex items-center gap-2 text-sm">
                <PixelIcon icon="star" size="xs" color="teal" />
                <CountUp value={pages.length} duration={0.5} />
                <span className="text-muted-foreground">identities</span>
              </div>
            </PixelBorder>
            <div className="flex items-center gap-2">
              <Label htmlFor="identity-select" className="text-sm font-bold">
                Select Identity:
              </Label>
              <PixelBorder variant="solid" shadow="sm" className="bg-card">
                <Select
                  value={selectedPageId || ""}
                  onValueChange={(value) => setSelectedPageId(value as Id<"pages">)}
                >
                  <SelectTrigger className="w-full sm:w-[250px] max-w-full border-0 bg-transparent font-bold">
                    <SelectValue placeholder="Choose an identity to manage">
                      {currentPage && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 pixel-border">
                            <AvatarImage src={currentPage.avatarUrl || "/placeholder.svg"} alt={currentPage.name} />
                            <AvatarFallback className="text-xs">{currentPage.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold">{currentPage.name}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="pixel-border">
                    {pages.map((page) => (
                      <SelectItem key={page._id} value={page._id} className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={page.avatarUrl || "/placeholder.svg"} alt={page.name} />
                            <AvatarFallback className="text-xs">{page.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{page.name}</span>
                          <Badge variant={page.isPublic ? "retro" : "secondary"} className="text-xs ml-auto">
                            {page.isPublic ? "Public" : "Private"}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PixelBorder>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="pixel">
                <Plus className="h-4 w-4 mr-2" />
                Create Identity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-black pixel-text-shadow">Create New Identity</DialogTitle>
                <DialogDescription>Set up a new identity for different purposes or audiences</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Display Name</Label>
                  <Input
                    id="name"
                    value={newPage.name}
                    onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                    placeholder="Alex Johnson"
                    className="pixel-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="font-bold">URL Slug</Label>
                  <Input
                    id="slug"
                    value={newPage.slug}
                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    placeholder="alex-creates"
                    className="pixel-border"
                  />
                  {newPage.slug && (
                    <p className={`text-xs ${slugAvailable === false ? "text-red-500" : slugAvailable === true ? "text-green-500" : "text-muted-foreground"}`}>
                      {slugAvailable === false ? "This slug is taken" : slugAvailable === true ? "This slug is available" : "Checking..."}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="font-bold">Bio</Label>
                  <Textarea
                    id="bio"
                    value={newPage.bio}
                    onChange={(e) => setNewPage({ ...newPage, bio: e.target.value })}
                    placeholder="Tell people about yourself..."
                    rows={3}
                    className="pixel-border"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={newPage.isPublic}
                    onCheckedChange={(checked) => setNewPage({ ...newPage, isPublic: checked })}
                  />
                  <Label htmlFor="isPublic" className="font-bold">Make this page public</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="pixel" onClick={handleCreatePage} disabled={isLoading} className="flex-1">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Identity
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

      {/* Selected Identity Management */}
      {currentPage ? (
        <SlideUp delay={0.1}>
          <div className="space-y-6">
            {/* Identity Overview Card */}
            <Card variant="pixel">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <PixelBorder variant="solid" shadow="sm" className="p-0.5 bg-pixel-teal">
                      <Avatar className="h-16 w-16 pixel-border">
                        <AvatarImage src={currentPage.avatarUrl || "/placeholder.svg"} alt={currentPage.name} />
                        <AvatarFallback className="text-lg font-bold bg-pixel-teal">{currentPage.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </PixelBorder>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl font-black pixel-text-shadow truncate">{currentPage.name}</CardTitle>
                      <CardDescription className="font-medium truncate">/{currentPage.slug}</CardDescription>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant={currentPage.isPublic ? "retro" : "secondary"}>
                          {currentPage.isPublic ? "Public" : "Private"}
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
                        <a href={`/admin/pages/${currentPage._id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Identity
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/${currentPage.slug}`} target="_blank" rel="noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Identity
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => togglePageStatus(currentPage._id, currentPage.isPublic)}
                        className={currentPage.isPublic ? "text-orange-600" : "text-green-600"}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {currentPage.isPublic ? "Make Private" : "Make Public"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePage(currentPage._id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <PixelDivider variant="dashed" className="my-2" />
                <p className="text-sm text-muted-foreground">{currentPage.bio || "No bio set"}</p>
                <div className="flex justify-between text-sm">
                  <PixelBorder variant="solid" shadow="sm" className="px-2 py-1 bg-pixel-yellow">
                    <span className="font-bold">{currentPage.viewCount} views</span>
                  </PixelBorder>
                </div>
              </CardContent>
            </Card>

            {/* Identity Management Actions */}
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <Card variant="pixel-interactive" className="cursor-pointer group">
                  <CardContent className="p-6">
                    <a href={`/admin/pages/${currentPage._id}`} className="block">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pixel-teal pixel-border group-hover:pixel-bounce">
                          <PixelIcon icon="star" size="sm" />
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-pixel-pink transition-colors">Edit Identity</h3>
                          <p className="text-sm text-muted-foreground">Update identity information</p>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card variant="pixel-interactive" className="cursor-pointer group">
                  <CardContent className="p-6">
                    <a href={`/admin/pages/${currentPage._id}/links`} className="block">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pixel-mint pixel-border group-hover:pixel-bounce">
                          <PixelIcon icon="link" size="sm" />
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-pixel-pink transition-colors">Manage Links</h3>
                          <p className="text-sm text-muted-foreground">Add and edit links</p>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card variant="pixel-interactive" className="cursor-pointer group">
                  <CardContent className="p-6">
                    <a href={`/admin/pages/${currentPage._id}/themes`} className="block">
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
                    <a href={`/${currentPage.slug}`} target="_blank" rel="noreferrer" className="block">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pixel-yellow pixel-border group-hover:pixel-bounce">
                          <PixelIcon icon="arrow" size="sm" />
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-pixel-pink transition-colors">View Live Page</h3>
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
        /* No Identity Selected State */
        <FadeIn>
          <Card variant="pixel">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <PixelBorder variant="solid" shadow="default" className="p-4 bg-pixel-mint mx-auto w-fit">
                  <PixelIcon icon="cursor" size="lg" />
                </PixelBorder>
                <div>
                  <h3 className="text-lg font-black pixel-text-shadow">Select an Identity to Manage</h3>
                  <p className="text-muted-foreground">
                    Choose an identity from the dropdown above to edit its settings, manage links, and customize its theme.
                  </p>
                </div>
                {pages.length === 0 && (
                  <Button variant="pixel" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Identity
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* All Identities Overview */}
      <SlideUp delay={0.2}>
        <Card variant="pixel">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PixelIcon icon="star" size="sm" color="yellow" />
              <CardTitle className="font-black">All Identities</CardTitle>
            </div>
            <CardDescription>Overview of all your identities</CardDescription>
          </CardHeader>
          <CardContent>
            <PixelDivider variant="dashed" className="mb-4" />
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pages.map((page, index) => {
                const colors = ["bg-pixel-pink", "bg-pixel-teal", "bg-pixel-yellow", "bg-pixel-mint", "bg-pixel-coral"];
                const colorClass = colors[index % colors.length];

                return (
                  <StaggerItem key={page._id}>
                    <Card variant="pixel-interactive" className="relative group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <PixelBorder variant="solid" shadow="sm" className={`p-0.5 ${colorClass}`}>
                            <Avatar className="h-10 w-10 pixel-border">
                              <AvatarImage src={page.avatarUrl || "/placeholder.svg"} alt={page.name} />
                              <AvatarFallback className={`text-sm font-bold ${colorClass}`}>{page.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </PixelBorder>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate group-hover:text-pixel-pink transition-colors">{page.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">/{page.slug}</p>
                          </div>
                          <Button
                            variant={selectedPageId === page._id ? "pixel" : "pixel-outline"}
                            size="sm"
                            onClick={() => setSelectedPageId(page._id)}
                          >
                            {selectedPageId === page._id ? "Selected" : "Select"}
                          </Button>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <Badge variant={page.isPublic ? "retro" : "secondary"} className="text-xs">
                            {page.isPublic ? "Public" : "Private"}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-pixel-pink">{page.viewCount} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
}
