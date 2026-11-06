import { Baby, Users, UserRoundCheck, UserRoundX, UserCheck } from "lucide-react"
import { getEvent } from "@/lib/event"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  ] = await Promise.all([
    getEvent(),
    prisma.guest.count(),
    prisma.guest.count({ where: { status: "CONFIRMADO" } }),
    prisma.guest.count({ where: { status: "NAO_CONFIRMADO" } }),
    prisma.guest.count({ where: { status: "CONFIRMADO", tipo: "ADULTO" } }),
    prisma.guest.count({ where: { status: "CONFIRMADO", tipo: "IDOSO" } }),
    prisma.guest.count({ where: { status: "CONFIRMADO", tipo: "CRIANCA" } }),
    prisma.family.count(),
  ])
  const pending = total - confirmed - declined
  const stats = [
    { label: "Total de convidados", value: total, icon: Users },
    { label: "Confirmados", value: confirmed, icon: UserRoundCheck },
    { label: "Aguardando", value: pending, icon: Users },
    { label: "Não confirmaram", value: declined, icon: UserRoundX },
  ]
  const typeStats = [
    { label: "Adultos confirmados", value: confirmedAdults, icon: UserCheck },
    { label: "Idosos confirmados", value: confirmedIdosos, icon: UserCheck },
    { label: "Crianças confirmadas", value: confirmedCriancas, icon: Baby },
    { label: "Famílias cadastradas", value: totalFamilies, icon: Users },
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card
            key={label}
            className="border-primary/20 bg-card/95 shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15"
          >
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold tracking-tight text-foreground">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          Confirmados por perfil
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {typeStats.map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
              className="border-primary/20 bg-card/95 shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15"
            >
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight text-foreground">
                  {value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
