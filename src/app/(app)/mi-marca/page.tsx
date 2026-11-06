'use client'

import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { supabaseConfigured } from '@/lib/supabase/config'
import { getBrand, saveBrand, emptyBrand, type BrandProfile } from '@/lib/brand'

type Form = BrandProfile

const tonos = ['Cercano', 'Profesional', 'Cálido', 'Divulgativo', 'Inspirador']
const fuentes = ['Sora', 'DM Sans', 'Poppins', 'Montserrat', 'Lora', 'Inter']

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
  const [form, setForm] = useState<Form>(emptyBrand)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Carga lo guardado (tras montar, para leer localStorage sin desajustar la hidratación).
  useEffect(() => {
    setForm(getBrand())
  }, [])

  const update =
    (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }))
      setSaved(false)
    }

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setLogoPreview(URL.createObjectURL(file))
      setSaved(false)
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Guarda en el navegador y lo usa el Asistente y el nombre de arriba.
    // TODO: al conectar Supabase → upsert en brand_profiles del workspace activo
    // y subir el logo a Supabase Storage (brand_assets). Columnas extra: logo_url,
    // typography, link_web, link_calculator, link_form (migración 0002).
    saveBrand(form)
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

          <Card title="Logo" hint="Lo colocamos en las publicaciones que creamos para ti.">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-cloud">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-[11px] text-muted">Sin logo</span>
                )}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={onLogo} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-cloud"
                >
                  {logoPreview ? 'Cambiar logo' : 'Subir logo'}
                </button>
                <p className="mt-1.5 text-xs text-muted">PNG, JPG o SVG. Mejor con fondo transparente.</p>
              </div>
            </div>
          </Card>

          <Card title="Tipografía" hint="La fuente de tus piezas. Elige una o escribe la tuya.">
            <div className="flex flex-wrap gap-2">
              {fuentes.map((f) => {
                const activo = form.typography === f
                return (
                  <button
                    type="button"
                    key={f}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, typography: f }))
                      setSaved(false)
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      activo ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink/80 hover:bg-cloud'
                    }`}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
            <input className={field} value={form.typography} onChange={update('typography')} placeholder="O escribe el nombre de tu fuente" />
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

          <Card title="Enlaces de bio" hint="A dónde mandamos a la gente desde las publicaciones y la bio.">
            <div>
              <Label>Web</Label>
              <input className={field} type="url" value={form.link_web} onChange={update('link_web')} placeholder="https://tuclinica.com" />
            </div>
            <div>
              <Label>Calculadora</Label>
              <input className={field} type="url" value={form.link_calculator} onChange={update('link_calculator')} placeholder="https://… (p. ej. calculadora de hábitos)" />
            </div>
            <div>
              <Label>Formulario</Label>
              <input className={field} type="url" value={form.link_form} onChange={update('link_form')} placeholder="https://… (reserva o contacto)" />
            </div>
          </Card>

          <div className="flex items-center gap-3 pt-1">
            <button type="submit" className="rounded-xl bg-coral px-5 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90">
              Guardar cambios
            </button>
            {saved ? (
              <span className="text-sm text-emerald-600">
                {supabaseConfigured
                  ? 'Guardado ✓'
                  : 'Guardado ✓ — el asistente ya usa tu marca (se sincronizará con tu cuenta más adelante)'}
              </span>
            ) : null}
          </div>
        </div>
      </form>
    </>
  )
}
