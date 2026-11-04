"use client"

import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SaveEventButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="h-10" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
      {pending ? "Salvando..." : "Salvar alterações"}
    </Button>
  )
}
