import { AdminDashboard } from "@/components/admin-dashboard"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function AdminPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Dashboard" }]} />
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
