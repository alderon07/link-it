import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { GlobalLinksManager } from "@/components/global-links-manager"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import Link from "next/link"

export default function LinksPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 max-w-full overflow-x-hidden">
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
              <BreadcrumbLink href="/admin" className="truncate">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate">All Links</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">All Links</h1>
          <p className="text-muted-foreground">Manage all your links across all profiles</p>
        </div>
        <GlobalLinksManager />
      </div>
    </>
  )
}
