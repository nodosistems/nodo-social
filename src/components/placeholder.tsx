import type { ReactNode } from 'react'

// Shell de pantalla "en construcción" con el propósito de cada sección.
export function Placeholder({ icon, title, lines }: { icon: ReactNode; title: string; lines: string[] }) {
  return (
    <div className="flex flex-1 items-center justify-center overflow-auto px-6 py-10 pb-24 md:pb-10">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy/5 text-navy">
          <span className="h-7 w-7">{icon}</span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink">{title}</h2>
        {lines.map((l, i) => (
          <p key={i} className="mt-2 text-muted">
            {l}
          </p>
        ))}
        <span className="mt-5 inline-block rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
          En construcción
        </span>
      </div>
    </div>
  )
}
