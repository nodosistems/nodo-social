// Extrae el bloque ```plan ...``` que el cerebro añade al final cuando propone piezas.
// Es a prueba de fallos: si no hay bloque o el JSON está mal, devuelve el texto tal cual y
// sin piezas (el chat nunca se rompe por esto).

import type { ProposedPiece, PieceFormat, Slot } from '@/lib/content'

const FORMATS: PieceFormat[] = ['carrusel', 'reel', 'video', 'post', 'story']
const SLOTS: Slot[] = ['manana', 'tarde', 'noche']
const BGS = ['navy', 'cloud', 'white'] as const

const BLOCK = /```plan\s*([\s\S]*?)```/i

function uid(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return 'p_' + Math.random().toString(36).slice(2)
  }
}

type RawPiece = Partial<Omit<ProposedPiece, 'id'>> & { image?: Partial<ProposedPiece['image']> }

function normalize(raw: RawPiece): ProposedPiece {
  const format = (FORMATS as string[]).includes(raw.format as string)
    ? (raw.format as PieceFormat)
    : 'post'
  const slot = (SLOTS as string[]).includes(raw.slot as string) ? (raw.slot as Slot) : 'manana'
  const bgRaw = raw.image?.bg as string | undefined
  const bg = (BGS as readonly string[]).includes(bgRaw ?? '') ? (bgRaw as (typeof BGS)[number]) : 'navy'
  const topic = (raw.topic ?? '').toString().trim() || 'Pieza'
  return {
    id: uid(),
    day: (raw.day ?? '').toString().trim(),
    slot,
    format,
    topic,
    hook: (raw.hook ?? '').toString().trim(),
    caption: (raw.caption ?? '').toString().trim(),
    musicId: format === 'reel' || format === 'video' ? (raw.musicId ?? 'none').toString() : undefined,
    image: {
      headline: (raw.image?.headline ?? raw.hook ?? topic).toString().trim(),
      subtext: raw.image?.subtext ? raw.image.subtext.toString().trim() : undefined,
      bg,
      photo: raw.image?.photo ? raw.image.photo.toString().trim() : undefined,
    },
    slides: format === 'carrusel' && Array.isArray(raw.slides)
      ? raw.slides.map((s) => ({
          headline: (s?.headline ?? '').toString().trim(),
          body: s?.body ? s.body.toString().trim() : undefined,
        }))
      : undefined,
  }
}

export function parsePlan(rawText: string): { text: string; pieces: ProposedPiece[] } {
  const match = rawText.match(BLOCK)
  if (!match) return { text: rawText.trim(), pieces: [] }

  const text = rawText.replace(BLOCK, '').trim()
  try {
    const data = JSON.parse(match[1].trim())
    const list = Array.isArray(data) ? data : Array.isArray(data?.pieces) ? data.pieces : []
    const pieces = (list as RawPiece[]).map(normalize)
    return { text, pieces }
  } catch {
    // JSON mal formado: nos quedamos con el texto (sin el bloque) y sin tarjetas.
    return { text, pieces: [] }
  }
}
