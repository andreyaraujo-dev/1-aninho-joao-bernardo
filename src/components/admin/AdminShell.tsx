"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useFormStatus } from "react-dom"
import {
  CalendarDays,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Users,
} from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "cn"

const links = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/convidados", label: "Convidados", icon: Users },
  { href: "/admin/evento", label: "Evento", icon: CalendarDays },
]

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-sidebar-foreground transition-colors",
            pathname === href
              ? "bg-primary font-medium"
              : "hover:bg-sidebar-foreground/10",
          )}
          onClick={onNavigate}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}

function LogoutButton({ className }: { className?: string }) {
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

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode
  userName: string
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground [&_[data-slot=input]]:h-10 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:min-h-10 bg-[radial-gradient(circle_at_100%_0%,rgb(75_155_119_/_18%),transparent_34rem),radial-gradient(circle_at_0%_100%,rgb(218_174_127_/_13%),transparent_28rem)]">
      <aside className="fixed inset-y-0 hidden w-64 border-r border-white/10 bg-sidebar p-6 text-sidebar-foreground md:flex md:flex-col md:gap-8">
        <div>
          <p className="font-serif text-xl font-semibold">João Bernardo</p>
          <p className="text-sm text-sidebar-foreground/65">Área do evento</p>
        </div>
        <Navigation />
        <div className="mt-auto">
          <p className="mb-2 px-3 text-xs text-sidebar-foreground/65">{userName}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className="md:pl-64">
        <header className="flex h-16 items-center border-b bg-sidebar px-4 text-sidebar-foreground shadow-sm md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10"
                  aria-label="Abrir menu"
                >
                  <Menu />
                </Button>
              }
            ></SheetTrigger>
            <SheetContent
              side="left"
              className="w-[min(20rem,calc(100vw-1rem))] border-sidebar-foreground/10 bg-sidebar p-0 text-sidebar-foreground [&>button]:text-sidebar-foreground [&>button]:hover:bg-sidebar-foreground/10"
            >
              <div className="flex h-full flex-col">
                <div className="border-b border-sidebar-foreground/10 px-6 py-5">
                  <SheetTitle className="text-lg text-sidebar-foreground">
                    Menu do evento
                  </SheetTitle>
                  <p className="mt-1 text-sm text-sidebar-foreground/65">
                    Área do evento
                  </p>
                </div>
                <div className="flex-1 px-4 py-6">
                  <Navigation onNavigate={() => setMobileMenuOpen(false)} />
                </div>
                <div className="border-t border-sidebar-foreground/10 px-4 py-4">
                  <p className="mb-2 px-3 text-xs text-sidebar-foreground/65">
                    {userName}
                  </p>
                  <LogoutButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <span className="ml-3 font-semibold">Área do evento</span>
        </header>
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col p-4 md:min-h-screen md:p-8">
          <div className="flex-1">{children}</div>
          <footer className="mt-10 border-t border-border/70 pt-4 text-center text-xs text-muted-foreground">
            Desenvolvido por Andrey Araújo
          </footer>
        </main>
      </div>
    </div>
  )
}
