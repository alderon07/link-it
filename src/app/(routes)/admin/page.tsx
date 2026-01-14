import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import Link from "next/link"

export default function AdminPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 pixel-border border-x-0 border-t-0 px-4 bg-card/50 max-w-full overflow-x-hidden">
        <SidebarTrigger className="-ml-1 hidden md:flex" />
        <Link href="/admin" className="flex items-center gap-2 md:hidden">
          <div className="flex items-center justify-center size-8 bg-pixel-pink pixel-border pixel-shadow">
            <PixelIcon icon="link" size="xs" />
          </div>
          <span className="text-lg font-black pixel-text-shadow">link-it</span>
        </Link>
        <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList className="flex-wrap">
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold truncate">Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black pixel-text-shadow">Dashboard</h1>
              <Badge variant="retro" className="hidden sm:flex">
                <Sparkles className="w-3 h-3 mr-1" />
                Pixel Mode
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s an overview of your link-it pages and activity.
            </p>
          </div>
        </div>
        <AdminDashboard />
      </div>
    </>
  )
}
