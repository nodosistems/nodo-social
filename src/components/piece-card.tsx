'use client'

import { useState } from 'react'
import type { ProposedPiece, ScheduledPost } from '@/lib/content'
import { addScheduled, nextDateFor, SLOT_TIME } from '@/lib/content'
import { musicLibrary, NO_MUSIC } from '@/lib/music'

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
  const [scheduledAt, setScheduledAt] = useState<number | null>(null)

  function onSchedule() {
    const when = nextDateFor(piece.day, piece.slot)
    const post: ScheduledPost = {
      ...piece,
      musicId: hasMusic ? musicId : undefined,
      scheduledAt: when,
      status: 'programada',
      createdAt: Date.now(),
    }
    addScheduled(post)
    setScheduledAt(when)
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex gap-3 p-3">
        {/* Vista previa de la imagen de marca (formato vertical de IG) */}
        <div
          className={`grid h-36 w-[115px] shrink-0 place-items-center rounded-lg px-2 text-center ${
            BG_CLASS[piece.image.bg] ?? BG_CLASS.navy
          }`}
        >
          <div>
            <p className="font-display text-[13px] font-semibold leading-tight">{piece.image.headline}</p>
            {piece.image.subtext ? (
              <p className="mt-1 text-[10px] opacity-80">{piece.image.subtext}</p>
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

          {hasMusic ? (
            <label className="mt-2 flex items-center gap-2 text-[13px] text-muted">
              🎵
              <select
                value={musicId}
                onChange={(e) => setMusicId(e.target.value)}
                disabled={scheduledAt !== null}
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
