import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 overflow-auto overflow-x-hidden pb-20 md:pb-0 w-full max-w-full" style={{ boxSizing: 'border-box' }}>{children}</main>
    </SidebarProvider>
  )
}
