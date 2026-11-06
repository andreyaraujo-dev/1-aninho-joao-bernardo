import { getEvent } from "@/lib/event"
import { prisma } from "@/lib/prisma"
import { GuestManager } from "@/components/admin/GuestManager"

export const dynamic = "force-dynamic"

export default async function GuestsPage() {
  const [guests, families, event] = await Promise.all([
    prisma.guest.findMany({
      include: { link: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.family.findMany({
      include: {
        link: true,
        members: { orderBy: [{ isRepresentante: "desc" }, { createdAt: "asc" }] },
      },
      orderBy: { createdAt: "desc" },
    }),
    getEvent(),
  ])
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  return (
    <GuestManager
      guests={guests.map((g) => ({
        id: g.id,
        nome: g.nome,
        celular: g.celular,
        tipo: g.tipo,
        status: g.status,
        conviteStatus: g.conviteStatus,
        isRepresentante: g.isRepresentante,
        familyId: g.familyId,
        link: g.link,
      }))}
      families={families.map((f) => ({
        id: f.id,
        nome: f.nome,
        celular: f.celular,
        conviteStatus: f.conviteStatus,
        link: f.link,
        members: f.members.map((m) => ({
          id: m.id,
          nome: m.nome,
          tipo: m.tipo,
          status: m.status,
          celular: m.celular,
          isRepresentante: m.isRepresentante,
        })),
      }))}
      message={event.mensagem}
      baseUrl={baseUrl}
    />
  )
}
