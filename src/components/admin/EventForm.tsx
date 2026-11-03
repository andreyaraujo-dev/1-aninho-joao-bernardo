"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateEventAction } from "@/app/actions/event"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function EventForm({ date, message }: { date: string; message: string }) {
  const router = useRouter()
  const [eventDate, setEventDate] = useState(date)
  const [eventMessage, setEventMessage] = useState(message)
  const [pending, setPending] = useState(false)

  async function submit(formData: FormData) {
    setPending(true)
    try {
      const result = await updateEventAction(formData)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(result.success ?? "Evento atualizado.")
      router.refresh()
    } catch {
      toast.error("Não foi possível atualizar o evento.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="max-w-2xl border-primary/15 bg-card/90 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle>Dados do convite</CardTitle>
        <CardDescription>
          Essa mensagem será usada ao copiar o convite de cada convidado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={submit} className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="dataEvento">Data do evento</FieldLabel>
              <Input
                id="dataEvento"
                name="dataEvento"
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="mensagem">Mensagem de envio</FieldLabel>
              <Textarea
                id="mensagem"
                name="mensagem"
                value={eventMessage}
                onChange={(event) => setEventMessage(event.target.value)}
                rows={5}
                required
              />
            </Field>
          </FieldGroup>
          <Button type="submit" disabled={pending}>
            {pending ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : null}
            {pending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
