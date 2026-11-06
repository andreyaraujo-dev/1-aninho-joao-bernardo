"use client"

import { useState } from "react"
import { createGuestAction } from "@/app/actions/guests"
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
import type { GuestAction } from "@/components/admin/GuestTypes"

export function CreateGuestDialog({
  open,
  onOpenChange,
  submit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  submit: (action: GuestAction, formData: FormData, onSuccess: () => void) => void
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      setName("")
      setPhone("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="[&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
        <DialogHeader>
          <DialogTitle>Novo convidado</DialogTitle>
          <DialogDescription>
            Um link privado será criado automaticamente.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            submit(createGuestAction, formData, () => handleOpenChange(false))
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
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                value={phone}
                onChange={(event) =>
                  setPhone(formatBrazilianMobile(event.target.value))
                }
              />
            </Field>
            <Field>
              <FieldLabel>Tipo</FieldLabel>
              <Select name="tipo" defaultValue="ADULTO">
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
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="h-10" />}>
              Cancelar
            </DialogClose>
            <GuestSubmitButton idleLabel="Cadastrar" pendingLabel="Salvando..." />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
