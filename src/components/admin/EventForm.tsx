"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { format, parseISO } from "date-fns"
import { CalendarDays } from "lucide-react"
import { ptBR } from "react-day-picker/locale"
import { toast } from "sonner"
import { updateEventAction } from "@/app/actions/event"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { SaveEventButton } from "@/components/admin/SaveEventButton"

export function EventForm({ date, message }: { date: string; message: string }) {
  const router = useRouter()
  const [eventDate, setEventDate] = useState(date)
  const [eventMessage, setEventMessage] = useState(message)
  const [calendarOpen, setCalendarOpen] = useState(false)

  async function submit(formData: FormData) {
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
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      id="dataEvento"
                      type="button"
                      variant="outline"
                      className="h-10 w-full justify-between font-normal"
                      aria-expanded={calendarOpen}
                    />
                  }
                >
                  {eventDate
                    ? format(parseISO(eventDate), "dd/MM/yyyy")
                    : "Selecione uma data"}
                  <CalendarDays data-icon="inline-end" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventDate ? parseISO(eventDate) : undefined}
                    onSelect={(selectedDate) => {
                      if (!selectedDate) return
                      setEventDate(format(selectedDate, "yyyy-MM-dd"))
                      setCalendarOpen(false)
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <input type="hidden" name="dataEvento" value={eventDate} required />
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
          <SaveEventButton />
        </form>
      </CardContent>
    </Card>
  )
}
