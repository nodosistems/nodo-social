'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'
import { getBrand, emptyBrand, type BrandProfile } from '@/lib/brand'
import { getPhotos, type BrandPhoto } from '@/lib/photos'
import { parsePlan } from '@/lib/cerebro/parsePlan'
import { PieceCard } from '@/components/piece-card'
import type { ProposedPiece } from '@/lib/content'

type ChatMessage = { role: 'user' | 'assistant'; content: string; pieces?: ProposedPiece[] }

const chips = [
  'Hazme el plan de esta semana',
  'Un carrusel sobre un tema',
  'Un reel corto con gancho',
  'Analiza a un competidor',
]

export default function AsistentePage() {
  const [brand, setBrand] = useState<BrandProfile>(emptyBrand)
  const [photos, setPhotos] = useState<BrandPhoto[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setBrand(getBrand())
    setPhotos(getPhotos())
  }, [])

  // Autoscroll al final cuando llegan mensajes o texto nuevo.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function send(text: string) {
    const content = text.trim()
    if (!content || streaming) return

    const history: ChatMessage[] = [...messages, { role: 'user', content }]
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    let acc = ''
    try {
      const res = await fetch('/api/asistente', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          brand,
          photos: photos.map((p) => ({ id: p.id, label: p.label })),
        }),
      })
      if (!res.body) throw new Error('sin respuesta')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        // Durante el streaming ocultamos el bloque de datos (```plan …); solo mostramos texto.
        const visible = acc.split('```plan')[0]
        setMessages((m) => {
          const copy = m.slice()
          copy[copy.length - 1] = { role: 'assistant', content: visible }
          return copy
        })
      }
      // Al terminar, separamos el texto de las piezas propuestas (se muestran como tarjetas).
      const parsed = parsePlan(acc)
      setMessages((m) => {
        const copy = m.slice()
        copy[copy.length - 1] = { role: 'assistant', content: parsed.text, pieces: parsed.pieces }
        return copy
      })
    } catch {
      setMessages((m) => {
        const copy = m.slice()
        copy[copy.length - 1] = {
          role: 'assistant',
          content: acc || 'Uy, no he podido responder. Inténtalo otra vez en un momento.',
        }
        return copy
      })
    } finally {
      setStreaming(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const empty = messages.length === 0

  return (
    <>
      <PageHeader
        title="Asistente"
        subtitle="Pídeme lo que quieras publicar. Yo lo creo y lo dejo listo para programar."
        right={
          <div className="hidden items-center gap-2 text-sm text-muted sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> En línea
          </div>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-auto px-6 py-8">
          <div className="mx-auto max-w-3xl">
            {empty ? (
              <div className="pt-6 text-center">
                <p className="text-muted">
                  {brand.business_name.trim() ? `Hola, ${brand.business_name.trim()} 👋` : 'Hola 👋'}
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold text-ink">¿Qué publicamos hoy?</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted">
                  Dime un tema o pídeme un plan. Yo escribo el contenido (carruseles, reels, posts) con tu
                  marca y tu tono, listo para revisar y programar.
                </p>
              </div>
            ) : null}

            <div className={`space-y-4 ${empty ? 'mt-8' : ''}`}>
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-tr-md bg-navy px-4 py-3 text-[15px] text-white">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-start">
                    {m.content !== '' || !(m.pieces && m.pieces.length) ? (
                      <div className="max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-tl-md border border-line bg-white px-4 py-3 text-[15px] leading-relaxed text-ink">
                        {m.content === '' ? <TypingDots /> : m.content}
                      </div>
                    ) : null}
                    {m.pieces && m.pieces.length > 0 ? (
                      <div className="w-full max-w-[90%]">
                        {m.pieces.map((p) => (
                          <PieceCard key={p.id} piece={p} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-line bg-white/70 px-6 py-4 pb-24 md:pb-4">
          <div className="mx-auto max-w-3xl">
            {empty ? (
              <div className="mb-3 flex flex-wrap justify-center gap-2">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    disabled={streaming}
                    className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink/80 transition-colors hover:bg-cloud disabled:opacity-50"
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex items-end gap-2 rounded-2xl border border-line bg-white p-2 shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Dime qué quieres publicar y yo lo creo y lo programo"
                className="max-h-40 min-h-[2.75rem] min-w-0 flex-1 resize-none bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-muted/70"
              />
              <button
                onClick={() => send(input)}
                disabled={streaming || input.trim() === ''}
                aria-label="Enviar"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral text-white transition-opacity disabled:opacity-40"
              >
                <span className="h-5 w-5">{Icon.send}</span>
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              El asistente escribe el contenido con tu marca. Tú revisas antes de publicar.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1 text-muted">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted/60 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted/60 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted/60" />
    </span>
  )
}
