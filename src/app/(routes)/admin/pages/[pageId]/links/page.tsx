import { PageLinksManager } from "@/components/page-links-manager"
import { PageHeader } from "@/components/page-header"

interface PageLinksPageProps {
  params: {
    pageId: string
  }
}

export default function PageLinksPage({ params }: PageLinksPageProps) {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Identities", href: "/admin/pages" },
          { label: "Manage Links" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Page Link Management</h1>
          <p className="text-muted-foreground">Manage links for this specific page</p>
        </div>
        <PageLinksManager pageId={params.pageId} />
      </div>
    </>
  )
}
