import type { ReactNode } from 'react'

// Cabecera común de cada pantalla.
export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  return (
    <header className="flex items-center justify-between border-b border-line bg-white/70 px-6 py-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
        {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  )
}
