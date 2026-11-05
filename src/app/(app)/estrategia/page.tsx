'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'

type Option = { label: string; desc?: string }
type Step = {
  key: string
  q: string
  help?: string
  options: Option[]
  customPlaceholder?: string
  ai?: boolean
}

const steps: Step[] = [
  {
    key: 'tono',
    q: '¿Qué tono usamos?',
    help: 'Cómo suena tu marca en este plan.',
    options: [{ label: 'Cercano' }, { label: 'Profesional' }, { label: 'Cálido' }, { label: 'Divulgativo' }, { label: 'Inspirador' }],
    customPlaceholder: 'O descríbelo tú',
  },
  {
    key: 'publico',
    q: '¿Quién va a ver esto?',
    help: 'A quién le hablamos marca el mensaje.',
    options: [
      { label: 'Lead frío', desc: 'Aún no te conoce' },
      { label: 'Lead tibio', desc: 'Ya te sigue o ha mostrado interés' },
      { label: 'Cliente', desc: 'Ya ha venido a tu clínica' },
    ],
  },
  {
    key: 'objecion',
    q: '¿Qué objeción derribamos?',
    help: 'El freno que le impide dar el paso.',
    options: [{ label: 'No tengo tiempo' }, { label: 'Es caro' }, { label: 'Ya lo probé y no funcionó' }, { label: 'Me da pereza empezar' }],
    customPlaceholder: 'O escribe otra',
    ai: true,
  },
  {
    key: 'urgencia',
    q: '¿Por qué ahora?',
    help: 'La razón para actuar hoy, no "algún día".',
    options: [{ label: 'Empieza enero, momento de propósitos' }, { label: 'Plazas limitadas este mes' }, { label: 'Temporada u oferta puntual' }],
    customPlaceholder: 'O escribe tu urgencia',
  },
  {
    key: 'cta',
    q: '¿Qué quieres que haga al final?',
    help: 'La acción concreta: tu llamada a la acción.',
    options: [{ label: 'Reservar cita' }, { label: 'Abrir la calculadora' }, { label: 'Rellenar el formulario' }, { label: 'Visitar la web' }],
  },
]

const field =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:border-navy/30 focus:ring-2 focus:ring-navy/10'

export default function EstrategiaPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [aiNote, setAiNote] = useState(false)
  const [saved, setSaved] = useState(false)

  const total = steps.length
  const isSummary = step === total
  const current = steps[step]

  const set = (key: string, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }))
    setSaved(false)
  }

  const progress = isSummary ? 100 : Math.round((step / total) * 100)

  return (
    <>
      <PageHeader title="Estrategia" subtitle="El asistente te guía con preguntas. Así sabe exactamente qué crear." />

      <div className="flex-1 overflow-auto px-6 py-8 pb-28 md:pb-10">
        <div className="mx-auto max-w-xl">
          {/* Progreso */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm text-muted">
              <span>{isSummary ? 'Resumen' : `Paso ${step + 1} de ${total}`}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {!isSummary ? (
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">{current.q}</h2>
              {current.help ? <p className="mt-1 text-muted">{current.help}</p> : null}

              <div className="mt-5 grid gap-2.5">
                {current.options.map((o) => {
                  const activo = answers[current.key] === o.label
                  return (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => set(current.key, o.label)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        activo ? 'border-navy bg-navy/5' : 'border-line bg-white hover:bg-cloud'
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                          activo ? 'border-coral bg-coral text-white' : 'border-line'
                        }`}
                      >
                        {activo ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium text-ink">{o.label}</span>
                        {o.desc ? <span className="block text-sm text-muted">{o.desc}</span> : null}
                      </span>
                    </button>
                  )
                })}
              </div>

              {current.ai ? (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setAiNote(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-navy hover:bg-cloud"
                  >
                    <span className="h-4 w-4 text-coral">{Icon.sparkles}</span> Sugerir con IA
                  </button>
                  {aiNote ? (
                    <p className="mt-2 text-sm text-muted">Se activa al conectar el cerebro (Claude) en la Fase 2. Propondrá la objeción según tu marca y tu público.</p>
                  ) : null}
                </div>
              ) : null}

              {current.customPlaceholder ? (
                <input
                  className={`${field} mt-3`}
                  value={answers[current.key] ?? ''}
                  onChange={(e) => set(current.key, e.target.value)}
                  placeholder={current.customPlaceholder}
                />
              ) : null}

              {/* Navegación */}
              <div className="mt-7 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:text-ink disabled:opacity-40"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!answers[current.key]}
                  className="rounded-xl bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {step === total - 1 ? 'Ver resumen' : 'Siguiente'}
                </button>
              </div>
            </div>
          ) : (
            /* Resumen */
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Tu estrategia</h2>
              <p className="mt-1 text-muted">Esto es lo que el asistente usará para crear tus publicaciones.</p>

              <div className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                {steps.map((s, i) => (
                  <div key={s.key} className="flex items-start justify-between gap-4 px-4 py-3.5">
                    <div>
                      <div className="text-sm text-muted">{s.q}</div>
                      <div className="mt-0.5 text-[15px] font-medium text-ink">{answers[s.key] || '—'}</div>
                    </div>
                    <button type="button" onClick={() => setStep(i)} className="shrink-0 text-sm font-medium text-navy hover:underline">
                      Editar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSaved(true)}
                  className="rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-ink hover:bg-cloud"
                >
                  Guardar estrategia
                </button>
                <Link
                  href="/asistente"
                  className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <span className="h-4 w-4">{Icon.sparkles}</span> Crear con esta estrategia
                </Link>
                {saved ? <span className="text-sm text-emerald-600">Guardada ✓ — se sincroniza al conectar el guardado.</span> : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
