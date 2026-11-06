"use server"

import { randomBytes } from "node:crypto"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/app/actions/auth"
import {
  addToFamilySchema,
  adminGuestResponseSchema,
  firstValidationError,
  formDataToObject,
  guestIdSchema,
  guestResponseSchema,
  guestSchema,
  familyResponseSchema,
  promoteToIndividualSchema,
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

  const { id, nome, celular, tipo } = parsed.data
  await prisma.guest.update({ where: { id }, data: { nome, celular, tipo } })
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

export async function markGuestInviteSentAction(formData: FormData) {
  await requireUser()
  const parsed = guestIdSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const guest = await prisma.guest.findUnique({
    where: { id: parsed.data.id },
    select: { celular: true },
  })
  if (!guest) return { error: "Convidado não encontrado." }
  if (!guest.celular) {
    return { error: "Cadastre um celular antes de enviar o convite." }
  }

  await prisma.guest.update({
    where: { id: parsed.data.id },
    data: { conviteStatus: "ENVIADO" },
  })
  revalidatePath("/admin/convidados")
  return { success: "Convite marcado como enviado." }
}

export async function promoteToIndividualAction(formData: FormData) {
  await requireUser()
  const parsed = promoteToIndividualSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const guest = await prisma.guest.findUnique({
    where: { id: parsed.data.guestId },
    include: { family: true },
  })
  if (!guest) return { error: "Convidado não encontrado." }
  if (!guest.familyId) return { error: "Convidado já é individual." }
  if (guest.isRepresentante) {
    return {
      error: "Nomeie outro representante na família antes de promover este convidado.",
    }
  }

  await prisma.guest.update({
    where: { id: parsed.data.guestId },
    data: {
      familyId: null,
      isRepresentante: false,
      link: { create: { token: randomBytes(18).toString("base64url") } },
    },
  })
  revalidatePath("/admin/convidados")
  return { success: "Convidado promovido a individual com sucesso." }
}

export async function addToFamilyAction(formData: FormData) {
  await requireUser()
  const parsed = addToFamilySchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const guest = await prisma.guest.findUnique({ where: { id: parsed.data.guestId } })
  if (!guest) return { error: "Convidado não encontrado." }
  if (guest.familyId) return { error: "Convidado já pertence a uma família." }

  const family = await prisma.family.findUnique({ where: { id: parsed.data.familyId } })
  if (!family) return { error: "Família não encontrada." }

  await prisma.$transaction([
    prisma.guestLink.deleteMany({ where: { guestId: parsed.data.guestId } }),
    prisma.guest.update({
      where: { id: parsed.data.guestId },
      data: { familyId: parsed.data.familyId, isRepresentante: false },
    }),
  ])
  revalidatePath("/admin/convidados")
  return { success: "Convidado movido para a família com sucesso." }
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

export async function getInviteByToken(token: string) {
  if (!token) return null

  const guestLink = await prisma.guestLink.findUnique({
    where: { token },
    include: { guest: true },
  })
  if (guestLink) return { type: "guest" as const, guest: guestLink.guest }

  const familyLink = await prisma.familyLink.findUnique({
    where: { token },
    include: {
      family: {
        include: {
          members: { orderBy: [{ isRepresentante: "desc" }, { createdAt: "asc" }] },
        },
      },
    },
  })
  if (familyLink) return { type: "family" as const, family: familyLink.family }

  return null
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
    data: {
      status: parsed.data.status,
      confirmacao: new Date(),
      conviteStatus: "ENVIADO",
    },
  })
  revalidatePath("/")
  return { ok: true }
}

export async function adminRespondGuestAction(formData: FormData) {
  await requireUser()
  const parsed = adminGuestResponseSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  await prisma.guest.update({
    where: { id: parsed.data.id },
    data: {
      status: parsed.data.status,
      confirmacao: new Date(),
      conviteStatus: "ENVIADO",
    },
  })
  revalidatePath("/admin/convidados")
  return { success: "Presença registrada com sucesso." }
}

export async function respondFamilyAction(token: string, selectedIds: string[]) {
  const parsed = familyResponseSchema.safeParse({
    token,
    selectedIds: JSON.stringify(selectedIds),
  })
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const link = await prisma.familyLink.findUnique({
    where: { token: parsed.data.token },
    include: { family: { include: { members: true } } },
  })
  if (!link) return { error: "Link de família inválido." }

  const memberIds = link.family.members.map((m) => m.id)
  const confirmedSet = new Set(parsed.data.selectedIds)

  await prisma.$transaction([
    prisma.guest.updateMany({
      where: { id: { in: memberIds.filter((id) => confirmedSet.has(id)) } },
      data: { status: "CONFIRMADO", confirmacao: new Date(), conviteStatus: "ENVIADO" },
    }),
    prisma.guest.updateMany({
      where: { id: { in: memberIds.filter((id) => !confirmedSet.has(id)) } },
      data: {
        status: "NAO_CONFIRMADO",
        confirmacao: new Date(),
        conviteStatus: "ENVIADO",
      },
    }),
  ])
  revalidatePath("/")
  return { ok: true }
}
