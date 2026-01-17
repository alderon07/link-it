import { IdentityEditor } from "@/components/convex"
import { PageHeader } from "@/components/page-header"
import { Id } from "../../../../../../convex/_generated/dataModel"

interface EditIdentityPageProps {
  params: Promise<{
    identityId: string
  }>
}

export default async function EditIdentityPage({ params }: EditIdentityPageProps) {
  const { identityId } = await params
  
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Identities", href: "/admin/identities" },
          { label: "Edit Identity" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden">
        <IdentityEditor identityId={identityId as Id<"identities">} />
      </div>
    </>
  )
}
