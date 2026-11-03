"use client"

import { useState } from "react"
import { Check, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CopyInviteButton({ message }: { message: string }) {
  const [copied, setCopied] = useState(false)
  const [pending, setPending] = useState(false)

  async function copy() {
    setPending(true)
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      toast.success("Mensagem do convite copiada.")
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error("Não foi possível copiar a mensagem.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy} disabled={pending}>
      {pending ? (
        <Loader2 className="animate-spin" data-icon="inline-start" />
      ) : copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      {pending ? "Copiando..." : copied ? "Copiada" : "Copiar convite"}
    </Button>
  )
}
