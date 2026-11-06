// Modelo de contenido: lo que el asistente PROPONE y lo que se PROGRAMA.
// El cerebro (Claude) devuelve "piezas" propuestas; al pulsar "Programar" se guardan como
// publicaciones programadas. PROVISIONAL en localStorage; al montar el publicado automático se
// mueve a Supabase (tabla scheduled_posts) para que el servidor pueda publicarlas con fecha.

export type PieceFormat = 'carrusel' | 'reel' | 'video' | 'post' | 'story'
export type Slot = 'manana' | 'tarde' | 'noche'

// Horas por defecto de cada franja (alineadas con el publicador: mañana 07:30, noche 20:00).
export const SLOT_TIME: Record<Slot, string> = {
  manana: '07:30',
  tarde: '14:00',
  noche: '20:00',
}

// La imagen de una pieza. Por defecto es un DISEÑO de marca (titular + apoyo sobre un fondo de la
// marca). Si `photo` tiene el id de una foto de la biblioteca del cliente, la pieza usa esa FOTO
// (con el titular encima como rótulo). El cliente puede cambiar o quitar la foto en la tarjeta.
export type BrandImage = {
  headline: string
  subtext?: string
  bg: 'navy' | 'cloud' | 'white'
  photo?: string // id de una foto de "Mis fotos" (si la pieza usa foto en vez de diseño)
}

// Pieza propuesta por el asistente (sale de la respuesta estructurada del cerebro).
export type ProposedPiece = {
  id: string
  day: string // etiqueta legible: "Lunes", "Martes"…
  slot: Slot
  format: PieceFormat
  topic: string
  hook: string // gancho / primera línea
  caption: string
  musicId?: string // pista de música (reels/vídeos) o 'none'
  image: BrandImage
  slides?: { headline: string; body?: string }[] // para carruseles
}

// Publicación ya programada (lo que guarda "Programar").
export type ScheduledPost = ProposedPiece & {
  scheduledAt: number // cuándo se publica (timestamp)
  campaign?: string
  status: 'programada' | 'publicada' | 'borrador'
  createdAt: number
}

const KEY = 'nodo.scheduled'

export function getScheduled(): ScheduledPost[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as ScheduledPost[]
  } catch {
    return []
  }
}

export function saveScheduled(list: ScheduledPost[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* almacenamiento no disponible */
  }
}

export function addScheduled(post: ScheduledPost): void {
  saveScheduled([post, ...getScheduled()])
}

// Días de la semana en español → índice JS (0 = domingo).
const WEEKDAYS: Record<string, number> = {
  domingo: 0, lunes: 1, martes: 2, miércoles: 3, miercoles: 3,
  jueves: 4, viernes: 5, sábado: 6, sabado: 6,
}

// Resuelve "Lunes" + franja al próximo timestamp futuro de esa combinación.
export function nextDateFor(day: string, slot: Slot, from = new Date()): number {
  const target = WEEKDAYS[day.trim().toLowerCase()]
  const [h, m] = SLOT_TIME[slot].split(':').map(Number)
  const d = new Date(from)
  d.setHours(h, m, 0, 0)
  if (target !== undefined) {
    let delta = (target - d.getDay() + 7) % 7
    if (delta === 0 && d.getTime() <= from.getTime()) delta = 7
    d.setDate(d.getDate() + delta)
  } else if (d.getTime() <= from.getTime()) {
    d.setDate(d.getDate() + 1) // sin día válido: lo dejamos para mañana a esa hora
  }
  return d.getTime()
}
