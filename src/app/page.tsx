import App from "@/App"
import { getEvent } from "@/lib/event"

export const dynamic = "force-dynamic"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ guest?: string }>
}) {
  const params = await searchParams
  const event = await getEvent()
  return <App guestToken={params.guest} eventDate={event.dataEvento.toISOString()} />
}
