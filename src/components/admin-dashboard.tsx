"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { mockPages } from "@/lib/mock-pages"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { PixelDivider } from "@/components/pixel-art/PixelDivider"
import { FadeIn } from "@/components/animations/PageTransition"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"

const statsConfig = [
  {
    title: "Total Pages",
    icon: Users,
    color: "pink",
    getValue: (pages: typeof mockPages) => pages.length,
    getSubtext: (pages: typeof mockPages) => `${pages.filter(p => p.isActive).length} active`,
  },
  {
    title: "Total Links",
    icon: LinkIcon,
    color: "teal",
    getValue: (pages: typeof mockPages) => pages.reduce((sum, p) => sum + p.linkCount, 0),
    getSubtext: () => "Across all pages",
  },
  {
    title: "Total Views",
    icon: Eye,
    color: "yellow",
    getValue: (pages: typeof mockPages) => pages.reduce((sum, p) => sum + p.views, 0),
    getSubtext: () => "+12% from last month",
  },
  {
    title: "Engagement",
    icon: TrendingUp,
    color: "mint",
    getValue: () => 8.2,
    getSubtext: () => "+2.1% from last week",
    suffix: "%",
  },
]

const quickActions = [
  {
    title: "Create New Page",
    description: "Set up a new link-it page",
    icon: Plus,
    href: "/admin/pages",
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

const recentActivity = [
  { action: "Page viewed", page: "Alex Johnson", time: "2 min ago", color: "teal" },
  { action: "Link clicked", page: "Sarah Chen", time: "5 min ago", color: "pink" },
  { action: "New page created", page: "Mike Rodriguez", time: "1 hour ago", color: "yellow" },
  { action: "Theme updated", page: "Alex Johnson", time: "2 hours ago", color: "purple" },
]

export function AdminDashboard() {
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
                      value={stat.getValue(mockPages)}
                      suffix={stat.suffix}
                      duration={1.5}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.getSubtext(mockPages)}
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

        {/* Your Pages */}
        <FadeIn delay={0.2}>
          <Card variant="pixel">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <PixelIcon icon="star" color="pink" />
                <CardTitle className="font-black">Your Pages</CardTitle>
              </div>
              <CardDescription>Overview of your link-it pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPages.slice(0, 3).map((page, index) => {
                const colors = ["pink", "teal", "yellow"]
                const color = colors[index % colors.length]

                return (
                  <motion.div
                    key={page.id}
                    whileHover={{ scale: 1.01 }}
                    className="group"
                  >
                    <PixelBorder variant="solid" shadow="sm" className="p-3 bg-card">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <PixelBorder variant="solid" className={`p-0.5 bg-pixel-${color} flex-shrink-0`}>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
                            <AvatarFallback className={`font-bold bg-pixel-${color}`}>
                              {page.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </PixelBorder>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{page.name}</div>
                          <div className="text-xs text-muted-foreground truncate">@{page.username}</div>
                        </div>
                        <Badge variant={page.isActive ? "retro" : "secondary"} className="text-xs flex-shrink-0 hidden sm:inline-flex">
                          {page.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button size="sm" variant="pixel-outline" className="h-8 w-8 p-0" asChild>
                            <Link href="/admin/pages">
                              <Settings className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="pixel-outline" className="h-8 w-8 p-0" asChild>
                            <Link href={`/${page.username}`} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </PixelBorder>
                  </motion.div>
                )
              })}
              <div className="pt-2">
                <Button variant="pixel-secondary" className="w-full" asChild>
                  <Link href="/admin/pages">
                    View All Pages
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
              <CardDescription>Latest actions across your pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-2 h-2 bg-pixel-${activity.color} pixel-border`} />
                    <div className="flex-1 text-sm">
                      <span className="font-bold">{activity.action}</span>
                      <span className="text-muted-foreground"> on {activity.page}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </motion.div>
                ))}
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
                { label: "Page Views", value: 2847, progress: 75, color: "pink" },
                { label: "Link Clicks", value: 1234, progress: 60, color: "teal" },
                { label: "Engagement Rate", value: "8.2%", progress: 82, color: "yellow" },
                { label: "Goal Progress", value: "67%", progress: 67, color: "mint" },
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
              <Link href="/admin/pages">
                <Plus className="h-5 w-5 mr-2" />
                Create New Page
              </Link>
            </Button>
          </div>
        </PixelBorder>
      </FadeIn>
    </div>
  )
}
