'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { supabaseConfigured } from '@/lib/supabase/config'

type Form = {
  business_name: string
  sector: string
  audience: string
  tone: string
  talk_about: string
  avoid: string
  primary_color: string
  accent_color: string
}

const tonos = ['Cercano', 'Profesional', 'Cálido', 'Divulgativo', 'Inspirador']

const field =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:border-navy/30 focus:ring-2 focus:ring-navy/10'

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      {hint ? <p className="mt-0.5 text-sm text-muted">{hint}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-ink">{children}</label>
}

export default function MiMarcaPage() {
  const [form, setForm] = useState<Form>({
    business_name: '',
    sector: '',
    audience: '',
    tone: '',
    talk_about: '',
    avoid: '',
    primary_color: '#12264A',
    accent_color: '#E2603F',
  })
  const [saved, setSaved] = useState(false)

  const update =
    (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }))
      setSaved(false)
    }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: al conectar Supabase, upsert en brand_profiles del workspace activo.
    setSaved(true)
  }

  return (
    <>
      <PageHeader title="Mi marca" subtitle="Tu negocio, tu tono y tus normas. El asistente lo usa en todo lo que crea." />

      <form onSubmit={onSubmit} className="flex-1 overflow-auto px-6 py-8 pb-28 md:pb-10">
        <div className="mx-auto max-w-2xl space-y-5">
          <Card title="Tu negocio">
            <div>
              <Label>Nombre del negocio</Label>
              <input className={field} value={form.business_name} onChange={update('business_name')} placeholder="Clínica Nutrir" />
            </div>
            <div>
              <Label>Sector</Label>
              <input className={field} value={form.sector} onChange={update('sector')} placeholder="Clínica de nutrición y endocrino" />
            </div>
            <div>
              <Label>¿A quién te diriges?</Label>
              <input className={field} value={form.audience} onChange={update('audience')} placeholder="Personas que quieren cuidarse y retomar hábitos sanos" />
            </div>
          </Card>

          <Card title="Tu voz" hint="¿Cómo quieres sonar? Elige un tono o escribe el tuyo.">
            <div className="flex flex-wrap gap-2">
              {tonos.map((t) => {
                const activo = form.tone === t
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => {
                      setForm((f) => ({ ...f, tone: t }))
                      setSaved(false)
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      activo ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink/80 hover:bg-cloud'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
            <input className={field} value={form.tone} onChange={update('tone')} placeholder="O descríbelo con tus palabras" />
          </Card>

          <Card title="Normas" hint="Esto es publicidad sanitaria: hablamos de gestión y hábitos, nunca de tratamientos ni resultados.">
            <div>
              <Label>De qué sí hablar</Label>
              <textarea className={field} rows={3} value={form.talk_about} onChange={update('talk_about')} placeholder="Hábitos, organización, cómo ayuda la clínica, día a día, dudas frecuentes…" />
            </div>
            <div>
              <Label>De qué no hablar</Label>
              <textarea className={field} rows={3} value={form.avoid} onChange={update('avoid')} placeholder="Promesas de resultados, cifras de peso, diagnósticos, nombres de fármacos…" />
            </div>
          </Card>

          <Card title="Colores" hint="Los usamos en las piezas que creamos para ti.">
            <div className="flex gap-6">
              <div>
                <Label>Principal</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.primary_color} onChange={update('primary_color')} className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-white" />
                  <span className="text-sm text-muted">{form.primary_color}</span>
                </div>
              </div>
              <div>
                <Label>Acento</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.accent_color} onChange={update('accent_color')} className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-white" />
                  <span className="text-sm text-muted">{form.accent_color}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-3 pt-1">
            <button type="submit" className="rounded-xl bg-coral px-5 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90">
              Guardar cambios
            </button>
            {saved ? (
              <span className="text-sm text-emerald-600">
                {supabaseConfigured ? 'Guardado ✓' : 'Listo ✓ — se guardará al conectar Supabase'}
              </span>
            ) : !supabaseConfigured ? (
              <span className="text-sm text-muted">Vista previa — el guardado se activa al conectar Supabase.</span>
            ) : null}
          </div>
        </div>
      </form>
    </>
  )
}
