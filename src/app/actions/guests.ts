"use server"

import { randomBytes } from "node:crypto"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/app/actions/auth"
import {
  firstValidationError,
  formDataToObject,
  guestIdSchema,
  guestResponseSchema,
  guestSchema,
} from "@/lib/validation"

export async function createGuestAction(formData: FormData) {
  await requireUser()
  const parsed = guestSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  await prisma.guest.create({
    data: {
      ...parsed.data,
      link: { create: { token: randomBytes(18).toString("base64url") } },
    },
  })
  revalidatePath("/admin/convidados")
  return { success: "Convidado cadastrado com sucesso." }
}

export async function updateGuestAction(formData: FormData) {
  await requireUser()
  const parsed = guestIdSchema.merge(guestSchema).safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const { id, nome, celular } = parsed.data
  await prisma.guest.update({ where: { id }, data: { nome, celular } })
  revalidatePath("/admin/convidados")
  return { success: "Convidado atualizado com sucesso." }
}

export async function deleteGuestAction(formData: FormData) {
  await requireUser()
  const parsed = guestIdSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }
  const { id } = parsed.data
  await prisma.guestLink.deleteMany({ where: { guestId: id } })
  await prisma.guest.delete({ where: { id } })
  revalidatePath("/admin/convidados")
  return { success: "Convidado excluído com sucesso." }
}

export async function getGuestByToken(token: string) {
  const parsed = guestResponseSchema.shape.token.safeParse(token)
  if (!parsed.success) return null

  const link = await prisma.guestLink.findUnique({
    where: { token: parsed.data },
    include: { guest: true },
  })
  return link?.guest ?? null
}

export async function respondGuestAction(token: string, status: string) {
  const parsed = guestResponseSchema.safeParse({ token, status })
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const link = await prisma.guestLink.findUnique({
    where: { token: parsed.data.token },
  })
  if (!link) return { error: "Link de convidado inválido." }

  await prisma.guest.update({
    where: { id: link.guestId },
    data: { status: parsed.data.status, confirmacao: new Date() },
  })
  revalidatePath("/")
  return { ok: true }
}
