"use client"

import { useState } from "react"
import { adminRespondFamilyAction } from "@/app/actions/families"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Family, GuestAction } from "@/components/admin/GuestTypes"

export function AdminConfirmFamilyDialog({
  family,
  onOpenChange,
  submit,
}: {
  family: Family | null
  onOpenChange: (open: boolean) => void
  submit: (
    action: GuestAction,
    formData: FormData,
    onSuccess: () => void,
  ) => Promise<void>
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function handleOpenChange(open: boolean) {
    if (!open) setSelected(new Set())
    onOpenChange(open)
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSelectAll() {
    if (!family) return
    if (selected.size === family.members.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(family.members.map((m) => m.id)))
    }
  }

  async function handleConfirm() {
    if (!family) return
    const formData = new FormData()
    formData.set("id", family.id)
    formData.set("selectedIds", JSON.stringify([...selected]))
    await submit(adminRespondFamilyAction, formData, () => handleOpenChange(false))
  }

  if (!family) return null

  const allSelected = selected.size === family.members.length

  return (
    <Dialog open={!!family} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar presença – {family.nome}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Marque os membros que vão comparecer. Os desmarcados serão registrados como
          não confirmados.
        </p>

        <div className="flex flex-col gap-3 py-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-left text-sm font-medium text-primary hover:underline"
          >
            {allSelected ? "Desmarcar todos" : "Selecionar todos"}
          </button>

          {family.members.map((member) => (
            <label
              key={member.id}
              className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1 hover:bg-accent/40"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-primary"
                checked={selected.has(member.id)}
                onChange={() => toggle(member.id)}
              />
              <span className="text-sm">
                {member.nome}
                {member.tipo === "IDOSO" && (
                  <span className="ml-2 text-xs text-muted-foreground">(idoso)</span>
                )}
                {member.tipo === "CRIANCA" && (
                  <span className="ml-2 text-xs text-muted-foreground">(criança)</span>
                )}
              </span>
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar presença</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
