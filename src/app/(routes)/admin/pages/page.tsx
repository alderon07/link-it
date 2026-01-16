import { PageManager } from "@/components/page-manager"
import { PageHeader } from "@/components/page-header"

export default function PagesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Manage Identities" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Manage Identities</h1>
          <p className="text-muted-foreground">Create, edit, and manage your link-it pages</p>
        </div>
        <PageManager />
      </div>
    </>
  )
}
