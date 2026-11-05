'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { addCampaign, getCampaigns, pickColor, type Campaign } from '@/lib/campaigns'

// Informe de ejemplo. Con la cuenta de Instagram conectada (Business Discovery)
// + Claude, estos datos serán reales y específicos del competidor.
const demo = {
  formats: [
    { label: 'Reels', pct: 55 },
    { label: 'Carruseles', pct: 30 },
    { label: 'Imagen simple', pct: 15 },
  ],
  frequency: '~5 publicaciones por semana',
  hooks: [
    '"El error que casi todos cometen al empezar…"',
    '"3 señales de que necesitas un cambio"',
    '"Antes de decidir, mira esto"',
  ],
  ctas: ['Reserva tu valoración gratis', 'Escríbenos "INFO" por DM', 'Link en bio'],
  top: [
    { type: 'Reel', note: 'Caso real paso a paso', eng: 'el de más alcance' },
    { type: 'Carrusel', note: 'Mitos y verdades del sector', eng: 'el más guardado' },
    { type: 'Reel', note: 'Un día en la clínica', eng: 'el más comentado' },
  ],
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-ink">{label}</span>
        <span className="text-muted">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-navy" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export default function CompetenciaPage() {
  const router = useRouter()
  const [handle, setHandle] = useState('')
  const [analyzed, setAnalyzed] = useState<string | null>(null)

  function analizar(e: React.FormEvent) {
    e.preventDefault()
    const h = handle.trim().replace(/^@/, '')
    if (!h) return
    setAnalyzed(h)
  }

  function replicar() {
    const color = pickColor(getCampaigns().length)
    const campaign: Campaign = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: `Inspirada en @${analyzed}`,
      sector: '',
      tone: 'Cercano',
      audience: 'Lead frío',
      objection: '',
      urgency: '',
      formats: ['Reel', 'Carrusel'],
      media: ['Lo generamos nosotros'],
      duration: '2 semanas',
      cadence: '3 por semana',
      cta: 'Reservar cita',
      color,
      status: 'borrador',
      createdAt: Date.now(),
    }
    addCampaign(campaign)
    router.push('/campanas')
  }

  return (
    <>
      <PageHeader title="Competencia" subtitle="Analiza a quien lo está haciendo bien y replica lo que funciona." />

      <div className="flex-1 overflow-auto px-6 py-8 pb-28 md:pb-10">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={analizar} className="flex items-center gap-2 rounded-2xl border border-line bg-white p-2 shadow-sm">
            <span className="pl-3 text-muted">@</span>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="cuenta_de_instagram_del_competidor"
              className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[15px] outline-none placeholder:text-muted/60"
            />
            <button type="submit" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-coral px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <span className="h-4 w-4">{Icon.search}</span> Analizar
            </button>
          </form>
          <p className="mt-2 text-sm text-muted">También podrás buscar por sector (p. ej. "clínica estética") y elegir las cuentas con mejores reseñas.</p>

          {analyzed ? (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Análisis de <span className="text-coral">@{analyzed}</span>
                </h2>
                <span className="rounded-full border border-line bg-cloud px-2.5 py-1 text-xs font-medium text-muted">Ejemplo</span>
              </div>

              <Card title="Formatos que usa">
                <div className="space-y-3">
                  {demo.formats.map((f) => (
                    <Bar key={f.label} label={f.label} pct={f.pct} />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted">Lo que mejor funciona: carruseles y reels. La imagen simple rinde peor.</p>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card title="Frecuencia">
                  <p className="text-[15px] text-ink">{demo.frequency}</p>
                </Card>
                <Card title="Llamadas a la acción">
                  <div className="flex flex-wrap gap-1.5">
                    {demo.ctas.map((c) => (
                      <span key={c} className="rounded-full border border-navy/10 bg-navy/5 px-2.5 py-1 text-xs font-medium text-navy">
                        {c}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              <Card title="Ganchos de los primeros segundos">
                <ul className="space-y-2">
                  {demo.hooks.map((h) => (
                    <li key={h} className="text-[15px] text-ink">{h}</li>
                  ))}
                </ul>
              </Card>

              <Card title="Publicaciones con más interacción">
                <ul className="divide-y divide-line">
                  {demo.top.map((t, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="text-[15px] text-ink">
                        <span className="font-medium">{t.type}</span> · {t.note}
                      </span>
                      <span className="shrink-0 text-sm text-muted">{t.eng}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="rounded-2xl border border-coral/20 bg-coral/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">¿Te gusta lo que hace?</h3>
                    <p className="mt-0.5 text-sm text-muted">Creamos una campaña con lo que mejor le funciona, adaptada a tu marca.</p>
                  </div>
                  <button onClick={replicar} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-coral px-5 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90">
                    <span className="h-4 w-4">{Icon.sparkles}</span> Replicar estrategia
                  </button>
                </div>
              </div>

              <p className="text-sm text-muted">
                Es un ejemplo. Con tu Instagram conectado, Nodo trae las publicaciones reales del competidor (API oficial de Instagram) y Claude hace el análisis de verdad.
              </p>
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-line bg-white/50 p-8 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy/5 text-navy">
                <span className="h-7 w-7">{Icon.search}</span>
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-ink">Analiza a tu competencia</h2>
              <p className="mx-auto mt-2 max-w-md text-muted">
                Pon el @ de una cuenta que lo esté haciendo bien. Nodo mira sus formatos, ganchos, frecuencia y CTAs, y te deja replicar lo que funciona en una campaña tuya.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
