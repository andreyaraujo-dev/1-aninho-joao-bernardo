"use client"

import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GuestSubmitButton({
  idleLabel,
  pendingLabel,
  variant = "default",
}: {
  idleLabel: string
  pendingLabel: string
  variant?: "default" | "destructive"
}) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant={variant} className="h-10" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
      {pending ? pendingLabel : idleLabel}
    </Button>
  )
}
