import { getEvent } from "@/lib/event"
import { prisma } from "@/lib/prisma"
import { GuestManager } from "@/components/admin/GuestManager"

export const dynamic = "force-dynamic"

export default async function GuestsPage() {
  const [guests, event] = await Promise.all([
    prisma.guest.findMany({
      include: { link: true },
      orderBy: { createdAt: "desc" },
    }),
    getEvent(),
  ])
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  return (
    <GuestManager
      guests={guests.map(({ id, nome, celular, status, conviteStatus, link }) => ({
        id,
        nome,
        celular,
        status,
        conviteStatus,
        link,
      }))}
      message={event.mensagem}
      baseUrl={baseUrl}
    />
  )
}
