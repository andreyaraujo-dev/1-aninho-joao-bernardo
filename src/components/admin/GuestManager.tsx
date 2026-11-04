"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  createGuestAction,
  deleteGuestAction,
  markGuestInviteSentAction,
  updateGuestAction,
} from "@/app/actions/guests"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CopyInviteButton } from "@/components/admin/CopyInviteButton"
import { WhatsAppInviteButton } from "@/components/admin/WhatsAppInviteButton"
import { formatBrazilianMobile } from "@/lib/validation"

type Guest = {
  id: string
  nome: string
  celular: string
  status: string
  conviteStatus: string
  link: { token: string } | null
}

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
  const [createName, setCreateName] = useState("")
  const [createPhone, setCreatePhone] = useState("")
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(
    action: (formData: FormData) => Promise<{ success?: string; error?: string }>,
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
        <Button
          className="h-10"
          onClick={() => {
            setCreateName("")
            setCreatePhone("")
            setCreateOpen(true)
          }}
        >
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
                            onClick={() => {
                              setEditing(guest)
                              setEditName(guest.nome)
                              setEditPhone(formatBrazilianMobile(guest.celular))
                            }}
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

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) {
            setCreateName("")
            setCreatePhone("")
          }
        }}
      >
        <DialogContent className="[&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
          <DialogHeader>
            <DialogTitle>Novo convidado</DialogTitle>
            <DialogDescription>
              Um link privado será criado automaticamente.
            </DialogDescription>
          </DialogHeader>
          <form
            action={(formData) =>
              submit(createGuestAction, formData, () => {
                setCreateName("")
                setCreatePhone("")
                setCreateOpen(false)
              })
            }
            className="flex flex-col gap-5"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="create-nome">Nome</FieldLabel>
                <Input
                  id="create-nome"
                  name="nome"
                  className="h-10"
                  value={createName}
                  onChange={(event) => setCreateName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="create-celular">Número celular</FieldLabel>
                <Input
                  id="create-celular"
                  name="celular"
                  className="h-10"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  value={createPhone}
                  onChange={(event) =>
                    setCreatePhone(formatBrazilianMobile(event.target.value))
                  }
                />
              </Field>
            </FieldGroup>
            <DialogFooter className="border-t-0 bg-transparent">
              <DialogClose
                render={
                  <Button
                    variant="outline"
                    className="h-10"
                    onClick={() => setCreatePhone("")}
                  />
                }
              >
                Cancelar
              </DialogClose>
              <Button type="submit" className="h-10" disabled={pending}>
                {pending ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : null}
                {pending ? "Salvando..." : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            setEditName("")
            setEditPhone("")
          }
        }}
      >
        <DialogContent className="[&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
          <DialogHeader>
            <DialogTitle>Editar convidado</DialogTitle>
            <DialogDescription>Atualize os dados deste convidado.</DialogDescription>
          </DialogHeader>
          {editing ? (
            <form
              action={(formData) =>
                submit(updateGuestAction, formData, () => {
                  setEditName("")
                  setEditPhone("")
                  setEditing(null)
                })
              }
              className="flex flex-col gap-5"
            >
              <input type="hidden" name="id" value={editing.id} />
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-nome">Nome</FieldLabel>
                  <Input
                    id="edit-nome"
                    name="nome"
                    className="h-10"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-celular">Número celular</FieldLabel>
                  <Input
                    id="edit-celular"
                    name="celular"
                    className="h-10"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="(11) 99999-9999"
                    value={editPhone}
                    onChange={(event) =>
                      setEditPhone(formatBrazilianMobile(event.target.value))
                    }
                  />
                </Field>
              </FieldGroup>
              <DialogFooter className="border-t-0 bg-transparent">
                <DialogClose render={<Button variant="outline" className="h-10" />}>
                  Cancelar
                </DialogClose>
                <Button type="submit" className="h-10" disabled={pending}>
                  {pending ? (
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                  ) : null}
                  {pending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="[&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
          <DialogHeader>
            <DialogTitle>Excluir convidado?</DialogTitle>
            <DialogDescription>
              O convidado {deleting?.nome} e seu link serão removidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <form
            action={(formData) =>
              submit(deleteGuestAction, formData, () => setDeleting(null))
            }
          >
            <input type="hidden" name="id" value={deleting?.id ?? ""} />
            <DialogFooter className="border-t-0 bg-transparent">
              <DialogClose render={<Button variant="outline" className="h-10" />}>
                Cancelar
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
                className="h-10"
                disabled={pending}
              >
                {pending ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : null}
                {pending ? "Excluindo..." : "Excluir convidado"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
