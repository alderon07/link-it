"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Share2, Heart, Eye, LinkIcon, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PixelBorder } from "@/components/pixel-art/PixelBorder";
import { PixelIcon } from "@/components/pixel-art/PixelIcon";
import { PixelDivider } from "@/components/pixel-art/PixelDivider";
import { FadeIn, SlideUp } from "@/components/animations/PageTransition";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { CountUp } from "@/components/animations/CountUp";
import { trackEvent } from "@/lib/analytics/posthog-client";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { usePublicIdentity, usePublicIdentityLinks, useIdentityMutations, useLinkMutations } from "@/hooks/convex";
import { Id } from "../../../convex/_generated/dataModel";

const iconMap: Record<string, "star" | "heart" | "arrow" | "check" | "cross" | "plus" | "minus" | "sparkle" | "diamond" | "coin" | "lightning" | "fire" | "link" | "cursor"> = {
  star: "star",
  heart: "heart",
  play: "diamond",
  sparkle: "sparkle",
  code: "link",
  document: "coin",
  music: "sparkle",
  bolt: "lightning",
  check: "check",
  user: "star",
  fire: "fire",
};

const colorVariants = ["pink", "teal", "yellow", "mint", "coral", "purple", "blue", "orange", "green"] as const;

interface LinkData {
  _id: Id<"links">;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  clickCount: number;
}

interface IdentityData {
  _id: Id<"identities">;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  isPublic: boolean;
  viewCount: number;
  user?: {
    avatarUrl?: string;
  };
}

interface PublicIdentityComponentProps {
  slug: string;
}

export function PublicIdentityComponent({ slug }: PublicIdentityComponentProps) {
  const identity = usePublicIdentity(slug);
  const links = usePublicIdentityLinks(identity?._id);
  const { incrementViewCount } = useIdentityMutations();
  const { incrementClickCount } = useLinkMutations();

  const [shareSuccess, setShareSuccess] = React.useState(false);
  const [viewTracked, setViewTracked] = React.useState(false);

  // Track identity view on mount
  React.useEffect(() => {
    if (identity && !viewTracked) {
      setViewTracked(true);
      incrementViewCount({ identityId: identity._id });

      // Track in PostHog
      trackEvent(AnalyticsEvents.PAGE_VIEW, {
        identity_id: identity._id,
        identity_slug: identity.slug,
        identity_name: identity.name,
        is_public: true,
      });
    }
  }, [identity, viewTracked, incrementViewCount]);

  const handleLinkClick = async (linkId: Id<"links">, url: string, title: string, index: number) => {
    if (!identity) return;

    // Track click
    incrementClickCount({ linkId });

    // Track in PostHog
    trackEvent(AnalyticsEvents.LINK_CLICK, {
      link_id: linkId,
      identity_id: identity._id,
      identity_slug: identity.slug,
      link_url: url,
      link_title: title,
      link_position: index,
    });

    // Open link
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    if (!identity) return;

    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${identity.name} - link-it`,
          text: identity.bio || "",
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  if (identity === undefined || links === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (identity === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card variant="pixel" className="max-w-md mx-4">
          <CardContent className="text-center py-12">
            <PixelIcon icon="cross" size="lg" color="coral" className="mx-auto mb-4" />
            <h1 className="text-2xl font-black mb-2">Page Not Found</h1>
            <p className="text-muted-foreground">This identity doesn&apos;t exist or is not public.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const identityColor = colorVariants[Math.abs(identity.slug.charCodeAt(0)) % colorVariants.length];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="fixed inset-0 pixel-grid opacity-20 pointer-events-none" />

      {/* Floating decorations */}
      <motion.div
        className="absolute top-20 right-10 hidden md:block"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <PixelIcon icon="star" size="default" color="yellow" />
      </motion.div>
      <motion.div
        className="absolute top-40 left-10 hidden md:block"
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <PixelIcon icon="heart" size="default" color="pink" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        {/* Header Stats */}
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <PixelBorder variant="solid" shadow="sm" className="px-3 py-1.5 bg-card">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-pixel-teal" />
                <CountUp value={identity.viewCount} duration={1} />
                <span className="text-muted-foreground">views</span>
              </div>
            </PixelBorder>
            <Button
              variant="pixel-outline"
              size="sm"
              onClick={handleShare}
              className="relative"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {shareSuccess ? "Copied!" : "Share"}
            </Button>
          </div>
        </FadeIn>

        {/* Profile Header */}
        <SlideUp delay={0.1}>
          <div className="text-center mb-8">
            {/* Avatar */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <PixelBorder variant="solid" shadow="default" className={`p-1 bg-pixel-${identityColor}`}>
                <Avatar className="w-24 h-24 pixel-border">
                  <AvatarImage src={identity.avatarUrl || identity.user?.avatarUrl || "/placeholder.svg"} alt={identity.name} />
                  <AvatarFallback className={`text-2xl font-bold bg-pixel-${identityColor}`}>
                    {identity.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </PixelBorder>
            </motion.div>

            {/* Name & Username */}
            <h1 className="text-2xl font-black mb-1 pixel-text-shadow">{identity.name}</h1>
            <p className="text-muted-foreground mb-3 flex items-center justify-center gap-1">
              /{identity.slug}
            </p>

            {/* Bio */}
            {identity.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {identity.bio}
              </p>
            )}
          </div>
        </SlideUp>

        <PixelDivider variant="dashed" className="mb-8" />

        {/* Links */}
        <div className="mb-8">
          {!links || links.length === 0 ? (
            <FadeIn>
              <PixelBorder variant="solid" shadow="default" className="p-8 bg-card text-center">
                <PixelIcon icon="cross" size="lg" color="coral" className="mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">No Links Yet</h3>
                <p className="text-muted-foreground text-sm">
                  This identity doesn&apos;t have any active links yet.
                </p>
              </PixelBorder>
            </FadeIn>
          ) : (
            <StaggerContainer className="space-y-4">
              {(links as LinkData[]).map((link: LinkData, index: number) => {
                const linkColor = colorVariants[(index + identity.slug.charCodeAt(0)) % colorVariants.length];
                const iconName = iconMap[link.icon || "star"] || "star";

                return (
                  <StaggerItem key={link._id}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: -2, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        variant="pixel-interactive"
                        className="cursor-pointer group"
                        onClick={() => handleLinkClick(link._id, link.url, link.title, index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className={`w-12 h-12 bg-pixel-${linkColor} pixel-border flex items-center justify-center flex-shrink-0 group-hover:pixel-shake`}>
                              <PixelIcon icon={iconName} size="sm" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold truncate group-hover:text-pixel-pink transition-colors">
                                {link.title}
                              </h3>
                              {link.description && (
                                <p className="text-sm text-muted-foreground truncate mt-0.5">
                                  {link.description}
                                </p>
                              )}
                            </div>

                            {/* Arrow */}
                            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-pixel-pink transition-colors flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>

        {/* Footer */}
        <FadeIn delay={0.5}>
          <div className="text-center">
            <PixelDivider variant="stars" className="mb-6" />

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Heart className="h-4 w-4 text-pixel-coral" />
              <span>Made with link-it</span>
            </div>

            <Button variant="pixel-outline" size="sm" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                <LinkIcon className="h-4 w-4 mr-2" />
                Create your own link-it
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
