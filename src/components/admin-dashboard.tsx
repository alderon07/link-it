"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  LinkIcon,
  Eye,
  TrendingUp,
  Plus,
  ExternalLink,
  BarChart3,
  Settings,
  Zap,
  Sparkles,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUserIdentities, useDashboardStats, useRecentActivity } from "@/hooks/convex"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { PixelDivider } from "@/components/pixel-art/PixelDivider"
import { FadeIn } from "@/components/animations/PageTransition"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"

interface DashboardStats {
  totalIdentities: number;
  totalLinks: number;
  totalActiveLinks: number;
  totalViews: number;
  totalClicks: number;
  viewsThisMonth: number;
  clicksThisMonth: number;
  engagementRate: number;
  topIdentities: Array<{
    _id: string;
    name: string;
    slug: string;
    viewCount: number;
    avatarUrl?: string;
    isPublic: boolean;
  }>;
}

const getStatsConfig = (stats: DashboardStats | null | undefined) => [
  {
    title: "Total Identities",
    icon: Users,
    color: "pink",
    value: stats?.totalIdentities ?? 0,
    subtext: `${stats?.totalIdentities ?? 0} identities`,
  },
  {
    title: "Total Links",
    icon: LinkIcon,
    color: "teal",
    value: stats?.totalLinks ?? 0,
    subtext: `${stats?.totalActiveLinks ?? 0} active`,
  },
  {
    title: "Total Views",
    icon: Eye,
    color: "yellow",
    value: stats?.totalViews ?? 0,
    subtext: `${stats?.viewsThisMonth ?? 0} this month`,
  },
  {
    title: "Engagement",
    icon: TrendingUp,
    color: "mint",
    value: stats?.engagementRate ?? 0,
    subtext: `${stats?.clicksThisMonth ?? 0} clicks this month`,
    suffix: "%",
  },
]

const quickActions = [
  {
    title: "Create New Identity",
    description: "Set up a new link-it identity",
    icon: Plus,
    href: "/admin/identities",
    color: "pink",
  },
  {
    title: "Manage All Links",
    description: "View and edit all your links",
    icon: LinkIcon,
    href: "/admin/links",
    color: "teal",
  },
  {
    title: "View Analytics",
    description: "Track performance and engagement",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "yellow",
  },
]

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AdminDashboard() {
  const identities = useUserIdentities();
  const stats = useDashboardStats() as DashboardStats | null | undefined;
  const recentActivity = useRecentActivity(10);

  const isLoading = identities === undefined || stats === undefined;
  const statsConfig = getStatsConfig(stats);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} variant="pixel">
              <CardContent className="p-4">
                <Skeleton className="h-10 w-10 mb-3" />
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const typedIdentities = (identities || []) as Array<{
    _id: string;
    name: string;
    slug: string;
    viewCount: number;
    avatarUrl?: string;
    isPublic: boolean;
  }>;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsConfig.map((stat, index) => (
            <StaggerItem key={stat.title}>
              <Card variant="pixel" className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 bg-pixel-${stat.color} pixel-border flex items-center justify-center group-hover:pixel-shake`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="retro" className="text-xs">
                      {stat.title}
                    </Badge>
                  </div>
                  <div className="text-3xl font-black mb-1">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      duration={1.5}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.subtext}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </FadeIn>

      <PixelDivider variant="dashed" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <FadeIn delay={0.1}>
          <Card variant="pixel">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <PixelIcon icon="lightning" color="yellow" />
                <CardTitle className="font-black">Quick Actions</CardTitle>
              </div>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="pixel-outline"
                    className="w-full justify-start h-auto p-4 group"
                    asChild
                  >
                    <Link href={action.href}>
                      <div className={`w-10 h-10 bg-pixel-${action.color} pixel-border flex items-center justify-center mr-4 group-hover:pixel-shake`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">{action.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Your Identities */}
        <FadeIn delay={0.2}>
          <Card variant="pixel">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <PixelIcon icon="star" color="pink" />
                <CardTitle className="font-black">Your Identities</CardTitle>
              </div>
              <CardDescription>Overview of your link-it identities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {typedIdentities.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No identities yet</p>
                  <Button variant="pixel" size="sm" asChild>
                    <Link href="/admin/identities">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Identity
                    </Link>
                  </Button>
                </div>
              ) : (
                typedIdentities.slice(0, 3).map((identity, index) => {
                  const colors = ["pink", "teal", "yellow"]
                  const color = colors[index % colors.length]

                  return (
                    <motion.div
                      key={identity._id}
                      whileHover={{ scale: 1.01 }}
                      className="group"
                    >
                      <PixelBorder variant="solid" shadow="sm" className="p-3 bg-card">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <PixelBorder variant="solid" className={`p-0.5 bg-pixel-${color} shrink-0`}>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={identity.avatarUrl || "/placeholder.svg"} alt={identity.name} />
                              <AvatarFallback className={`font-bold bg-pixel-${color}`}>
                                {identity.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </PixelBorder>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">{identity.name}</div>
                            <div className="text-xs text-muted-foreground truncate">/{identity.slug}</div>
                          </div>
                          <Badge variant={identity.isPublic ? "retro" : "secondary"} className="text-xs shrink-0 hidden sm:inline-flex">
                            {identity.isPublic ? "Public" : "Private"}
                          </Badge>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button size="sm" variant="pixel-outline" className="h-8 w-8 p-0" asChild>
                              <Link href={`/admin/identities/${identity._id}`}>
                                <Settings className="h-3 w-3" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="pixel-outline" className="h-8 w-8 p-0" asChild>
                              <Link href={`/${identity.slug}`} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </PixelBorder>
                    </motion.div>
                  )
                })
              )}
              <div className="pt-2">
                <Button variant="pixel-secondary" className="w-full" asChild>
                  <Link href="/admin/identities">
                    View All Identities
                    <PixelIcon icon="arrow" className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <PixelDivider variant="stars" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <FadeIn delay={0.3}>
          <Card variant="pixel">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <PixelIcon icon="sparkle" color="teal" />
                <CardTitle className="font-black">Recent Activity</CardTitle>
              </div>
                <CardDescription>Latest actions across your identities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!recentActivity || recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                ) : (
                  (recentActivity as Array<{
                    type: "view" | "click";
                    timestamp: number;
                    identityName: string;
                    linkTitle?: string;
                  }>).slice(0, 5).map((activity, index) => {
                    const colors = activity.type === "view" ? "teal" : "pink";
                    const action = activity.type === "view" ? "Identity viewed" : `Link clicked${activity.linkTitle ? `: ${activity.linkTitle}` : ""}`;

                    return (
                      <motion.div
                        key={`${activity.type}-${activity.timestamp}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-2 h-2 bg-pixel-${colors} pixel-border`} />
                        <div className="flex-1 text-sm min-w-0">
                          <span className="font-bold truncate">{action}</span>
                          <span className="text-muted-foreground"> on {activity.identityName}</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(activity.timestamp)}</span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Performance Summary */}
        <FadeIn delay={0.4}>
          <Card variant="pixel">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <PixelIcon icon="lightning" color="mint" />
                <CardTitle className="font-black">Performance</CardTitle>
              </div>
              <CardDescription>This month&apos;s key metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Page Views",
                  value: stats?.viewsThisMonth ?? 0,
                  progress: Math.min(100, ((stats?.viewsThisMonth ?? 0) / Math.max(1, stats?.totalViews ?? 1)) * 100),
                  color: "pink",
                },
                {
                  label: "Link Clicks",
                  value: stats?.clicksThisMonth ?? 0,
                  progress: Math.min(100, ((stats?.clicksThisMonth ?? 0) / Math.max(1, stats?.totalClicks ?? 1)) * 100),
                  color: "teal",
                },
                {
                  label: "Engagement Rate",
                  value: `${stats?.engagementRate ?? 0}%`,
                  progress: Math.min(100, stats?.engagementRate ?? 0),
                  color: "yellow",
                },
                {
                  label: "Active Links",
                  value: `${stats?.totalActiveLinks ?? 0}/${stats?.totalLinks ?? 0}`,
                  progress: stats?.totalLinks ? ((stats.totalActiveLinks ?? 0) / stats.totalLinks) * 100 : 0,
                  color: "mint",
                },
              ].map((metric, index) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{metric.label}</span>
                    <span className={`text-pixel-${metric.color} font-bold`}>
                      {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                    </span>
                  </div>
                  <div className="h-3 bg-muted pixel-border overflow-hidden">
                    <motion.div
                      className={`h-full bg-pixel-${metric.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 * index, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* CTA Banner */}
      <FadeIn delay={0.5}>
        <PixelBorder variant="solid" shadow="lg" className="p-6 bg-gradient-to-r from-pixel-pink/10 via-pixel-teal/10 to-pixel-yellow/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PixelIcon icon="sparkle" size="lg" color="yellow" />
              </motion.div>
              <div>
                <h3 className="font-black text-lg">Ready to grow?</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first page and start sharing your links
                </p>
              </div>
            </div>
            <Button variant="pixel" size="lg" asChild>
              <Link href="/admin/identities">
                <Plus className="h-5 w-5 mr-2" />
                Create New Identity
              </Link>
            </Button>
          </div>
        </PixelBorder>
      </FadeIn>
    </div>
  )
}
