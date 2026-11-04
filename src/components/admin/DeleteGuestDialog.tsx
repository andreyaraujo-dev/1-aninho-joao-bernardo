"use client"

import { Button } from "@/components/ui/button"
import { deleteGuestAction } from "@/app/actions/guests"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GuestSubmitButton } from "@/components/admin/GuestSubmitButton"
import type { Guest, GuestAction } from "@/components/admin/GuestTypes"

export function DeleteGuestDialog({
  guest,
  onOpenChange,
  submit,
}: {
  guest: Guest | null
  onOpenChange: (open: boolean) => void
  submit: (action: GuestAction, formData: FormData, onSuccess: () => void) => void
}) {
  return (
    <Dialog open={!!guest} onOpenChange={onOpenChange}>
      <DialogContent className="[&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
        <DialogHeader>
          <DialogTitle>Excluir convidado?</DialogTitle>
          <DialogDescription>
            O convidado {guest?.nome} e seu link serão removidos permanentemente.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            submit(deleteGuestAction, formData, () => onOpenChange(false))
          }
        >
          <input type="hidden" name="id" value={guest?.id ?? ""} />
          <DialogFooter className="border-t-0 bg-transparent">
            <DialogClose render={<Button variant="outline" className="h-10" />}>
              Cancelar
            </DialogClose>
            <GuestSubmitButton
              variant="destructive"
              idleLabel="Excluir convidado"
              pendingLabel="Excluindo..."
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
