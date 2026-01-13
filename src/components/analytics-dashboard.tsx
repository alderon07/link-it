"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Eye, MousePointer, Download, Filter } from "lucide-react"
import { mockPages } from "@/lib/mock-pages"
import { PixelBorder } from "@/components/pixel-art/PixelBorder"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { PixelDivider } from "@/components/pixel-art/PixelDivider"
import { FadeIn, SlideUp } from "@/components/animations/PageTransition"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"

export function AnalyticsDashboard() {
  const totalViews = mockPages.reduce((sum, profile) => sum + profile.views, 0)
  const totalClicks = 1205 // Mock data
  const avgEngagement = 8.2 // Mock data

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[180px] pixel-border">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px] pixel-border">
                <SelectValue placeholder="Filter by profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Profiles</SelectItem>
                {mockPages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="pixel-outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="pixel-outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Key Metrics */}
      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <Card variant="pixel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold">Total Views</CardTitle>
              <PixelIcon icon="cursor" size="xs" color="pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black pixel-text-shadow">
                <CountUp value={totalViews} duration={0.8} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-pixel-teal font-bold">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card variant="pixel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold">Link Clicks</CardTitle>
              <PixelIcon icon="cursor" size="xs" color="teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black pixel-text-shadow">
                <CountUp value={totalClicks} duration={0.8} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-pixel-teal font-bold">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card variant="pixel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold">Click-through Rate</CardTitle>
              <PixelIcon icon="arrow" size="xs" color="yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black pixel-text-shadow text-pixel-teal">{avgEngagement}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-pixel-teal font-bold">+2.1%</span> from last month
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card variant="pixel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold">Unique Visitors</CardTitle>
              <PixelIcon icon="star" size="xs" color="coral" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black pixel-text-shadow">
                <CountUp value={8429} duration={0.8} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-pixel-teal font-bold">+15.3%</span> from last month
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      <SlideUp delay={0.2}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 pixel-border">
            <TabsTrigger value="overview" className="font-bold">Overview</TabsTrigger>
            <TabsTrigger value="profiles" className="font-bold">Profiles</TabsTrigger>
            <TabsTrigger value="links" className="font-bold">Top Links</TabsTrigger>
            <TabsTrigger value="traffic" className="font-bold">Traffic</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card variant="pixel">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PixelIcon icon="cursor" size="sm" color="teal" />
                    <CardTitle className="font-black">Views Over Time</CardTitle>
                  </div>
                  <CardDescription>Daily profile views for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <PixelDivider variant="dashed" className="mb-4" />
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <PixelBorder variant="solid" shadow="default" className="p-4 bg-pixel-teal mx-auto w-fit mb-4">
                        <PixelIcon icon="cursor" size="lg" />
                      </PixelBorder>
                      <p className="font-bold">Chart visualization would go here</p>
                      <p className="text-sm">Showing trend of {totalViews.toLocaleString()} total views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="pixel">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PixelIcon icon="diamond" size="sm" color="pink" />
                    <CardTitle className="font-black">Click Distribution</CardTitle>
                  </div>
                  <CardDescription>How clicks are distributed across your links</CardDescription>
                </CardHeader>
                <CardContent>
                  <PixelDivider variant="dashed" className="mb-4" />
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <PixelBorder variant="solid" shadow="default" className="p-4 bg-pixel-pink mx-auto w-fit mb-4">
                        <PixelIcon icon="diamond" size="lg" />
                      </PixelBorder>
                      <p className="font-bold">Pie chart visualization would go here</p>
                      <p className="text-sm">Showing distribution of {totalClicks.toLocaleString()} total clicks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card variant="pixel">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PixelIcon icon="lightning" size="sm" color="yellow" />
                  <CardTitle className="font-black">Recent Performance</CardTitle>
                </div>
                <CardDescription>Key metrics from the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <PixelDivider variant="dashed" className="mb-4" />
                <div className="grid gap-4 md:grid-cols-3">
                  <PixelBorder variant="solid" shadow="sm" className="text-center p-4 bg-pixel-teal">
                    <div className="text-2xl font-black pixel-text-shadow">+23%</div>
                    <p className="text-sm font-medium">Views vs last week</p>
                  </PixelBorder>
                  <PixelBorder variant="solid" shadow="sm" className="text-center p-4 bg-pixel-pink">
                    <div className="text-2xl font-black pixel-text-shadow">+18%</div>
                    <p className="text-sm font-medium">Clicks vs last week</p>
                  </PixelBorder>
                  <PixelBorder variant="solid" shadow="sm" className="text-center p-4 bg-pixel-yellow">
                    <div className="text-2xl font-black pixel-text-shadow">+5%</div>
                    <p className="text-sm font-medium">CTR vs last week</p>
                  </PixelBorder>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-6">
            <Card variant="pixel">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PixelIcon icon="star" size="sm" color="teal" />
                  <CardTitle className="font-black">Profile Performance</CardTitle>
                </div>
                <CardDescription>Analytics breakdown by profile</CardDescription>
              </CardHeader>
              <CardContent>
                <PixelDivider variant="dashed" className="mb-4" />
                <StaggerContainer className="space-y-4">
                  {mockPages.map((page, index) => {
                    const colors = ["bg-pixel-pink", "bg-pixel-teal", "bg-pixel-yellow", "bg-pixel-mint", "bg-pixel-coral"]
                    const colorClass = colors[index % colors.length]

                    return (
                      <StaggerItem key={page.id}>
                        <PixelBorder variant="solid" shadow="sm" className="p-4 bg-card hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <PixelBorder variant="solid" shadow="sm" className={`p-0.5 ${colorClass}`}>
                                <Avatar className="h-12 w-12 pixel-border">
                                  <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
                                  <AvatarFallback className={`font-bold ${colorClass}`}>{page.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </PixelBorder>
                              <div>
                                <h3 className="font-bold group-hover:text-pixel-pink transition-colors">{page.name}</h3>
                                <p className="text-sm text-muted-foreground">@{page.username}</p>
                              </div>
                              <Badge variant="retro" className="capitalize">
                                {page.category}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-pixel-pink">{page.views.toLocaleString()} views</div>
                              <div className="text-sm text-muted-foreground font-medium">{page.linkCount} links</div>
                            </div>
                          </div>
                        </PixelBorder>
                      </StaggerItem>
                    )
                  })}
                </StaggerContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <Card variant="pixel">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PixelIcon icon="link" size="sm" color="pink" />
                  <CardTitle className="font-black">Top Performing Links</CardTitle>
                </div>
                <CardDescription>Your most clicked links across all profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <PixelDivider variant="dashed" className="mb-4" />
                <StaggerContainer className="space-y-4">
                  {[
                    { title: "Spotify Music", clicks: 312, profile: "Mike Rodriguez", ctr: "12.4%" },
                    { title: "Portfolio Website", clicks: 245, profile: "Alex Johnson", ctr: "9.8%" },
                    { title: "Tech Blog", clicks: 203, profile: "Sarah Chen", ctr: "8.1%" },
                    { title: "YouTube Channel", clicks: 189, profile: "Alex Johnson", ctr: "7.6%" },
                    { title: "GitHub Profile", clicks: 156, profile: "Sarah Chen", ctr: "6.2%" },
                  ].map((link, index) => {
                    const colors = ["bg-pixel-pink", "bg-pixel-teal", "bg-pixel-yellow", "bg-pixel-mint", "bg-pixel-coral"]
                    const colorClass = colors[index % colors.length]

                    return (
                      <StaggerItem key={index}>
                        <PixelBorder variant="solid" shadow="sm" className="p-3 bg-card hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${colorClass} pixel-border flex items-center justify-center text-sm font-black group-hover:pixel-bounce`}>
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-bold group-hover:text-pixel-pink transition-colors">{link.title}</h4>
                                <p className="text-sm text-muted-foreground">{link.profile}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-pixel-teal">{link.clicks} clicks</div>
                              <div className="text-sm text-muted-foreground font-medium">{link.ctr} CTR</div>
                            </div>
                          </div>
                        </PixelBorder>
                      </StaggerItem>
                    )
                  })}
                </StaggerContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card variant="pixel">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PixelIcon icon="arrow" size="sm" color="teal" />
                    <CardTitle className="font-black">Traffic Sources</CardTitle>
                  </div>
                  <CardDescription>Where your visitors are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <PixelDivider variant="dashed" className="mb-4" />
                  <div className="space-y-4">
                    {[
                      { source: "Direct", percentage: 45, visitors: 3789, color: "bg-pixel-pink" },
                      { source: "Social Media", percentage: 28, visitors: 2356, color: "bg-pixel-teal" },
                      { source: "Search Engines", percentage: 15, visitors: 1264, color: "bg-pixel-yellow" },
                      { source: "Referrals", percentage: 12, visitors: 1020, color: "bg-pixel-mint" },
                    ].map((source) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${source.color} pixel-border`} />
                          <span className="font-bold">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-pixel-pink">{source.percentage}%</div>
                          <div className="text-sm text-muted-foreground">{source.visitors.toLocaleString()} visitors</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card variant="pixel">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PixelIcon icon="diamond" size="sm" color="yellow" />
                    <CardTitle className="font-black">Device Types</CardTitle>
                  </div>
                  <CardDescription>Breakdown by device category</CardDescription>
                </CardHeader>
                <CardContent>
                  <PixelDivider variant="dashed" className="mb-4" />
                  <div className="space-y-4">
                    {[
                      { device: "Mobile", percentage: 68, color: "bg-pixel-pink" },
                      { device: "Desktop", percentage: 25, color: "bg-pixel-teal" },
                      { device: "Tablet", percentage: 7, color: "bg-pixel-yellow" },
                    ].map((device) => (
                      <div key={device.device} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold">{device.device}</span>
                          <span className="font-black">{device.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted pixel-border h-3">
                          <div
                            className={`${device.color} h-full`}
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card variant="pixel">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PixelIcon icon="star" size="sm" color="coral" />
                  <CardTitle className="font-black">Geographic Distribution</CardTitle>
                </div>
                <CardDescription>Top countries by visitor count</CardDescription>
              </CardHeader>
              <CardContent>
                <PixelDivider variant="dashed" className="mb-4" />
                <StaggerContainer className="grid gap-4 md:grid-cols-2">
                  {[
                    { country: "United States", visitors: 3245, flag: "🇺🇸" },
                    { country: "United Kingdom", visitors: 1876, flag: "🇬🇧" },
                    { country: "Canada", visitors: 1234, flag: "🇨🇦" },
                    { country: "Australia", visitors: 987, flag: "🇦🇺" },
                    { country: "Germany", visitors: 756, flag: "🇩🇪" },
                    { country: "France", visitors: 543, flag: "🇫🇷" },
                  ].map((country, index) => {
                    const colors = ["bg-pixel-pink", "bg-pixel-teal", "bg-pixel-yellow", "bg-pixel-mint", "bg-pixel-coral", "bg-pixel-pink"]
                    const colorClass = colors[index % colors.length]

                    return (
                      <StaggerItem key={country.country}>
                        <PixelBorder variant="solid" shadow="sm" className="p-3 bg-card hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${colorClass} pixel-border flex items-center justify-center text-lg group-hover:pixel-bounce`}>
                                {country.flag}
                              </div>
                              <span className="font-bold group-hover:text-pixel-pink transition-colors">{country.country}</span>
                            </div>
                            <span className="font-black text-pixel-teal">{country.visitors.toLocaleString()}</span>
                          </div>
                        </PixelBorder>
                      </StaggerItem>
                    )
                  })}
                </StaggerContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SlideUp>
    </div>
  )
}
