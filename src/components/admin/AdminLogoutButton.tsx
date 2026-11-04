"use client"

import { useFormStatus } from "react-dom"
import { Loader2, LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export function AdminLogoutButton({ className }: { className?: string }) {
  const { pending } = useFormStatus()

  return (
    <form action={logoutAction} className={className}>
      <Button
        type="submit"
        variant="ghost"
        className="h-10 w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <LogOut data-icon="inline-start" />
        )}
        {pending ? "Saindo..." : "Sair"}
      </Button>
    </form>
  )
}
