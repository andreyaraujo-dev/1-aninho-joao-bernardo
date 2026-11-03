import { z } from "zod"

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} é obrigatório.`)

const brazilianAreaCodes = new Set([
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "21",
  "22",
  "24",
  "27",
  "28",
  "31",
  "32",
  "33",
  "34",
  "35",
  "37",
  "38",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "51",
  "53",
  "54",
  "55",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "71",
  "73",
  "74",
  "75",
  "77",
  "79",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
])

export const loginSchema = z.object({
  login: requiredText("Usuário"),
  senha: z.string().min(1, "Senha é obrigatória."),
})

export const guestSchema = z.object({
  nome: requiredText("Nome").max(120, "Nome deve ter no máximo 120 caracteres."),
  celular: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine(
      (value) =>
        value === "" ||
        (/^[1-9]\d9\d{8}$/.test(value) && brazilianAreaCodes.has(value.slice(0, 2))),
      {
        message: "Informe um celular brasileiro válido com DDD quando preenchido.",
      },
    ),
})

export const guestIdSchema = z.object({
  id: requiredText("Convidado"),
})

export const eventSchema = z.object({
  dataEvento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number)
      const date = new Date(Date.UTC(year, month - 1, day))
      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      )
    }, "Informe uma data válida."),
  mensagem: requiredText("Mensagem").max(
    2000,
    "Mensagem deve ter no máximo 2000 caracteres.",
  ),
})

export const guestResponseSchema = z.object({
  token: requiredText("Link do convidado"),
  status: z.enum(["CONFIRMADO", "NAO_CONFIRMADO"]),
})

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries())
}

export function firstValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Confira os dados informados."
}

export function formatBrazilianMobile(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}
