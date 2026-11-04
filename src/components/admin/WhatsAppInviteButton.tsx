"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function WhatsAppInviteButton({
  phone,
  message,
  sent,
  markSent,
}: {
  phone: string
  message: string
  sent: boolean
  markSent: () => Promise<{ success?: string; error?: string }>
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const hasPhone = phone.length > 0

  async function send() {
    if (!hasPhone || pending) return

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    if (!whatsappWindow) {
      toast.error(
        "Não foi possível abrir o WhatsApp. Verifique o bloqueador de pop-ups.",
      )
      return
    }

    setPending(true)
    try {
      const result = await markSent()
      if (result.error) {
        whatsappWindow.close()
        toast.error(result.error)
        return
      }
      if (!sent) toast.success(result.success ?? "Convite marcado como enviado.")
      router.refresh()
    } catch {
      whatsappWindow.close()
      toast.error("Não foi possível registrar o envio do convite.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-10"
      onClick={send}
      disabled={!hasPhone || pending}
      title={
        hasPhone ? "Enviar convite pelo WhatsApp" : "Cadastre um celular para enviar"
      }
    >
      {pending ? (
        <Loader2 className="animate-spin" data-icon="inline-start" />
      ) : (
        <MessageCircle data-icon="inline-start" />
      )}
      {pending ? "Abrindo..." : "WhatsApp"}
    </Button>
  )
}
