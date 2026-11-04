"use client"

import { useState } from "react"
import { updateGuestAction } from "@/app/actions/guests"
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
import { GuestSubmitButton } from "@/components/admin/GuestSubmitButton"
import type { Guest, GuestAction } from "@/components/admin/GuestTypes"

export function EditGuestDialog({
  guest,
  onOpenChange,
  submit,
}: {
  guest: Guest | null
  onOpenChange: (open: boolean) => void
  submit: (action: GuestAction, formData: FormData, onSuccess: () => void) => void
}) {
  const [name, setName] = useState(() => guest?.nome ?? "")
  const [phone, setPhone] = useState(() =>
    guest ? formatBrazilianMobile(guest.celular) : "",
  )

  function handleOpenChange(open: boolean) {
    onOpenChange(open)
    if (open && guest) {
      setName(guest.nome)
      setPhone(formatBrazilianMobile(guest.celular))
    }
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
            </FieldGroup>
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
