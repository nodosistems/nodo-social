'use client'

import { useEffect, useState } from 'react'
import type { ProposedPiece, ScheduledPost } from '@/lib/content'
import { addScheduled, nextDateFor, SLOT_TIME } from '@/lib/content'
import { musicLibrary, NO_MUSIC } from '@/lib/music'
import { getPhotos, type BrandPhoto } from '@/lib/photos'
import { scheduleToCloud } from '@/lib/schedule-cloud'

const FORMAT_LABEL: Record<string, string> = {
  carrusel: 'Carrusel',
  reel: 'Reel',
  video: 'Vídeo',
  post: 'Post',
  story: 'Story',
}

const SLOT_LABEL: Record<string, string> = { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' }

const BG_CLASS: Record<string, string> = {
  navy: 'bg-navy text-white',
  cloud: 'bg-cloud text-ink',
  white: 'bg-white text-ink border border-line',
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PieceCard({ piece }: { piece: ProposedPiece }) {
  const hasMusic = piece.format === 'reel' || piece.format === 'video'
  const [musicId, setMusicId] = useState(piece.musicId ?? NO_MUSIC)
  const [photoId, setPhotoId] = useState(piece.image.photo ?? '')
  const [photos, setPhotos] = useState<BrandPhoto[]>([])
  const [scheduledAt, setScheduledAt] = useState<number | null>(null)

  // Fotos disponibles de "Mis fotos" (para elegir/cambiar la de la pieza).
  useEffect(() => {
    setPhotos(getPhotos())
  }, [])

  const selectedPhoto = photos.find((p) => p.id === photoId)
  const locked = scheduledAt !== null

  function onSchedule() {
    const when = nextDateFor(piece.day, piece.slot)
    const post: ScheduledPost = {
      ...piece,
      musicId: hasMusic ? musicId : undefined,
      image: { ...piece.image, photo: photoId || undefined },
      scheduledAt: when,
      status: 'programada',
      createdAt: Date.now(),
    }
    addScheduled(post) // local: respuesta inmediata en la UI
    setScheduledAt(when)
    // Nube (para que el servidor pueda publicarla sola). A prueba de fallos: si falla, no molesta.
    void scheduleToCloud(post, selectedPhoto?.url)
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex gap-3 p-3">
        {/* Vista previa (formato vertical de IG): foto elegida o diseño de marca */}
        <div
          className={`relative grid h-36 w-[115px] shrink-0 place-items-center overflow-hidden rounded-lg px-2 text-center ${
            selectedPhoto ? 'bg-navy text-white' : BG_CLASS[piece.image.bg] ?? BG_CLASS.navy
          }`}
        >
          {selectedPhoto ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedPhoto.url} alt={piece.image.headline} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : null}
          <div className="relative">
            <p className="font-display text-[13px] font-semibold leading-tight drop-shadow">{piece.image.headline}</p>
            {piece.image.subtext ? (
              <p className="mt-1 text-[10px] opacity-80 drop-shadow">{piece.image.subtext}</p>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-navy/10 bg-navy/5 px-2 py-0.5 text-[12px] font-medium text-navy">
              {FORMAT_LABEL[piece.format] ?? piece.format}
            </span>
            {piece.day ? (
              <span className="rounded-full bg-cloud px-2 py-0.5 text-[12px] text-ink/70">
                {piece.day} · {SLOT_LABEL[piece.slot]} {SLOT_TIME[piece.slot]}
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 line-clamp-3 text-sm text-ink/80">{piece.caption || piece.hook}</p>

          {/* Selector de foto: solo si el cliente tiene fotos en "Mis fotos" */}
          {photos.length > 0 ? (
            <label className="mt-2 flex items-center gap-2 text-[13px] text-muted">
              🖼️
              <select
                value={photoId}
                onChange={(e) => setPhotoId(e.target.value)}
                disabled={locked}
                className="min-w-0 flex-1 rounded-lg border border-line bg-white px-2 py-1 text-[13px] text-ink outline-none disabled:opacity-60"
              >
                <option value="">Diseño de marca (sin foto)</option>
                {photos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label || 'Foto sin descripción'}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {hasMusic ? (
            <label className="mt-2 flex items-center gap-2 text-[13px] text-muted">
              🎵
              <select
                value={musicId}
                onChange={(e) => setMusicId(e.target.value)}
                disabled={locked}
                className="min-w-0 flex-1 rounded-lg border border-line bg-white px-2 py-1 text-[13px] text-ink outline-none disabled:opacity-60"
              >
                <option value={NO_MUSIC}>Sin música</option>
                {musicLibrary.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.mood}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-line p-2.5">
        {scheduledAt === null ? (
          <button
            onClick={onSchedule}
            className="rounded-lg bg-coral px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Programar
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            ✓ Programado · {formatDate(scheduledAt)}
          </span>
        )}
        <span className="ml-auto text-[12px] text-muted">o pídeme otra versión</span>
      </div>
    </div>
  )
}
