"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Eye, Link as LinkIcon, Palette, ArrowLeft } from "lucide-react";
import { PixelBorder } from "@/components/pixel-art/PixelBorder";
import { PixelIcon } from "@/components/pixel-art/PixelIcon";
import { PixelDivider } from "@/components/pixel-art/PixelDivider";
import { FadeIn, SlideUp } from "@/components/animations/PageTransition";
import { useIdentity, useIdentityMutations, useSlugAvailable } from "@/hooks/convex";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Link from "next/link";

interface IdentityEditorProps {
  identityId: Id<"identities">;
}

export function IdentityEditor({ identityId }: IdentityEditorProps) {
  const identity = useIdentity(identityId);
  const { updateIdentity } = useIdentityMutations();
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    bio: "",
    avatarUrl: "",
    isPublic: true,
  });
  const [hasChanges, setHasChanges] = React.useState(false);

  // Check slug availability (exclude current identity)
  const slugAvailable = useSlugAvailable(formData.slug, identityId);

  // Initialize form data when identity loads
  React.useEffect(() => {
    if (identity) {
      setFormData({
        name: identity.name || "",
        slug: identity.slug || "",
        bio: identity.bio || "",
        avatarUrl: identity.avatarUrl || "",
        isPublic: identity.isPublic ?? true,
      });
    }
  }, [identity]);

  // Track changes
  React.useEffect(() => {
    if (identity) {
      const changed = 
        formData.name !== identity.name ||
        formData.slug !== identity.slug ||
        formData.bio !== (identity.bio || "") ||
        formData.avatarUrl !== (identity.avatarUrl || "") ||
        formData.isPublic !== identity.isPublic;
      setHasChanges(changed);
    }
  }, [formData, identity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    // Check if slug changed and is not available
    if (formData.slug !== identity?.slug && slugAvailable === false) {
      toast.error("This slug is already taken");
      return;
    }

    setIsLoading(true);
    try {
      await updateIdentity({
        identityId,
        name: formData.name,
        slug: formData.slug.toLowerCase(),
        bio: formData.bio || undefined,
        avatarUrl: formData.avatarUrl || undefined,
        isPublic: formData.isPublic,
      });
      toast.success("Identity updated successfully!");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to update identity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (identity === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (identity === null) {
    return (
      <FadeIn>
        <Card variant="pixel">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PixelIcon icon="cross" size="lg" color="coral" className="mb-4" />
            <h3 className="text-lg font-black pixel-text-shadow mb-2">Identity Not Found</h3>
            <p className="text-muted-foreground mb-4">This identity doesn&apos;t exist or you don&apos;t have access to it.</p>
            <Button variant="pixel" asChild>
              <Link href="/admin/identities">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Identities
              </Link>
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <FadeIn>
        <Button variant="pixel-outline" size="sm" asChild>
          <Link href="/admin/identities">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Identities
          </Link>
        </Button>
      </FadeIn>

      {/* Identity Preview Card */}
      <SlideUp delay={0.1}>
        <Card variant="pixel">
          <CardHeader>
            <div className="flex items-start gap-4">
              <PixelBorder variant="solid" shadow="sm" className="p-0.5 bg-pixel-teal">
                <Avatar className="h-16 w-16 pixel-border">
                  <AvatarImage src={formData.avatarUrl || "/placeholder.svg"} alt={formData.name} />
                  <AvatarFallback className="text-lg font-bold bg-pixel-teal">
                    {formData.name.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </PixelBorder>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-black pixel-text-shadow truncate">
                  {formData.name || "Untitled Identity"}
                </CardTitle>
                <CardDescription className="font-medium truncate">
                  /{formData.slug || "slug"}
                </CardDescription>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant={formData.isPublic ? "retro" : "secondary"}>
                    {formData.isPublic ? "Public" : "Private"}
                  </Badge>
                  {hasChanges && (
                    <Badge variant="outline" className="text-pixel-yellow border-pixel-yellow">
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </SlideUp>

      {/* Edit Form */}
      <SlideUp delay={0.2}>
        <Card variant="pixel">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PixelIcon icon="star" size="sm" color="pink" />
              <CardTitle className="font-black">Edit Identity</CardTitle>
            </div>
            <CardDescription>Update your identity information</CardDescription>
          </CardHeader>
          <CardContent>
            <PixelDivider variant="dashed" className="mb-6" />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Display Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your display name"
                    className="pixel-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="font-bold">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") 
                    })}
                    placeholder="your-slug"
                    className="pixel-border"
                  />
                  {formData.slug && formData.slug !== identity.slug && (
                    <p className={`text-xs ${
                      slugAvailable === false 
                        ? "text-red-500" 
                        : slugAvailable === true 
                          ? "text-green-500" 
                          : "text-muted-foreground"
                    }`}>
                      {slugAvailable === false 
                        ? "This slug is taken" 
                        : slugAvailable === true 
                          ? "This slug is available" 
                          : "Checking..."}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl" className="font-bold">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="pixel-border"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL to an image for your profile picture
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="font-bold">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  rows={4}
                  className="pixel-border"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 pixel-border">
                <div>
                  <Label htmlFor="isPublic" className="font-bold">Public Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this identity visible to everyone
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>

              <PixelDivider variant="dashed" className="my-6" />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  variant="pixel" 
                  disabled={isLoading || !hasChanges}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="pixel-outline" 
                  asChild
                  className="flex-1"
                >
                  <a href={`/${formData.slug}`} target="_blank" rel="noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Page
                  </a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SlideUp>

      {/* Quick Actions */}
      <SlideUp delay={0.3}>
        <Card variant="pixel">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PixelIcon icon="lightning" size="sm" color="yellow" />
              <CardTitle className="font-black">Quick Actions</CardTitle>
            </div>
            <CardDescription>Manage other aspects of this identity</CardDescription>
          </CardHeader>
          <CardContent>
            <PixelDivider variant="dashed" className="mb-4" />
            <div className="grid gap-4 md:grid-cols-2">
              <Card variant="pixel-interactive" className="cursor-pointer group">
                <CardContent className="p-4">
                  <Link href={`/admin/identities/${identityId}/links`} className="block">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pixel-mint pixel-border group-hover:pixel-bounce">
                        <LinkIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold group-hover:text-pixel-pink transition-colors">Manage Links</h3>
                        <p className="text-sm text-muted-foreground">Add and edit links</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card variant="pixel-interactive" className="cursor-pointer group">
                <CardContent className="p-4">
                  <Link href={`/admin/identities/${identityId}/themes`} className="block">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pixel-pink pixel-border group-hover:pixel-bounce">
                        <Palette className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold group-hover:text-pixel-pink transition-colors">Customize Theme</h3>
                        <p className="text-sm text-muted-foreground">Colors & appearance</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
}
