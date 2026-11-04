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

    const phoneDigits = phone.replace(/\D/g, "")
    const internationalPhone =
      phoneDigits.length === 13 && phoneDigits.startsWith("55")
        ? phoneDigits
        : `55${phoneDigits}`
    const whatsappUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`
    setPending(true)
    let whatsappWindow: Window | null = null
    try {
      whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer")
      const result = await markSent()
      if (result.error) {
        whatsappWindow?.close()
        toast.error(result.error)
        return
      }
      if (!sent) toast.success(result.success ?? "Convite marcado como enviado.")
      router.refresh()
    } catch {
      whatsappWindow?.close()
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
