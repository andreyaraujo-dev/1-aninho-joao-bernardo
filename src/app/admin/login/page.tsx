"use client"

import { useActionState, useState } from "react"
import { Loader2 } from "lucide-react"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type LoginState = { error?: string }

export default function LoginPage() {
  const [login, setLogin] = useState("")
  const [senha, setSenha] = useState("")
  const [state, action, pending] = useActionState<LoginState, FormData>(
    async (_previous, formData) => (await loginAction(formData)) ?? {},
    {},
  )

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-4 [&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Área do evento</CardTitle>
          <CardDescription>Entre para gerenciar os convidados.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-5">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="login">Usuário</FieldLabel>
                <Input
                  id="login"
                  name="login"
                  className="h-10"
                  required
                  autoComplete="username"
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="senha">Senha</FieldLabel>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  className="h-10"
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                />
              </Field>
            </FieldGroup>
            {state.error ? (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            ) : null}
            <Button type="submit" disabled={pending} className="h-10">
              {pending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : null}
              {pending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
