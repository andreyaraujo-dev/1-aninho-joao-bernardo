import { requireUser } from "@/app/actions/auth"
import { AdminShell } from "@/components/admin/AdminShell"

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()
  return <AdminShell userName={user.nome}>{children}</AdminShell>
}
