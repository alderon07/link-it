import { PageThemeManager } from "@/components/page-theme-manager"
import { PageHeader } from "@/components/page-header"

interface PageThemesPageProps {
  params: {
    pageId: string
  }
}

export default function PageThemesPage({ params }: PageThemesPageProps) {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Identities", href: "/admin/pages" },
          { label: "Theme Customization" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Page Theme Customization</h1>
          <p className="text-muted-foreground">Customize the appearance and theme for this specific page</p>
        </div>
        <PageThemeManager pageId={params.pageId} />
      </div>
    </>
  )
}
