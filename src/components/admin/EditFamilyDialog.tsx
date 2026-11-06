"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { promoteToIndividualAction } from "@/app/actions/guests"
import { updateFamilyAction } from "@/app/actions/families"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatBrazilianMobile } from "@/lib/validation"
import { GuestSubmitButton } from "@/components/admin/GuestSubmitButton"
import type { Family, FamilyMember, GuestAction } from "@/components/admin/GuestTypes"

type MemberDraft = {
  id?: string
  nome: string
  tipo: "ADULTO" | "IDOSO" | "CRIANCA"
  celular: string
  isRepresentante: boolean
}

const TIPO_LABELS: Record<string, string> = {
  ADULTO: "Adulto",
  IDOSO: "Idoso",
  CRIANCA: "Criança",
}

function toMemberDraft(m: FamilyMember & { celular?: string }): MemberDraft {
  return {
    id: m.id,
    nome: m.nome,
    tipo: m.tipo as MemberDraft["tipo"],
    celular: m.celular ?? "",
    isRepresentante: m.isRepresentante,
  }
}

export function EditFamilyDialog({
  family,
  onOpenChange,
  submit,
}: {
  family: Family | null
  onOpenChange: (open: boolean) => void
  submit: (action: GuestAction, formData: FormData, onSuccess: () => void) => void
}) {
  const [nome, setNome] = useState("")
  const [celular, setCelular] = useState("")
  const [members, setMembers] = useState<MemberDraft[]>([])

  useEffect(() => {
    if (family) {
      setNome(family.nome)
      setCelular(formatBrazilianMobile(family.celular))
      const sorted = [...family.members].sort((a, b) =>
        a.isRepresentante === b.isRepresentante ? 0 : a.isRepresentante ? -1 : 1,
      )
      setMembers(sorted.map(toMemberDraft))
    }
  }, [family])

  function handleOpenChange(open: boolean) {
    onOpenChange(open)
  }

  function addMember() {
    setMembers((prev) => [
      ...prev,
      { nome: "", tipo: "ADULTO", celular: "", isRepresentante: false },
    ])
  }

  function removeMember(index: number) {
    if (index === 0) return
    setMembers((prev) => prev.filter((_, i) => i !== index))
  }

  function updateMember(index: number, patch: Partial<MemberDraft>) {
    setMembers((prev) =>
      prev.map((m, i) => {
        if (i !== index) return m
        const updated = { ...m, ...patch }
        if (index === 0 && patch.celular !== undefined && !celular) {
          setCelular(patch.celular)
        }
        return updated
      }),
    )
  }

  function makeRepresentante(index: number) {
    const newRep = members[index]
    setMembers((prev) => {
      const next = [...prev]
      const [selected] = next.splice(index, 1)
      next.unshift(selected)
      return next
    })
    if (newRep && !celular && newRep.celular) {
      setCelular(newRep.celular)
    }
  }

  function handlePromoteToIndividual(memberId: string) {
    const formData = new FormData()
    formData.set("guestId", memberId)
    submit(promoteToIndividualAction as GuestAction, formData, () =>
      onOpenChange(false),
    )
  }

  function handleSubmit(formData: FormData) {
    formData.set(
      "members",
      JSON.stringify(members.map((m, i) => ({ ...m, isRepresentante: i === 0 }))),
    )
    submit(updateFamilyAction as GuestAction, formData, () => onOpenChange(false))
  }

  return (
    <Dialog open={!!family} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto [&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
        <DialogHeader>
          <DialogTitle>Editar família</DialogTitle>
          <DialogDescription>
            O primeiro membro é o representante — aparece como "Eu" no RSVP.
          </DialogDescription>
        </DialogHeader>
        {family ? (
          <form action={handleSubmit} className="flex flex-col gap-5">
            <input type="hidden" name="id" value={family.id} />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-family-nome">Nome da família</FieldLabel>
                <Input
                  id="edit-family-nome"
                  name="nome"
                  className="h-10"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-family-celular">
                  Celular (WhatsApp)
                </FieldLabel>
                <Input
                  id="edit-family-celular"
                  name="celular"
                  className="h-10"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  value={celular}
                  onChange={(e) => setCelular(formatBrazilianMobile(e.target.value))}
                />
              </Field>
            </FieldGroup>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Membros</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={addMember}
                >
                  <Plus className="size-3" />
                  Adicionar membro
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {members.map((m, i) => (
                  <div
                    key={m.id ?? `new-${i}`}
                    className="flex items-start gap-2 rounded-lg border border-border/60 bg-secondary/20 p-3"
                  >
                    <div className="flex flex-1 flex-col gap-2">
                      {i === 0 && (
                        <span className="text-xs font-medium text-primary">
                          Representante
                        </span>
                      )}
                      <div className="flex gap-2">
                        <Input
                          className="h-8 flex-1 text-sm"
                          placeholder="Nome"
                          value={m.nome}
                          onChange={(e) => updateMember(i, { nome: e.target.value })}
                          required
                        />
                        <Select
                          value={m.tipo}
                          onValueChange={(v) =>
                            updateMember(i, { tipo: v as MemberDraft["tipo"] })
                          }
                        >
                          <SelectTrigger className="w-auto" size="lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TIPO_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {i === 0 && (
                        <Input
                          className="h-8 text-sm"
                          type="tel"
                          inputMode="numeric"
                          placeholder="Celular do representante (opcional)"
                          value={m.celular}
                          onChange={(e) => {
                            const formatted = formatBrazilianMobile(e.target.value)
                            updateMember(i, { celular: formatted })
                          }}
                        />
                      )}
                      <div className="flex gap-2 items-center justify-between w-full">
                        {i !== 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-full px-2 text-xs text-muted-foreground flex-1"
                            onClick={() => makeRepresentante(i)}
                          >
                            Tornar representante
                          </Button>
                        )}
                        {m.id && i !== 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-full px-2 text-xs text-muted-foreground flex-1"
                            onClick={() => handlePromoteToIndividual(m.id!)}
                          >
                            Tornar convidado individual
                          </Button>
                        )}
                      </div>
                    </div>
                    {i !== 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeMember(i)}
                        aria-label="Remover membro"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="border-t-0 bg-transparent">
              <DialogClose render={<Button variant="outline" className="h-10" />}>
                Cancelar
              </DialogClose>
              <GuestSubmitButton
                idleLabel="Salvar alterações"
                pendingLabel="Salvando..."
              />
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
