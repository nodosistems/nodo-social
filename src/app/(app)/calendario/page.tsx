'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'

type CalItem = {
  id: string
  day: number
  time: string
  type: 'Reel' | 'Story' | 'Carrusel' | 'Vídeo' | 'Imagen'
  platform: string
  campaign: string
  color: string
  description: string
  cta: string
}

// Campañas de ejemplo (se sustituyen por las reales al conectar el guardado).
const camp0 = { name: 'Propósitos de enero', color: '#E2603F' }
const camp1 = { name: 'Recordatorio pacientes', color: '#2E7D6B' }
const campaigns = [camp0, camp1]

const seed: CalItem[] = [
  { id: '1', day: 3, time: '20:30', type: 'Reel', platform: 'Instagram', campaign: camp0.name, color: camp0.color, description: '«¿Cuántas citas se cancelan sin aviso?» Antes: agenda a mano. Después: gestión y recordatorios.', cta: 'Reservar cita' },
  { id: '2', day: 6, time: '11:00', type: 'Carrusel', platform: 'Instagram', campaign: camp0.name, color: camp0.color, description: '3 señales de que tu agenda necesita orden.', cta: 'Link en bio' },
  { id: '3', day: 9, time: '19:00', type: 'Story', platform: 'Instagram', campaign: camp1.name, color: camp1.color, description: 'Recordatorio suave: revisa tu próxima cita.', cta: 'Desliza hacia arriba' },
  { id: '4', day: 13, time: '20:30', type: 'Reel', platform: 'Instagram', campaign: camp0.name, color: camp0.color, description: 'El minuto que te ahorra una semana de llamadas.', cta: 'Reservar cita' },
  { id: '5', day: 16, time: '10:30', type: 'Carrusel', platform: 'Instagram', campaign: camp1.name, color: camp1.color, description: 'Lo que tus pacientes agradecen (y no sabías).', cta: 'Comentar INFO' },
  { id: '6', day: 20, time: '20:00', type: 'Vídeo', platform: 'Instagram', campaign: camp0.name, color: camp0.color, description: 'Cómo empezar enero sin agobios de agenda.', cta: 'Abrir la calculadora' },
  { id: '7', day: 24, time: '18:30', type: 'Story', platform: 'Instagram', campaign: camp1.name, color: camp1.color, description: 'Encuesta: ¿qué te cuesta más al retomar hábitos?', cta: 'Responde' },
  { id: '8', day: 27, time: '20:30', type: 'Reel', platform: 'Instagram', campaign: camp0.name, color: camp0.color, description: 'Antes de enero: deja tu agenda lista.', cta: 'Reservar cita' },
]

const tipos: CalItem['type'][] = ['Reel', 'Story', 'Carrusel', 'Vídeo', 'Imagen']
const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const monthName = 'Noviembre 2026'

// Mes fijo (noviembre 2026) para una vista determinista.
const firstWeekday = (new Date(Date.UTC(2026, 10, 1)).getUTCDay() + 6) % 7 // Lunes = 0
const daysInMonth = new Date(Date.UTC(2026, 11, 0)).getUTCDate()

const field =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:border-navy/30 focus:ring-2 focus:ring-navy/10'

export default function CalendarioPage() {
  const [items, setItems] = useState<CalItem[]>(seed)
  const [editing, setEditing] = useState<CalItem | null>(null)

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function save() {
    if (!editing) return
    setItems((list) => list.map((it) => (it.id === editing.id ? editing : it)))
    setEditing(null)
  }
  function remove() {
    if (!editing) return
    setItems((list) => list.filter((it) => it.id !== editing.id))
    setEditing(null)
  }

  return (
    <>
      <PageHeader
        title="Calendario"
        subtitle="Lo que se publica y cuándo. Cada pieza con el color de su campaña."
        right={
          <div className="hidden items-center gap-3 text-sm sm:flex">
            {campaigns.map((c) => (
              <span key={c.name} className="inline-flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} /> {c.name}
              </span>
            ))}
          </div>
        }
      />

      <div className="flex-1 overflow-auto px-6 py-6 pb-28 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">{monthName}</h2>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {weekdays.map((w) => (
              <div key={w} className="bg-cloud px-2 py-2 text-center text-xs font-medium text-muted">
                {w}
              </div>
            ))}
            {cells.map((day, i) => (
              <div key={i} className="min-h-24 bg-white p-1.5 align-top">
                {day ? (
                  <>
                    <div className="px-1 text-xs font-medium text-muted">{day}</div>
                    <div className="mt-1 space-y-1">
                      {items
                        .filter((it) => it.day === day)
                        .map((it) => (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => setEditing(it)}
                            className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px] font-medium text-white transition-opacity hover:opacity-90"
                            style={{ background: it.color }}
                            title={`${it.type} · ${it.time}`}
                          >
                            <span className="truncate">{it.type}</span>
                            <span className="ml-auto shrink-0 opacity-80">{it.time}</span>
                          </button>
                        ))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted">
            Es una vista de ejemplo. Cuando conectemos el cerebro y la publicación, el calendario se llenará solo con las piezas de tus campañas.
          </p>
        </div>
      </div>

      {/* Editor de pieza */}
      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-t-2xl border border-line bg-white p-5 shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-8 w-1.5 rounded-full" style={{ background: editing.color }} />
                <div>
                  <div className="font-display text-base font-semibold text-ink">{editing.type}</div>
                  <div className="text-xs text-muted">{editing.campaign}</div>
                </div>
              </div>
              <button onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-cloud" aria-label="Cerrar">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Tipo</label>
                  <select className={field} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as CalItem['type'] })}>
                    {tipos.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Hora</label>
                  <input className={field} value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} placeholder="20:30" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Plataforma</label>
                <select className={field} value={editing.platform} onChange={(e) => setEditing({ ...editing, platform: e.target.value })}>
                  <option>Instagram</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Tema / descripción</label>
                <textarea className={field} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">CTA</label>
                <input className={field} value={editing.cta} onChange={(e) => setEditing({ ...editing, cta: e.target.value })} placeholder="Ej: Link en bio, Reservar cita…" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button onClick={remove} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line text-coral hover:bg-coral/5" aria-label="Eliminar" title="Eliminar">
                🗑
              </button>
              <button onClick={() => setEditing(null)} className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink hover:bg-cloud">
                Cerrar
              </button>
              <button onClick={save} className="flex-1 rounded-xl bg-coral px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
