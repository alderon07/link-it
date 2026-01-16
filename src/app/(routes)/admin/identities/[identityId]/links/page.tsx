import { IdentityLinksManager } from "@/components/convex"
import { PageHeader } from "@/components/page-header"
import { Id } from "../../../../../../../convex/_generated/dataModel"

interface IdentityLinksPageProps {
  params: Promise<{
    identityId: string
  }>
}

export default async function IdentityLinksPage({ params }: IdentityLinksPageProps) {
  const { identityId } = await params
  
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Identities", href: "/admin/identities" },
          { label: "Manage Links" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Identity Link Management</h1>
          <p className="text-muted-foreground">Manage links for this specific identity</p>
        </div>
        <IdentityLinksManager identityId={identityId as Id<"identities">} />
      </div>
    </>
  )
}
