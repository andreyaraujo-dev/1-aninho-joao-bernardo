"use client"

import { useEffect, useState } from "react"
import { addToFamilyAction, updateGuestAction } from "@/app/actions/guests"
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
import { formatBrazilianMobile } from "@/lib/validation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GuestSubmitButton } from "@/components/admin/GuestSubmitButton"
import type { Family, Guest, GuestAction } from "@/components/admin/GuestTypes"

export function EditGuestDialog({
  guest,
  families,
  onOpenChange,
  submit,
}: {
  guest: Guest | null
  families: Pick<Family, "id" | "nome">[]
  onOpenChange: (open: boolean) => void
  submit: (action: GuestAction, formData: FormData, onSuccess: () => void) => void
}) {
  const [name, setName] = useState(() => guest?.nome ?? "")
  const [phone, setPhone] = useState(() =>
    guest ? formatBrazilianMobile(guest.celular) : "",
  )
  const [selectedFamilyId, setSelectedFamilyId] = useState("")
  const [showMoveFamily, setShowMoveFamily] = useState(false)

  useEffect(() => {
    if (guest) {
      setName(guest.nome)
      setPhone(formatBrazilianMobile(guest.celular))
      setShowMoveFamily(false)
      setSelectedFamilyId("")
    }
  }, [guest])

  function handleOpenChange(open: boolean) {
    onOpenChange(open)
  }

  function handleMoveToFamily() {
    if (!guest || !selectedFamilyId) return
    const formData = new FormData()
    formData.set("guestId", guest.id)
    formData.set("familyId", selectedFamilyId)
    submit(addToFamilyAction as GuestAction, formData, () => onOpenChange(false))
  }

  return (
    <Dialog open={!!guest} onOpenChange={handleOpenChange}>
      <DialogContent className="[&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
        <DialogHeader>
          <DialogTitle>Editar convidado</DialogTitle>
          <DialogDescription>Atualize os dados deste convidado.</DialogDescription>
        </DialogHeader>
        {guest ? (
          <form
            action={(formData) =>
              submit(updateGuestAction, formData, () => onOpenChange(false))
            }
            className="flex flex-col gap-5"
          >
            <input type="hidden" name="id" value={guest.id} />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-nome">Nome</FieldLabel>
                <Input
                  id="edit-nome"
                  name="nome"
                  className="h-10"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
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
                  value={phone}
                  onChange={(event) =>
                    setPhone(formatBrazilianMobile(event.target.value))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Select name="tipo" defaultValue={guest.tipo ?? "ADULTO"}>
                  <SelectTrigger size="lg" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADULTO">Adulto</SelectItem>
                    <SelectItem value="IDOSO">Idoso</SelectItem>
                    <SelectItem value="CRIANCA">Criança</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            {families.length > 0 && (
              <div className="border-t border-border/60 pt-4">
                {!showMoveFamily ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowMoveFamily(true)}
                  >
                    Mover para família
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedFamilyId || undefined}
                      onValueChange={(v) => setSelectedFamilyId(v ?? "")}
                    >
                      <SelectTrigger className="flex-1" size="lg">
                        <SelectValue placeholder="Selecione uma família" />
                      </SelectTrigger>
                      <SelectContent>
                        {families.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      className="h-9 text-xs"
                      disabled={!selectedFamilyId}
                      onClick={handleMoveToFamily}
                    >
                      Mover
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 text-xs"
                      onClick={() => setShowMoveFamily(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            )}

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
