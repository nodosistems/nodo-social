import type { ReactNode } from 'react'
import { AppShell } from '@/components/app-shell'

// Layout de la app (zona con sesión): envuelve cada pantalla con el shell (sidebar + nav).
// Más adelante, el workspace activo y el estado de Instagram vendrán de Supabase.
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
