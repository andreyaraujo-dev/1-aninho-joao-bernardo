import bcrypt from "bcryptjs"
import { PrismaClient } from "../generated/prisma/client"

const prisma = new PrismaClient()

async function main() {
  const login = process.env.ADMIN_LOGIN ?? "admin"
  const senha = process.env.ADMIN_PASSWORD ?? "admin123"
  const passwordHash = await bcrypt.hash(senha, 12)

  await prisma.user.upsert({
    where: { login },
    update: { senha: passwordHash, ativo: true },
    create: { nome: "Administrador", login, senha: passwordHash },
  })

  const eventData = {
    dataEvento: new Date(process.env.EVENT_DATE ?? "2026-11-29T23:59:59-03:00"),
    mensagem:
      process.env.EVENT_MESSAGE ??
      "Será uma alegria ter você conosco na comemoração do João Bernardo!",
  }
  const event = await prisma.event.findFirst({ orderBy: { createdAt: "asc" } })
  if (event) {
    await prisma.event.update({ where: { id: event.id }, data: eventData })
  } else {
    await prisma.event.create({ data: eventData })
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
