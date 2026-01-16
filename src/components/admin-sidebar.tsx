"use client"
import { BarChart3, Home, Link, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { BottomNav } from "@/components/ui/bottom-nav"
import { useIsMobile } from "@/hooks/use-mobile"

const data = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: Home,
          pixelIcon: "star" as const,
          color: "bg-pixel-pink",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
          icon: BarChart3,
          pixelIcon: "cursor" as const,
          color: "bg-pixel-teal",
        },
      ],
    },
    {
      title: "Identity Management",
      items: [
        {
          title: "Identities",
          url: "/admin/pages",
          icon: Users,
          pixelIcon: "star" as const,
          color: "bg-pixel-yellow",
        },
      ],
    },
    {
      title: "Global Content",
      items: [
        {
          title: "All Links",
          url: "/admin/links",
          icon: Link,
          pixelIcon: "link" as const,
          color: "bg-pixel-mint",
        },
      ],
    },
  ],
}

export function AdminSidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Flatten navigation items for bottom nav
  const bottomNavItems = React.useMemo(() => {
    return data.navMain.flatMap((group) =>
      group.items.map((item) => ({
        title: item.title,
        url: item.url,
        pixelIcon: item.pixelIcon,
        color: item.color,
      }))
    )
  }, [])

  return (
    <>
      {/* Bottom Navigation for Mobile */}
      {isMobile && <BottomNav items={bottomNavItems} />}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                  <a href="/admin">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-10 bg-pixel-pink pixel-border pixel-shadow">
                        <PixelIcon icon="link" size="sm" />
                      </div>
                      <span className="text-2xl font-black pixel-text-shadow">link-it</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {data.navMain.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel className="text-xs font-black uppercase tracking-wider text-muted-foreground px-3">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                          variant="pixel"
                        >
                          <a href={item.url} className="flex items-center gap-3">
                            <div className={`w-6 h-6 ${item.color} pixel-border flex items-center justify-center`}>
                              <PixelIcon icon={item.pixelIcon} size="xs" />
                            </div>
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
      )}
    </>
  )
}
