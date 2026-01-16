import { GlobalLinksManager } from "@/components/global-links-manager"
import { PageHeader } from "@/components/page-header"

export default function LinksPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "All Links" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">All Links</h1>
          <p className="text-muted-foreground">Manage all your links across all identities</p>
        </div>
        <GlobalLinksManager />
      </div>
    </>
  )
}
