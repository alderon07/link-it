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
import { useUserIdentities, useIdentityMutations, useSlugAvailable } from "@/hooks/convex";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface IdentityData {
  _id: Id<"identities">;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  isPublic: boolean;
  viewCount: number;
}

export function IdentityManager() {
  const identities = useUserIdentities();
  const { createIdentity, updateIdentity, deleteIdentity } = useIdentityMutations();

  const [selectedIdentityId, setSelectedIdentityId] = React.useState<Id<"identities"> | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newIdentity, setNewIdentity] = React.useState({
    name: "",
    slug: "",
    bio: "",
    isPublic: true,
  });

  // Check slug availability
  const slugAvailable = useSlugAvailable(newIdentity.slug);

  const typedIdentities = identities as IdentityData[] | undefined;
  const currentIdentity = selectedIdentityId ? typedIdentities?.find((p: IdentityData) => p._id === selectedIdentityId) : null;

  const handleCreateIdentity = async () => {
    if (!newIdentity.name || !newIdentity.slug) {
      toast.error("Name and slug are required");
      return;
    }

    if (slugAvailable === false) {
      toast.error("This slug is already taken");
      return;
    }

    setIsLoading(true);
    try {
      await createIdentity({
        name: newIdentity.name,
        slug: newIdentity.slug.toLowerCase(),
        bio: newIdentity.bio || undefined,
        isPublic: newIdentity.isPublic,
      });
      setNewIdentity({ name: "", slug: "", bio: "", isPublic: true });
      setIsCreateDialogOpen(false);
      toast.success("Identity created successfully!");
    } catch (error) {
      toast.error("Failed to create identity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIdentityStatus = async (identityId: Id<"identities">, currentStatus: boolean) => {
    try {
      await updateIdentity({ identityId, isPublic: !currentStatus });
      toast.success(currentStatus ? "Identity deactivated" : "Identity activated");
    } catch (error) {
      toast.error("Failed to update identity");
      console.error(error);
    }
  };

  const handleDeleteIdentity = async (identityId: Id<"identities">) => {
    try {
      await deleteIdentity({ identityId });
      if (selectedIdentityId === identityId) {
        setSelectedIdentityId(null);
      }
      toast.success("Identity deleted");
    } catch (error) {
      toast.error("Failed to delete identity");
      console.error(error);
    }
  };

  if (typedIdentities === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Identity Selection Header */}
      <FadeIn>
        <div className="flex flex-col gap-3">
          {/* Stats and Select Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            <PixelBorder variant="solid" shadow="sm" className="px-3 py-1.5 bg-card shrink-0 w-fit">
              <div className="flex items-center gap-2 text-sm">
                <PixelIcon icon="star" size="xs" color="teal" />
                <CountUp value={typedIdentities.length} duration={0.5} />
                <span className="text-muted-foreground">identities</span>
              </div>
            </PixelBorder>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
              <Label htmlFor="identity-select" className="text-sm font-bold shrink-0 whitespace-nowrap">
                Select Identity:
              </Label>
              <PixelBorder variant="solid" shadow="sm" className="bg-card flex-1 min-w-0">
                <Select
                  value={selectedIdentityId || ""}
                  onValueChange={(value) => setSelectedIdentityId(value as Id<"identities">)}
                >
                  <SelectTrigger className="w-full border-0 bg-transparent font-bold text-sm min-w-0">
                    <SelectValue placeholder="Choose identity...">
                    {currentIdentity && (
                      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                        <Avatar className="h-5 w-5 pixel-border shrink-0">
                          <AvatarImage src={currentIdentity.avatarUrl || "/placeholder.svg"} alt={currentIdentity.name} />
                          <AvatarFallback className="text-xs">{currentIdentity.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold truncate">{currentIdentity.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="pixel-border">
                  {typedIdentities.map((identity: IdentityData) => (
                    <SelectItem key={identity._id} value={identity._id} className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5 shrink-0">
                          <AvatarImage src={identity.avatarUrl || "/placeholder.svg"} alt={identity.name} />
                          <AvatarFallback className="text-xs">{identity.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{identity.name}</span>
                        <Badge variant={identity.isPublic ? "retro" : "secondary"} className="text-xs ml-auto shrink-0">
                          {identity.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PixelBorder>
          </div>
          </div>
          
          {/* Create Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="pixel" className="w-full sm:w-auto">
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
                    value={newIdentity.name}
                    onChange={(e) => setNewIdentity({ ...newIdentity, name: e.target.value })}
                    placeholder="Alex Johnson"
                    className="pixel-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="font-bold">URL Slug</Label>
                  <Input
                    id="slug"
                    value={newIdentity.slug}
                    onChange={(e) => setNewIdentity({ ...newIdentity, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    placeholder="alex-creates"
                    className="pixel-border"
                  />
                  {newIdentity.slug && (
                    <p className={`text-xs ${slugAvailable === false ? "text-red-500" : slugAvailable === true ? "text-green-500" : "text-muted-foreground"}`}>
                      {slugAvailable === false ? "This slug is taken" : slugAvailable === true ? "This slug is available" : "Checking..."}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="font-bold">Bio</Label>
                  <Textarea
                    id="bio"
                    value={newIdentity.bio}
                    onChange={(e) => setNewIdentity({ ...newIdentity, bio: e.target.value })}
                    placeholder="Tell people about yourself..."
                    rows={3}
                    className="pixel-border"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={newIdentity.isPublic}
                    onCheckedChange={(checked) => setNewIdentity({ ...newIdentity, isPublic: checked })}
                  />
                  <Label htmlFor="isPublic" className="font-bold">Make this identity public</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="pixel" onClick={handleCreateIdentity} disabled={isLoading} className="flex-1">
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
      {currentIdentity ? (
        <SlideUp delay={0.1}>
          <div className="space-y-6">
            {/* Identity Overview Card */}
            <Card variant="pixel">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <PixelBorder variant="solid" shadow="sm" className="p-0.5 bg-pixel-teal">
                      <Avatar className="h-16 w-16 pixel-border">
                        <AvatarImage src={currentIdentity.avatarUrl || "/placeholder.svg"} alt={currentIdentity.name} />
                        <AvatarFallback className="text-lg font-bold bg-pixel-teal">{currentIdentity.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </PixelBorder>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl font-black pixel-text-shadow truncate">{currentIdentity.name}</CardTitle>
                      <CardDescription className="font-medium truncate">/{currentIdentity.slug}</CardDescription>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant={currentIdentity.isPublic ? "retro" : "secondary"}>
                          {currentIdentity.isPublic ? "Public" : "Private"}
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
                        <a href={`/admin/identities/${currentIdentity._id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Identity
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/${currentIdentity.slug}`} target="_blank" rel="noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Identity
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleIdentityStatus(currentIdentity._id, currentIdentity.isPublic)}
                        className={currentIdentity.isPublic ? "text-orange-600" : "text-green-600"}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {currentIdentity.isPublic ? "Make Private" : "Make Public"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteIdentity(currentIdentity._id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <PixelDivider variant="dashed" className="my-2" />
                <p className="text-sm text-muted-foreground">{currentIdentity.bio || "No bio set"}</p>
                <div className="flex justify-between text-sm">
                  <PixelBorder variant="solid" shadow="sm" className="px-2 py-1 bg-pixel-yellow">
                    <span className="font-bold">{currentIdentity.viewCount} views</span>
                  </PixelBorder>
                </div>
              </CardContent>
            </Card>

            {/* Identity Management Actions */}
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <Card variant="pixel-interactive" className="cursor-pointer group">
                  <CardContent className="p-6">
                    <a href={`/admin/identities/${currentIdentity._id}`} className="block">
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
                    <a href={`/admin/identities/${currentIdentity._id}/links`} className="block">
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
                    <a href={`/admin/identities/${currentIdentity._id}/themes`} className="block">
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
                    <a href={`/${currentIdentity.slug}`} target="_blank" rel="noreferrer" className="block">
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
                {typedIdentities.length === 0 && (
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
              {typedIdentities.map((identity: IdentityData, index: number) => {
                const colors = ["bg-pixel-pink", "bg-pixel-teal", "bg-pixel-yellow", "bg-pixel-mint", "bg-pixel-coral"];
                const colorClass = colors[index % colors.length];

                return (
                  <StaggerItem key={identity._id}>
                    <Card variant="pixel-interactive" className="relative group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <PixelBorder variant="solid" shadow="sm" className={`p-0.5 ${colorClass}`}>
                            <Avatar className="h-10 w-10 pixel-border">
                              <AvatarImage src={identity.avatarUrl || "/placeholder.svg"} alt={identity.name} />
                              <AvatarFallback className={`text-sm font-bold ${colorClass}`}>{identity.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </PixelBorder>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate group-hover:text-pixel-pink transition-colors">{identity.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">/{identity.slug}</p>
                          </div>
                          <Button
                            variant={selectedIdentityId === identity._id ? "pixel" : "pixel-outline"}
                            size="sm"
                            onClick={() => setSelectedIdentityId(identity._id)}
                          >
                            {selectedIdentityId === identity._id ? "Selected" : "Select"}
                          </Button>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <Badge variant={identity.isPublic ? "retro" : "secondary"} className="text-xs">
                            {identity.isPublic ? "Public" : "Private"}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-pixel-pink">{identity.viewCount} views</span>
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
