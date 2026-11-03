import { getEvent } from "@/lib/event"
import { EventForm } from "@/components/admin/EventForm"

export const dynamic = "force-dynamic"

export default async function EventPage() {
  const event = await getEvent()
  const localDate = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(event.dataEvento)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Evento</h1>
        <p className="mt-2 text-muted-foreground">
          A data controla o acesso à área administrativa após a festa.
        </p>
      </div>
      <EventForm date={localDate} message={event.mensagem} />
    </div>
  )
}
