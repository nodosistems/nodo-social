'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { getCampaigns, type Campaign } from '@/lib/campaigns'

const statusStyle: Record<Campaign['status'], string> = {
  borrador: 'bg-cloud text-muted border border-line',
  programada: 'bg-navy/10 text-navy',
  activa: 'bg-emerald-50 text-emerald-700',
}

function Attr({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-ink">{value || '—'}</div>
    </div>
  )
}

export default function CampanasPage() {
  const [list, setList] = useState<Campaign[] | null>(null)

  useEffect(() => {
    setList(getCampaigns())
  }, [])

  const nuevaBtn = (
    <Link href="/estrategia" className="inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
      <span className="h-4 w-4">{Icon.sparkles}</span> Nueva campaña
    </Link>
  )

  return (
    <>
      <PageHeader title="Campañas" subtitle="Tus campañas activas y programadas, cada una con su público y objetivo." right={list && list.length > 0 ? nuevaBtn : undefined} />

      <div className="flex-1 overflow-auto px-6 py-8 pb-28 md:pb-10">
        <div className="mx-auto max-w-3xl">
          {list === null ? null : list.length === 0 ? (
            <div className="mx-auto max-w-md py-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy/5 text-navy">
                <span className="h-7 w-7">{Icon.flag}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-ink">Aún no tienes campañas</h2>
              <p className="mt-2 text-muted">Una campaña define a quién le hablas y qué quieres conseguir. El asistente te guía para crearla.</p>
              <Link href="/estrategia" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90">
                <span className="h-4 w-4">{Icon.sparkles}</span> Crear tu primera campaña
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((c) => (
                <div key={c.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="h-1.5" style={{ background: c.color }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-ink">{c.name}</h3>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle[c.status]}`}>{c.status}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                      <Attr label="Público" value={c.audience} />
                      <Attr label="Sector" value={c.sector} />
                      <Attr label="Tono" value={c.tone} />
                      <Attr label="CTA final" value={c.cta} />
                    </div>

                    {c.objection ? <div className="mt-3 text-sm text-muted">Derriba: <span className="text-ink">{c.objection}</span></div> : null}

                    {c.formats.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {c.formats.map((f) => (
                          <span key={f} className="rounded-full border border-navy/10 bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy">
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
