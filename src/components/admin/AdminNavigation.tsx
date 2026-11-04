"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, LayoutDashboard, Users } from "lucide-react"
import { cn } from "cn"

const links = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/convidados", label: "Convidados", icon: Users },
  { href: "/admin/evento", label: "Evento", icon: CalendarDays },
]

export function AdminNavigation({ onNavigate }: { onNavigate?: () => void }) {
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
