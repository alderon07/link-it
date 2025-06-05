"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Link, Eye, TrendingUp, Plus, ExternalLink, BarChart3, Settings } from "lucide-react"
import { mockProfiles } from "@/lib/mock-profiles"

export function AdminDashboard() {
  const totalProfiles = mockProfiles.length
  const totalLinks = mockProfiles.reduce((sum, profile) => sum + profile.linkCount, 0)
  const totalViews = mockProfiles.reduce((sum, profile) => sum + profile.views, 0)
  const activeProfiles = mockProfiles.filter((profile) => profile.isActive).length

  const recentActivity = [
    { action: "Profile viewed", profile: "Alex Johnson", time: "2 minutes ago" },
    { action: "Link clicked", profile: "Sarah Chen", time: "5 minutes ago" },
    { action: "New profile created", profile: "Mike Rodriguez", time: "1 hour ago" },
    { action: "Theme updated", profile: "Alex Johnson", time: "2 hours ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProfiles}</div>
            <p className="text-xs text-muted-foreground">{activeProfiles} active profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLinks}</div>
            <p className="text-xs text-muted-foreground">Across all profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button className="justify-start h-auto p-4" variant="outline" asChild>
                <a href="/admin/profiles">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Create New Profile</div>
                    <div className="text-sm text-muted-foreground">Set up a new link-it profile</div>
                  </div>
                </a>
              </Button>
              <Button className="justify-start h-auto p-4" variant="outline" asChild>
                <a href="/admin/links">
                  <Link className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage All Links</div>
                    <div className="text-sm text-muted-foreground">View and edit links across profiles</div>
                  </div>
                </a>
              </Button>
              <Button className="justify-start h-auto p-4" variant="outline" asChild>
                <a href="/admin/analytics">
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-sm text-muted-foreground">Track performance and engagement</div>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profiles</CardTitle>
            <CardDescription>Overview of your active profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProfiles.slice(0, 3).map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-sm text-muted-foreground">@{profile.username}</div>
                  </div>
                  <Badge variant={profile.isActive ? "default" : "secondary"} className="ml-2">
                    {profile.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/admin/profiles`}>
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/${profile.username}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="outline" className="w-1/3" asChild>
                <a href="/admin/profiles">View All Profiles</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across your profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-muted-foreground"> on {activity.profile}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>{`This month's key metrics`}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Views</span>
                <span>2,847</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Link Clicks</span>
                <span>1,234</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Engagement Rate</span>
                <span>8.2%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Goal Progress</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
