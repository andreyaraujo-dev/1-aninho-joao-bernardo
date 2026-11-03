import { prisma } from "@/lib/prisma"

export async function getEvent() {
  const event = await prisma.event.findFirst({ orderBy: { createdAt: "asc" } })
  if (event) return event

  return prisma.event.create({
    data: {
      dataEvento: new Date(process.env.EVENT_DATE ?? "2026-11-29T23:59:59-03:00"),
      mensagem:
        process.env.EVENT_MESSAGE ??
        "Será uma alegria ter você conosco na comemoração do João Bernardo!",
    },
  })
}

export function isEventPast(date: Date, now = new Date()) {
  return now > date
}
