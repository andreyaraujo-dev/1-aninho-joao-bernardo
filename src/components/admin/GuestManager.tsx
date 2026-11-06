"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  adminRespondGuestAction,
  markGuestInviteSentAction,
} from "@/app/actions/guests"
import { markFamilyInviteSentAction } from "@/app/actions/families"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CopyInviteButton } from "@/components/admin/CopyInviteButton"
import { CreateGuestDialog } from "@/components/admin/CreateGuestDialog"
import { CreateFamilyDialog } from "@/components/admin/CreateFamilyDialog"
import { DeleteGuestDialog } from "@/components/admin/DeleteGuestDialog"
import { AdminConfirmFamilyDialog } from "@/components/admin/AdminConfirmFamilyDialog"
import { DeleteFamilyDialog } from "@/components/admin/DeleteFamilyDialog"
import { EditGuestDialog } from "@/components/admin/EditGuestDialog"
import { EditFamilyDialog } from "@/components/admin/EditFamilyDialog"
import { WhatsAppInviteButton } from "@/components/admin/WhatsAppInviteButton"
import type { Family, Guest, GuestAction } from "@/components/admin/GuestTypes"
import { formatBrazilianMobile } from "@/lib/validation"

function statusLabel(status: string) {
  if (status === "CONFIRMADO") return "Confirmado"
  if (status === "NAO_CONFIRMADO") return "Não confirmou"
  return "Aguardando"
}

function statusClassName(status: string) {
  if (status === "CONFIRMADO") return "border-green-200 bg-green-100 text-green-800"
  if (status === "NAO_CONFIRMADO") return "border-red-200 bg-red-100 text-red-800"
  return "border-yellow-200 bg-yellow-100 text-yellow-800"
}

function tipoLabel(tipo: string) {
  if (tipo === "IDOSO") return "Idoso"
  if (tipo === "CRIANCA") return "Criança"
  return "Adulto"
}

function tipoClassName(tipo: string) {
  if (tipo === "IDOSO") return "border-blue-200 bg-blue-100 text-blue-800"
  if (tipo === "CRIANCA") return "border-purple-200 bg-purple-100 text-purple-800"
  return "border-slate-200 bg-slate-100 text-slate-700"
}

function familyMembersSummary(family: Family) {
  const counts: Record<string, number> = { ADULTO: 0, IDOSO: 0, CRIANCA: 0 }
  for (const m of family.members) counts[m.tipo] = (counts[m.tipo] ?? 0) + 1
  const parts = []
  if (counts.ADULTO)
    parts.push(`${counts.ADULTO} adulto${counts.ADULTO > 1 ? "s" : ""}`)
  if (counts.IDOSO) parts.push(`${counts.IDOSO} idoso${counts.IDOSO > 1 ? "s" : ""}`)
  if (counts.CRIANCA)
    parts.push(`${counts.CRIANCA} criança${counts.CRIANCA > 1 ? "s" : ""}`)
  return parts.join(", ") || "sem membros"
}

function familyStatus(family: Family): string {
  const statuses = family.members.map((m) => m.status)
  if (statuses.every((s) => s === "AGUARDANDO")) return "AGUARDANDO"
  if (statuses.some((s) => s === "CONFIRMADO")) return "CONFIRMADO"
  return "NAO_CONFIRMADO"
}

type Tab = "convidados" | "familias"

export function GuestManager({
  guests,
  families,
  message,
  baseUrl,
}: {
  guests: Guest[]
  families: Family[]
  message: string
  baseUrl: string
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("convidados")
  const [createGuestOpen, setCreateGuestOpen] = useState(false)
  const [createFamilyOpen, setCreateFamilyOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [editingFamily, setEditingFamily] = useState<Family | null>(null)
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null)
  const [deletingFamily, setDeletingFamily] = useState<Family | null>(null)
  const [confirmingFamily, setConfirmingFamily] = useState<Family | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(
    action: GuestAction,
    formData: FormData,
    onSuccess: () => void,
  ) {
    setPending(true)
    try {
      const result = await action(formData)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(result.success ?? "Ação realizada com sucesso.")
      onSuccess()
      router.refresh()
    } catch {
      toast.error("Não foi possível concluir a ação.")
    } finally {
      setPending(false)
    }
  }

  const individualGuests = guests.filter((g) => !g.familyId)

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Convidados</h1>
          <p className="mt-2 text-muted-foreground">
            Cadastre pessoas e famílias e acompanhe as respostas do convite.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10"
            onClick={() => setCreateFamilyOpen(true)}
          >
            Nova família
          </Button>
          <Button className="h-10" onClick={() => setCreateGuestOpen(true)}>
            Novo convidado
          </Button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border/60">
        {(["convidados", "familias"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "convidados"
              ? `Convidados (${individualGuests.length})`
              : `Famílias (${families.length})`}
          </button>
        ))}
      </div>

      {tab === "convidados" && (
        <Card className="border-primary/20 bg-card/95 shadow-lg shadow-primary/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10">
          <CardHeader className="border-b border-border/70 bg-secondary/30">
            <CardTitle className="text-lg">Convidados individuais</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {individualGuests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum convidado individual cadastrado.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-gray-300">
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Status do convidado</TableHead>
                    <TableHead>Status do convite</TableHead>
                    <TableHead>Ações do convite</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {individualGuests.map((guest) => {
                    const url = `${baseUrl}/?guest=${guest.link?.token ?? ""}`
                    const inviteMessage = [message.trim(), url]
                      .filter(Boolean)
                      .join("\n\n")

                    return (
                      <TableRow
                        key={guest.id}
                        className="border-b-gray-300 transition-colors hover:bg-accent/50"
                      >
                        <TableCell className="font-medium">{guest.nome}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={tipoClassName(guest.tipo)}
                          >
                            {tipoLabel(guest.tipo)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatBrazilianMobile(guest.celular)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusClassName(guest.status)}
                          >
                            {statusLabel(guest.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              guest.conviteStatus === "ENVIADO"
                                ? "border-green-200 bg-green-100 text-green-800"
                                : "border-slate-200 bg-slate-100 text-slate-700"
                            }
                          >
                            {guest.conviteStatus === "ENVIADO"
                              ? "Enviado"
                              : "Não enviado"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-nowrap items-center gap-2">
                            <CopyInviteButton message={inviteMessage} />
                            <WhatsAppInviteButton
                              phone={guest.celular}
                              message={inviteMessage}
                              sent={guest.conviteStatus === "ENVIADO"}
                              markSent={async () => {
                                const formData = new FormData()
                                formData.set("id", guest.id)
                                return markGuestInviteSentAction(formData)
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {guest.status === "AGUARDANDO" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                                disabled={pending}
                                onClick={async () => {
                                  const formData = new FormData()
                                  formData.set("id", guest.id)
                                  formData.set("status", "CONFIRMADO")
                                  await submit(
                                    adminRespondGuestAction,
                                    formData,
                                    () => {},
                                  )
                                }}
                              >
                                Confirmar
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10"
                              onClick={() => setEditingGuest(guest)}
                              disabled={pending}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-10"
                              onClick={() => setDeletingGuest(guest)}
                              disabled={pending}
                            >
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "familias" && (
        <Card className="border-primary/20 bg-card/95 shadow-lg shadow-primary/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10">
          <CardHeader className="border-b border-border/70 bg-secondary/30">
            <CardTitle className="text-lg">Famílias</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {families.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma família cadastrada.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-gray-300">
                    <TableHead>Família</TableHead>
                    <TableHead>Membros</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Convite</TableHead>
                    <TableHead>Ações do convite</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {families.map((family) => {
                    const url = `${baseUrl}/?guest=${family.link?.token ?? ""}`
                    const inviteMessage = [message.trim(), url]
                      .filter(Boolean)
                      .join("\n\n")
                    const status = familyStatus(family)

                    return (
                      <TableRow
                        key={family.id}
                        className="border-b-gray-300 transition-colors hover:bg-accent/50"
                      >
                        <TableCell className="font-medium">{family.nome}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {familyMembersSummary(family)}
                        </TableCell>
                        <TableCell>{formatBrazilianMobile(family.celular)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusClassName(status)}>
                            {statusLabel(status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              family.conviteStatus === "ENVIADO"
                                ? "border-green-200 bg-green-100 text-green-800"
                                : "border-slate-200 bg-slate-100 text-slate-700"
                            }
                          >
                            {family.conviteStatus === "ENVIADO"
                              ? "Enviado"
                              : "Não enviado"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-nowrap items-center gap-2">
                            <CopyInviteButton message={inviteMessage} />
                            <WhatsAppInviteButton
                              phone={family.celular}
                              message={inviteMessage}
                              sent={family.conviteStatus === "ENVIADO"}
                              markSent={async () => {
                                const formData = new FormData()
                                formData.set("id", family.id)
                                return markFamilyInviteSentAction(formData)
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {status === "AGUARDANDO" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                                disabled={pending}
                                onClick={() => setConfirmingFamily(family)}
                              >
                                Confirmar
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10"
                              onClick={() => setEditingFamily(family)}
                              disabled={pending}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-10"
                              onClick={() => setDeletingFamily(family)}
                              disabled={pending}
                            >
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <CreateGuestDialog
        open={createGuestOpen}
        onOpenChange={setCreateGuestOpen}
        submit={submit}
      />
      <CreateFamilyDialog
        open={createFamilyOpen}
        onOpenChange={setCreateFamilyOpen}
        submit={submit}
      />
      <EditGuestDialog
        guest={editingGuest}
        families={families.map((f) => ({ id: f.id, nome: f.nome }))}
        onOpenChange={() => setEditingGuest(null)}
        submit={submit}
      />
      <EditFamilyDialog
        family={editingFamily}
        onOpenChange={() => setEditingFamily(null)}
        submit={submit}
      />
      <DeleteGuestDialog
        guest={deletingGuest}
        onOpenChange={() => setDeletingGuest(null)}
        submit={submit}
      />
      <DeleteFamilyDialog
        family={deletingFamily}
        onOpenChange={() => setDeletingFamily(null)}
        submit={submit}
      />
      <AdminConfirmFamilyDialog
        family={confirmingFamily}
        onOpenChange={() => setConfirmingFamily(null)}
        submit={submit}
      />
    </>
  )
}
