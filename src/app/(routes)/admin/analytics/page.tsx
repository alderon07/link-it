import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { PageHeader } from "@/components/page-header"

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Analytics" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your identity performance and link engagement</p>
        </div>
        <AnalyticsDashboard />
      </div>
    </>
  )
}
