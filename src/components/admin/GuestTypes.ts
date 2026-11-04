export type Guest = {
  id: string
  nome: string
  celular: string
  status: string
  conviteStatus: string
  link: { token: string } | null
}

export type GuestAction = (
  formData: FormData,
) => Promise<{ success?: string; error?: string }>
