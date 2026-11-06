"use client"

import { deleteFamilyAction } from "@/app/actions/families"
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
import { GuestSubmitButton } from "@/components/admin/GuestSubmitButton"
import type { Family, GuestAction } from "@/components/admin/GuestTypes"

export function DeleteFamilyDialog({
  family,
  onOpenChange,
  submit,
}: {
  family: Family | null
  onOpenChange: (open: boolean) => void
  submit: (action: GuestAction, formData: FormData, onSuccess: () => void) => void
}) {
  return (
    <Dialog open={!!family} onOpenChange={onOpenChange}>
      <DialogContent className="[&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
        <DialogHeader>
          <DialogTitle>Excluir família?</DialogTitle>
          <DialogDescription>
            A família <strong>{family?.nome}</strong> e todos os seus{" "}
            {family?.members.length ?? 0} membro(s) serão removidos permanentemente.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            submit(deleteFamilyAction as GuestAction, formData, () =>
              onOpenChange(false),
            )
          }
        >
          <input type="hidden" name="id" value={family?.id ?? ""} />
          <DialogFooter className="border-t-0 bg-transparent">
            <DialogClose render={<Button variant="outline" className="h-10" />}>
              Cancelar
            </DialogClose>
            <GuestSubmitButton
              variant="destructive"
              idleLabel="Excluir família"
              pendingLabel="Excluindo..."
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
