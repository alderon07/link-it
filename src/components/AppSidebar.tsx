"use client"

import { Home, Settings, User } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SignedIn, UserButton, useUser, useClerk } from "@clerk/nextjs"
import { NavUser } from "./ui/nav-user"
// Menu items., UserButton
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

type UserProps = {
  name: string;
  email: string;
  avatar: string;
}

export function AppSidebar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const userProp: UserProps = {
    name: user?.fullName || "",
    email: user?.emailAddresses[0].emailAddress || "",
    avatar: user?.imageUrl || "",
  }

  const handleLogout = () => {
    signOut();
  };

  const handleManageAccount = () => {
    openUserProfile();
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter> 
        <SignedIn>
          <NavUser 
            user={userProp} 
            onLogout={handleLogout}
            onManageAccount={handleManageAccount}
          />
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  )
}
