import { getEvent } from "@/lib/event"
import { prisma } from "@/lib/prisma"
import { DashboardStats } from "@/components/admin/DashboardStats"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const [
    event,
    total,
    confirmed,
    declined,
    confirmedAdults,
    confirmedIdosos,
    confirmedCriancas,
    totalFamilies,
    allGuests,
    allFamilies,
  ] = await Promise.all([
    getEvent(),
    prisma.guest.count(),
    prisma.guest.count({ where: { status: "CONFIRMADO" } }),
    prisma.guest.count({ where: { status: "NAO_CONFIRMADO" } }),
    prisma.guest.count({ where: { status: "CONFIRMADO", tipo: "ADULTO" } }),
    prisma.guest.count({ where: { status: "CONFIRMADO", tipo: "IDOSO" } }),
    prisma.guest.count({ where: { status: "CONFIRMADO", tipo: "CRIANCA" } }),
    prisma.family.count(),
    prisma.guest.findMany({
      select: {
        id: true,
        nome: true,
        tipo: true,
        status: true,
        family: { select: { nome: true } },
      },
      orderBy: { nome: "asc" },
    }),
    prisma.family.findMany({
      select: {
        id: true,
        nome: true,
        conviteStatus: true,
        members: {
          select: { id: true, nome: true, tipo: true, status: true },
          orderBy: [{ isRepresentante: "desc" }, { createdAt: "asc" }],
        },
      },
      orderBy: { nome: "asc" },
    }),
  ])

  const pending = total - confirmed - declined

  const guests = allGuests.map((g) => ({
    id: g.id,
    nome: g.nome,
    tipo: g.tipo,
    status: g.status,
    familyName: g.family?.nome ?? null,
  }))

  const families = allFamilies.map((f) => ({
    id: f.id,
    nome: f.nome,
    conviteStatus: f.conviteStatus,
    members: f.members,
  }))

  const stats = [
    {
      label: "Total de convidados",
      value: total,
      icon: "users" as const,
      category: "total" as const,
    },
    {
      label: "Confirmados",
      value: confirmed,
      icon: "userRoundCheck" as const,
      category: "confirmado" as const,
    },
    {
      label: "Aguardando",
      value: pending,
      icon: "users" as const,
      category: "aguardando" as const,
    },
    {
      label: "Não confirmaram",
      value: declined,
      icon: "userRoundX" as const,
      category: "naoConfirmado" as const,
    },
  ]
  const typeStats = [
    {
      label: "Adultos confirmados",
      value: confirmedAdults,
      icon: "userCheck" as const,
      category: "adultos" as const,
    },
    {
      label: "Idosos confirmados",
      value: confirmedIdosos,
      icon: "userCheck" as const,
      category: "idosos" as const,
    },
    {
      label: "Crianças confirmadas",
      value: confirmedCriancas,
      icon: "baby" as const,
      category: "criancas" as const,
    },
    {
      label: "Famílias cadastradas",
      value: totalFamilies,
      icon: "users" as const,
      category: "familias" as const,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted-foreground">Painel</p>
        <h1 className="text-3xl font-semibold tracking-tight">Visão geral</h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe as respostas do convite do dia{" "}
          {event.dataEvento.toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          })}
          .
        </p>
      </div>
      <DashboardStats
        stats={stats}
        typeStats={typeStats}
        guests={guests}
        families={families}
      />
    </div>
  )
}
