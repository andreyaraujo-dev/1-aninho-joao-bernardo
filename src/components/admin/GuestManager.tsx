"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { markGuestInviteSentAction } from "@/app/actions/guests"
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
import { DeleteGuestDialog } from "@/components/admin/DeleteGuestDialog"
import { EditGuestDialog } from "@/components/admin/EditGuestDialog"
import { WhatsAppInviteButton } from "@/components/admin/WhatsAppInviteButton"
import type { Guest, GuestAction } from "@/components/admin/GuestTypes"
import { formatBrazilianMobile } from "@/lib/validation"

function statusLabel(status: string) {
  if (status === "CONFIRMADO") return "Confirmado"
  if (status === "NAO_CONFIRMADO") return "Não confirmou"
  return "Aguardando"
}

function statusClassName(status: string) {
  if (status === "CONFIRMADO") {
    return "border-green-200 bg-green-100 text-green-800"
  }
  if (status === "NAO_CONFIRMADO") {
    return "border-red-200 bg-red-100 text-red-800"
  }
  return "border-yellow-200 bg-yellow-100 text-yellow-800"
}

export function GuestManager({
  guests,
  message,
  baseUrl,
}: {
  guests: Guest[]
  message: string
  baseUrl: string
}) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Guest | null>(null)
  const [deleting, setDeleting] = useState<Guest | null>(null)
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

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Convidados</h1>
          <p className="mt-2 text-muted-foreground">
            Cadastre pessoas e acompanhe as respostas do convite.
          </p>
        </div>
        <Button className="h-10" onClick={() => setCreateOpen(true)}>
          Novo convidado
        </Button>
      </div>

      <Card className="border-primary/20 bg-card/95 shadow-lg shadow-primary/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10">
        <CardHeader className="border-b border-border/70 bg-secondary/30">
          <CardTitle className="text-lg">Lista de convidados</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {guests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum convidado cadastrado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b-gray-300">
                  <TableHead>Nome</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Status do convidado</TableHead>
                  <TableHead>Status do convite</TableHead>
                  <TableHead>Ações do convite</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => {
                  const url = `${baseUrl}/?guest=${guest.link?.token ?? ""}`
                  const inviteMessage = [message.trim(), url]
                    .filter(Boolean)
                    .join("\n\n")

                  return (
                    <TableRow
                      key={guest.id}
                      className="transition-colors hover:bg-accent/50 border-b-gray-300"
                    >
                      <TableCell className="font-medium">{guest.nome}</TableCell>
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10"
                            onClick={() => setEditing(guest)}
                            disabled={pending}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-10"
                            onClick={() => setDeleting(guest)}
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

      <CreateGuestDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        submit={submit}
      />
      <EditGuestDialog
        guest={editing}
        onOpenChange={() => setEditing(null)}
        submit={submit}
      />
      <DeleteGuestDialog
        guest={deleting}
        onOpenChange={() => setDeleting(null)}
        submit={submit}
      />
    </>
  )
}
