"use client"

import { useState } from "react"
import { Baby, Users, UserRoundCheck, UserRoundX, UserCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type IconKey = "users" | "userRoundCheck" | "userRoundX" | "userCheck" | "baby"

const iconMap: Record<IconKey, React.ElementType> = {
  users: Users,
  userRoundCheck: UserRoundCheck,
  userRoundX: UserRoundX,
  userCheck: UserCheck,
  baby: Baby,
}

type GuestRow = {
  id: string
  nome: string
  tipo: string
  status: string
  familyName: string | null
}

type FamilyRow = {
  id: string
  nome: string
  conviteStatus: string
  members: { id: string; nome: string; tipo: string; status: string }[]
}

type Category =
  | "total"
  | "confirmado"
  | "aguardando"
  | "naoConfirmado"
  | "adultos"
  | "idosos"
  | "criancas"
  | "familias"

function statusLabel(status: string) {
  if (status === "CONFIRMADO") return "Confirmado"
  if (status === "NAO_CONFIRMADO") return "Não confirmou"
  return "Aguardando"
}

function statusClassName(status: string) {
  if (status === "CONFIRMADO") return "border-green-200 bg-green-100 text-green-800"
  if (status === "NAO_CONFIRMADO") return "border-red-200 bg-red-100 text-red-800"
  return "border-yellow-200 bg-yellow-100 text-yellow-800"
}

function tipoLabel(tipo: string) {
  if (tipo === "IDOSO") return "Idoso"
  if (tipo === "CRIANCA") return "Criança"
  return "Adulto"
}

function tipoClassName(tipo: string) {
  if (tipo === "IDOSO") return "border-blue-200 bg-blue-100 text-blue-800"
  if (tipo === "CRIANCA") return "border-purple-200 bg-purple-100 text-purple-800"
  return "border-slate-200 bg-slate-100 text-slate-700"
}

function familyStatus(family: FamilyRow): string {
  const statuses = family.members.map((m) => m.status)
  if (statuses.every((s) => s === "AGUARDANDO")) return "AGUARDANDO"
  if (statuses.some((s) => s === "CONFIRMADO")) return "CONFIRMADO"
  return "NAO_CONFIRMADO"
}

function filterGuests(guests: GuestRow[], category: Category): GuestRow[] {
  switch (category) {
    case "total":
      return guests
    case "confirmado":
      return guests.filter((g) => g.status === "CONFIRMADO")
    case "aguardando":
      return guests.filter((g) => g.status === "AGUARDANDO")
    case "naoConfirmado":
      return guests.filter((g) => g.status === "NAO_CONFIRMADO")
    case "adultos":
      return guests.filter((g) => g.status === "CONFIRMADO" && g.tipo === "ADULTO")
    case "idosos":
      return guests.filter((g) => g.status === "CONFIRMADO" && g.tipo === "IDOSO")
    case "criancas":
      return guests.filter((g) => g.status === "CONFIRMADO" && g.tipo === "CRIANCA")
    default:
      return []
  }
}

function sheetTitle(category: Category): string {
  switch (category) {
    case "total":
      return "Todos os convidados"
    case "confirmado":
      return "Confirmados"
    case "aguardando":
      return "Aguardando resposta"
    case "naoConfirmado":
      return "Não confirmaram"
    case "adultos":
      return "Adultos confirmados"
    case "idosos":
      return "Idosos confirmados"
    case "criancas":
      return "Crianças confirmadas"
    case "familias":
      return "Famílias cadastradas"
  }
}

export function DashboardStats({
  stats,
  typeStats,
  guests,
  families,
}: {
  stats: { label: string; value: number; icon: IconKey; category: Category }[]
  typeStats: { label: string; value: number; icon: IconKey; category: Category }[]
  guests: GuestRow[]
  families: FamilyRow[]
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Category | null>(null)

  function openSheet(category: Category) {
    setSelected(category)
    setOpen(true)
  }

  const filteredGuests =
    selected && selected !== "familias" ? filterGuests(guests, selected) : []
  const title = selected ? sheetTitle(selected) : ""

  const cardClass =
    "border-primary/20 bg-card/95 shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 cursor-pointer text-left w-full"

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon, category }) => {
          const Icon = iconMap[icon]
          return (
            <button
              key={label}
              type="button"
              className="rounded-xl"
              onClick={() => openSheet(category)}
            >
              <Card className={cardClass}>
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
                  <p className="mt-2 text-xs text-primary/70">Ver lista →</p>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          Confirmados por perfil
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {typeStats.map(({ label, value, icon, category }) => {
            const Icon = iconMap[icon]
            return (
              <button
                key={label}
                type="button"
                className="rounded-xl"
                onClick={() => openSheet(category)}
              >
                <Card className={cardClass}>
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
                    <p className="mt-2 text-xs text-primary/70">Ver lista →</p>
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>

          {selected === "familias" ? (
            <div className="mt-4 flex flex-col gap-4">
              {families.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma família cadastrada.
                </p>
              )}
              {families.map((family) => {
                const fStatus = familyStatus(family)
                return (
                  <div
                    key={family.id}
                    className="rounded-lg border border-border/60 bg-card"
                  >
                    <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/40">
                      <span className="font-medium">{family.nome}</span>
                      <Badge variant="outline" className={statusClassName(fStatus)}>
                        {statusLabel(fStatus)}
                      </Badge>
                    </div>
                    <ul className="flex flex-col divide-y divide-border/30">
                      {family.members.map((member) => (
                        <li
                          key={member.id}
                          className="flex items-center justify-between gap-2 px-4 py-2.5"
                        >
                          <span className="text-sm">{member.nome}</span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={tipoClassName(member.tipo)}
                            >
                              {tipoLabel(member.tipo)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={statusClassName(member.status)}
                            >
                              {statusLabel(member.status)}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              {filteredGuests.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum convidado nesta categoria.
                </p>
              )}
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-card px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{guest.nome}</span>
                    {guest.familyName && (
                      <span className="text-xs text-muted-foreground">
                        {guest.familyName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={tipoClassName(guest.tipo)}>
                      {tipoLabel(guest.tipo)}
                    </Badge>
                    <Badge variant="outline" className={statusClassName(guest.status)}>
                      {statusLabel(guest.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
