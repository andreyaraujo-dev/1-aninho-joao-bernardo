export type Guest = {
  id: string
  nome: string
  celular: string
  tipo: string
  status: string
  conviteStatus: string
  isRepresentante: boolean
  familyId: string | null
  link: { token: string } | null
}

export type FamilyMember = {
  id: string
  nome: string
  tipo: string
  status: string
  celular?: string
  isRepresentante: boolean
}

export type Family = {
  id: string
  nome: string
  celular: string
  conviteStatus: string
  members: FamilyMember[]
  link: { token: string } | null
}

export type GuestAction = (
  formData: FormData,
) => Promise<{ success?: string; error?: string }>
