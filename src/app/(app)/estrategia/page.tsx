'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { addCampaign, getCampaigns, pickColor, type Campaign } from '@/lib/campaigns'

type Draft = Omit<Campaign, 'id' | 'color' | 'status' | 'createdAt'>

const tonos = ['Cercano', 'Profesional', 'Cálido', 'Divulgativo', 'Inspirador']
const publicos = [
  { label: 'Lead frío', desc: 'Aún no te conoce' },
  { label: 'Lead tibio', desc: 'Ya te sigue o ha mostrado interés' },
  { label: 'Cliente', desc: 'Ya ha venido a tu clínica' },
]
const objeciones = ['No tengo tiempo', 'Es caro', 'Ya lo probé y no funcionó', 'Me da pereza empezar']
const urgencias = ['Empieza enero, momento de propósitos', 'Plazas limitadas este mes', 'Temporada u oferta puntual']
const formatos = ['Reel', 'Story', 'Carrusel', 'Vídeo']
const medios = ['Lo generamos nosotros', 'Uso mis fotos', 'Mi música']
const ctas = ['Reservar cita', 'Abrir la calculadora', 'Rellenar el formulario', 'Visitar la web']

const meta = [
  { q: '¿Para qué campaña?', help: 'Un nombre y el sector al que va dirigida.' },
  { q: '¿Qué tono usamos?', help: 'Cómo suena tu marca en esta campaña.' },
  { q: '¿Quién va a ver esto?', help: 'A quién le hablamos marca el mensaje.' },
  { q: '¿Qué objeción derribamos?', help: 'El freno que le impide dar el paso.' },
  { q: '¿Por qué ahora?', help: 'La razón para actuar hoy, no "algún día".' },
  { q: '¿Qué formato?', help: 'Elige uno o varios tipos de contenido.' },
  { q: '¿Qué medios usamos?', help: 'Lo creamos nosotros o usas lo tuyo.' },
  { q: '¿Qué quieres que haga al final?', help: 'La llamada a la acción.' },
]
const TOTAL = meta.length

const field =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:border-navy/30 focus:ring-2 focus:ring-navy/10'

function Single({ value, onPick, options }: { value: string; onPick: (v: string) => void; options: { label: string; desc?: string }[] }) {
  return (
    <div className="grid gap-2.5">
      {options.map((o) => {
        const activo = value === o.label
        return (
          <button
            key={o.label}
            type="button"
            onClick={() => onPick(o.label)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              activo ? 'border-navy bg-navy/5' : 'border-line bg-white hover:bg-cloud'
            }`}
          >
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${activo ? 'border-coral bg-coral' : 'border-line'}`}>
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
  )
}

function Multi({ values, onToggle, options }: { values: string[]; onToggle: (v: string) => void; options: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {options.map((o) => {
        const activo = values.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-colors ${
              activo ? 'border-navy bg-navy/5' : 'border-line bg-white hover:bg-cloud'
            }`}
          >
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${activo ? 'border-coral bg-coral text-white' : 'border-line'}`}>
              {activo ? '✓' : null}
            </span>
            <span className="text-[15px] font-medium text-ink">{o}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function EstrategiaPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [aiNote, setAiNote] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const photoRef = useRef<HTMLInputElement>(null)
  const [c, setC] = useState<Draft>({
    name: '',
    sector: '',
    tone: '',
    audience: '',
    objection: '',
    urgency: '',
    formats: [],
    media: [],
    cta: '',
  })

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setC((prev) => ({ ...prev, [k]: v }))
  const toggle = (k: 'formats' | 'media', v: string) =>
    setC((prev) => ({ ...prev, [k]: prev[k].includes(v) ? prev[k].filter((x) => x !== v) : [...prev[k], v] }))

  const isSummary = step === TOTAL
  const progress = isSummary ? 100 : Math.round((step / TOTAL) * 100)

  const canNext = [
    c.name.trim() !== '' && c.sector.trim() !== '',
    c.tone !== '',
    c.audience !== '',
    c.objection !== '',
    c.urgency !== '',
    c.formats.length > 0,
    c.media.length > 0,
    c.cta !== '',
  ][step]

  function onPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setPhotos((p) => [...p, ...files.map((f) => URL.createObjectURL(f))])
  }

  function onCreate() {
    const color = pickColor(getCampaigns().length)
    const campaign: Campaign = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      ...c,
      color,
      status: 'borrador',
      createdAt: Date.now(),
    }
    addCampaign(campaign)
    router.push('/campanas')
  }

  const summaryRows: { q: string; v: string }[] = [
    { q: 'Campaña', v: c.name || '—' },
    { q: 'Sector', v: c.sector || '—' },
    { q: 'Tono', v: c.tone || '—' },
    { q: 'Público', v: c.audience || '—' },
    { q: 'Objeción', v: c.objection || '—' },
    { q: 'Urgencia', v: c.urgency || '—' },
    { q: 'Formatos', v: c.formats.join(', ') || '—' },
    { q: 'Medios', v: c.media.join(', ') || '—' },
    { q: 'CTA final', v: c.cta || '—' },
  ]

  return (
    <>
      <PageHeader title="Estrategia" subtitle="El asistente te guía con preguntas y arma tu campaña." />

      <div className="flex-1 overflow-auto px-6 py-8 pb-28 md:pb-10">
        <div className="mx-auto max-w-xl">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm text-muted">
              <span>{isSummary ? 'Resumen de la campaña' : `Paso ${step + 1} de ${TOTAL}`}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {!isSummary ? (
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">{meta[step].q}</h2>
              <p className="mt-1 text-muted">{meta[step].help}</p>

              <div className="mt-5">
                {step === 0 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-ink">Nombre de la campaña</label>
                      <input className={field} value={c.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: Propósitos de enero" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-ink">Sector al que va dirigida</label>
                      <input className={field} value={c.sector} onChange={(e) => set('sector', e.target.value)} placeholder="Ej: Clínicas de nutrición" />
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <>
                    <Single value={c.tone} onPick={(v) => set('tone', v)} options={tonos.map((t) => ({ label: t }))} />
                    <input className={`${field} mt-3`} value={c.tone} onChange={(e) => set('tone', e.target.value)} placeholder="O descríbelo tú" />
                  </>
                ) : null}

                {step === 2 ? <Single value={c.audience} onPick={(v) => set('audience', v)} options={publicos} /> : null}

                {step === 3 ? (
                  <>
                    <Single value={c.objection} onPick={(v) => set('objection', v)} options={objeciones.map((t) => ({ label: t }))} />
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setAiNote(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-navy hover:bg-cloud"
                      >
                        <span className="h-4 w-4 text-coral">{Icon.sparkles}</span> Sugerir con IA
                      </button>
                      {aiNote ? (
                        <p className="mt-2 text-sm text-muted">Se activa al conectar el cerebro (Claude) en la Fase 2: propondrá la objeción según tu marca y tu público.</p>
                      ) : null}
                    </div>
                    <input className={`${field} mt-3`} value={c.objection} onChange={(e) => set('objection', e.target.value)} placeholder="O escribe otra" />
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    <Single value={c.urgency} onPick={(v) => set('urgency', v)} options={urgencias.map((t) => ({ label: t }))} />
                    <input className={`${field} mt-3`} value={c.urgency} onChange={(e) => set('urgency', e.target.value)} placeholder="O escribe tu urgencia" />
                  </>
                ) : null}

                {step === 5 ? <Multi values={c.formats} onToggle={(v) => toggle('formats', v)} options={formatos} /> : null}

                {step === 6 ? (
                  <>
                    <Multi values={c.media} onToggle={(v) => toggle('media', v)} options={medios} />
                    {c.media.includes('Uso mis fotos') ? (
                      <div className="mt-4 rounded-xl border border-line bg-white p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-ink">Tus fotos</span>
                          <button type="button" onClick={() => photoRef.current?.click()} className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-cloud">
                            Subir fotos
                          </button>
                          <input ref={photoRef} type="file" accept="image/*" multiple onChange={onPhotos} className="hidden" />
                        </div>
                        {photos.length > 0 ? (
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {photos.map((src, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={i} src={src} alt={`Foto ${i + 1}`} className="aspect-square w-full rounded-lg border border-line object-cover" />
                            ))}
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-muted">Selecciona o arrastra tus imágenes. Se guardarán al conectar el almacenamiento.</p>
                        )}
                      </div>
                    ) : null}
                  </>
                ) : null}

                {step === 7 ? <Single value={c.cta} onPick={(v) => set('cta', v)} options={ctas.map((t) => ({ label: t }))} /> : null}
              </div>

              <div className="mt-7 flex items-center justify-between">
                <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:text-ink disabled:opacity-40">
                  Atrás
                </button>
                <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="rounded-xl bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                  {step === TOTAL - 1 ? 'Ver resumen' : 'Siguiente'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Tu campaña</h2>
              <p className="mt-1 text-muted">Esto es lo que el asistente usará para crear tus publicaciones.</p>

              <div className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                {summaryRows.map((r, i) => (
                  <div key={r.q} className="flex items-start justify-between gap-4 px-4 py-3.5">
                    <div>
                      <div className="text-sm text-muted">{r.q}</div>
                      <div className="mt-0.5 text-[15px] font-medium text-ink">{r.v}</div>
                    </div>
                    <button type="button" onClick={() => setStep(Math.min(i, TOTAL - 1))} className="shrink-0 text-sm font-medium text-navy hover:underline">
                      Editar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <span className="h-4 w-4">{Icon.sparkles}</span> Crear campaña
                </button>
                <span className="text-sm text-muted">La guardamos como borrador y la verás en Campañas.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
