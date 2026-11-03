"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { getEvent, isEventPast } from "@/lib/event"
import { prisma } from "@/lib/prisma"
import { clearSession, createSession, getSessionUserId } from "@/lib/session"
import { firstValidationError, formDataToObject, loginSchema } from "@/lib/validation"

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const { login, senha } = parsed.data
  const event = await getEvent()

  if (isEventPast(event.dataEvento)) {
    return { error: "O acesso administrativo foi encerrado após o evento." }
  }

  const user = await prisma.user.findFirst({ where: { login, ativo: true } })
  if (!user || !(await bcrypt.compare(senha, user.senha))) {
    return { error: "Login ou senha inválidos." }
  }

  await createSession(user.id)
  redirect("/admin")
}

export async function logoutAction() {
  await clearSession()
  redirect("/admin/login")
}

export async function requireUser() {
  const userId = await getSessionUserId()
  if (!userId) redirect("/admin/login")
  const event = await getEvent()

  const user = await prisma.user.findFirst({
    where: { id: userId, ativo: true },
  })
  if (!user) {
    await clearSession()
    redirect("/admin/login")
  }

  if (isEventPast(event.dataEvento)) {
    await clearSession()
    redirect("/admin/login")
  }

  return user
}
