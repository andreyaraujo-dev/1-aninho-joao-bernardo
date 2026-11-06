"use server"

import { randomBytes } from "node:crypto"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/app/actions/auth"
import {
  adminFamilyResponseSchema,
  familyIdSchema,
  familySchema,
  familyUpdateSchema,
  firstValidationError,
  formDataToObject,
} from "@/lib/validation"

export async function createFamilyAction(formData: FormData) {
  await requireUser()
  const parsed = familySchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const { nome, members } = parsed.data
  const representanteCelular = members[0]?.celular ?? ""
  const celular = parsed.data.celular || representanteCelular

  await prisma.family.create({
    data: {
      nome,
      celular,
      link: { create: { token: randomBytes(18).toString("base64url") } },
      members: {
        create: members.map((m, i) => ({
          nome: m.nome,
          tipo: m.tipo,
          celular: i === 0 ? representanteCelular : "",
          isRepresentante: i === 0,
        })),
      },
    },
  })
  revalidatePath("/admin/convidados")
  return { success: "Família cadastrada com sucesso." }
}

export async function updateFamilyAction(formData: FormData) {
  await requireUser()
  const parsed = familyUpdateSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const { id, members } = parsed.data
  const representanteCelular = members[0]?.celular ?? ""
  const nome = parsed.data.nome
  const celular = parsed.data.celular || representanteCelular

  const family = await prisma.family.findUnique({
    where: { id },
    include: { members: true },
  })
  if (!family) return { error: "Família não encontrada." }

  const existingIds = new Set(family.members.map((m) => m.id))
  const incomingIds = new Set(members.filter((m) => m.id).map((m) => m.id!))
  const toDelete = [...existingIds].filter((eid) => !incomingIds.has(eid))

  await prisma.$transaction(async (tx) => {
    await tx.family.update({ where: { id }, data: { nome, celular } })

    if (toDelete.length > 0) {
      await tx.guestLink.deleteMany({ where: { guestId: { in: toDelete } } })
      await tx.guest.deleteMany({ where: { id: { in: toDelete } } })
    }

    for (let i = 0; i < members.length; i++) {
      const m = members[i]
      const isRepresentante = i === 0

      const memberCelular = isRepresentante ? representanteCelular : ""
      if (m.id && existingIds.has(m.id)) {
        await tx.guest.update({
          where: { id: m.id },
          data: { nome: m.nome, tipo: m.tipo, isRepresentante, celular: memberCelular },
        })
      } else {
        await tx.guest.create({
          data: {
            nome: m.nome,
            tipo: m.tipo,
            celular: memberCelular,
            isRepresentante,
            familyId: id,
          },
        })
      }
    }
  })

  revalidatePath("/admin/convidados")
  return { success: "Família atualizada com sucesso." }
}

export async function deleteFamilyAction(formData: FormData) {
  await requireUser()
  const parsed = familyIdSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const { id } = parsed.data
  const family = await prisma.family.findUnique({
    where: { id },
    include: { members: { select: { id: true } } },
  })
  if (!family) return { error: "Família não encontrada." }

  const memberIds = family.members.map((m) => m.id)

  await prisma.$transaction([
    prisma.familyLink.deleteMany({ where: { familyId: id } }),
    prisma.guestLink.deleteMany({ where: { guestId: { in: memberIds } } }),
    prisma.guest.deleteMany({ where: { id: { in: memberIds } } }),
    prisma.family.delete({ where: { id } }),
  ])

  revalidatePath("/admin/convidados")
  return { success: "Família excluída com sucesso." }
}

export async function adminRespondFamilyAction(formData: FormData) {
  await requireUser()
  const parsed = adminFamilyResponseSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const family = await prisma.family.findUnique({
    where: { id: parsed.data.id },
    include: { members: { select: { id: true } } },
  })
  if (!family) return { error: "Família não encontrada." }

  const memberIds = family.members.map((m) => m.id)
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
    prisma.family.update({
      where: { id: parsed.data.id },
      data: { conviteStatus: "ENVIADO" },
    }),
  ])
  revalidatePath("/admin/convidados")
  return { success: "Presença registrada com sucesso." }
}

export async function markFamilyInviteSentAction(formData: FormData) {
  await requireUser()
  const parsed = familyIdSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }

  const family = await prisma.family.findUnique({
    where: { id: parsed.data.id },
    select: { celular: true },
  })
  if (!family) return { error: "Família não encontrada." }
  if (!family.celular) {
    return { error: "Cadastre um celular antes de enviar o convite." }
  }

  await prisma.family.update({
    where: { id: parsed.data.id },
    data: { conviteStatus: "ENVIADO" },
  })
  revalidatePath("/admin/convidados")
  return { success: "Convite marcado como enviado." }
}
