"use server"

import { revalidatePath } from "next/cache"
import { getEvent } from "@/lib/event"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/app/actions/auth"
import { eventSchema, firstValidationError, formDataToObject } from "@/lib/validation"

export async function updateEventAction(formData: FormData) {
  await requireUser()
  const event = await getEvent()
  const parsed = eventSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) return { error: firstValidationError(parsed.error) }
  const dataEvento = new Date(`${parsed.data.dataEvento}T23:59:59-03:00`)

  await prisma.event.update({
    where: { id: event.id },
    data: { dataEvento, mensagem: parsed.data.mensagem },
  })
  revalidatePath("/admin/evento")
  revalidatePath("/")
  return { success: "Dados do evento atualizados com sucesso." }
}
