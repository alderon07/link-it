import { IdentityThemeManager } from "@/components/convex"
import { PageHeader } from "@/components/page-header"
import { Id } from "../../../../../../../convex/_generated/dataModel"

interface IdentityThemesPageProps {
  params: Promise<{
    identityId: string
  }>
}

export default async function IdentityThemesPage({ params }: IdentityThemesPageProps) {
  const { identityId } = await params
  
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Identities", href: "/admin/identities" },
          { label: "Theme Customization" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Identity Theme Customization</h1>
          <p className="text-muted-foreground">Customize the appearance and theme for this specific identity</p>
        </div>
        <IdentityThemeManager identityId={identityId as Id<"identities">} />
      </div>
    </>
  )
}
