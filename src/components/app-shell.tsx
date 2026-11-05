'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Icon } from './icons'
import { supabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/client'

type NavItem = { label: string; href: string; icon: ReactNode; desktopOnly?: boolean }

const nav: NavItem[] = [
  { label: 'Asistente', href: '/asistente', icon: Icon.chat },
  { label: 'Estrategia', href: '/estrategia', icon: Icon.target, desktopOnly: true },
  { label: 'Calendario', href: '/calendario', icon: Icon.calendar },
  { label: 'Publicaciones', href: '/publicaciones', icon: Icon.grid },
  { label: 'Mi marca', href: '/mi-marca', icon: Icon.brand },
  { label: 'Inicio', href: '/inicio', icon: Icon.home },
]

function Wordmark() {
  return (
    <Link href="/asistente" className="flex items-center gap-2.5">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-coral/90">
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        Nodo <span className="text-white/60">Social</span>
      </span>
    </Link>
  )
}

export function AppShell({
  children,
  workspaceName = 'Clínica Nutrir',
  instagramConnected = false,
}: {
  children: ReactNode
  workspaceName?: string
  instagramConnected?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const initials = workspaceName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  async function signOut() {
    if (supabaseConfigured) {
      try {
        await createClient().auth.signOut()
      } catch {
        /* sin configurar: no hay sesión que cerrar */
      }
    }
    router.push('/login')
  }

  return (
    <div className="flex h-full">
      {/* Sidebar (escritorio) */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy p-5 text-white/80 md:flex">
        <Wordmark />
        <nav className="mt-9 flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
                isActive(n.href) ? 'bg-white/10 font-medium text-white' : 'hover:bg-white/5'
              }`}
            >
              <span className={`h-5 w-5 ${isActive(n.href) ? 'text-coral' : ''}`}>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral/80 font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium text-white">{workspaceName}</div>
            <div className="text-[12px] text-white/55">
              {instagramConnected ? 'Instagram conectado ✓' : 'Instagram sin conectar'}
            </div>
          </div>
          <button
            onClick={signOut}
            title="Cerrar sesión"
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
          >
            <span className="h-4 w-4">{Icon.logout}</span>
          </button>
        </div>
      </aside>

      {/* Principal */}
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>

      {/* Navegación inferior (móvil) */}
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-white/10 bg-navy py-2.5 text-white/70 md:hidden">
        {nav.filter((n) => !n.desktopOnly).map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex flex-col items-center gap-0.5 text-[11px] ${isActive(n.href) ? 'text-coral' : ''}`}
          >
            <span className="h-5 w-5">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
