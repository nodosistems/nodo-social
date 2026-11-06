'use client'

import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { supabaseConfigured } from '@/lib/supabase/config'
import {
  getPhotos,
  uploadPhoto,
  removePhoto,
  setPhotoLabel,
  PhotoError,
  type BrandPhoto,
} from '@/lib/photos'

export default function MisFotosPage() {
  const [photos, setPhotos] = useState<BrandPhoto[]>([])
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPhotos(getPhotos())
  }, [])

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    setBusy(true)
    const list = Array.from(files)
    setProgress({ done: 0, total: list.length })
    try {
      for (let i = 0; i < list.length; i++) {
        try {
          await uploadPhoto(list[i])
          setPhotos(getPhotos())
        } catch (e) {
          setError(e instanceof PhotoError ? e.message : 'No he podido subir una de las fotos.')
        }
        setProgress({ done: i + 1, total: list.length })
      }
    } finally {
      setBusy(false)
      setProgress(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function onDelete(id: string) {
    await removePhoto(id)
    setPhotos(getPhotos())
  }

  function onLabel(id: string, label: string) {
    setPhotoLabel(id, label)
    setPhotos(getPhotos())
  }

  return (
    <>
      <PageHeader
        title="Mis fotos"
        subtitle="Sube tus fotos (clínica, equipo, local…) y el asistente elegirá la que mejor encaje en cada publicación."
      />

      <div className="flex-1 overflow-auto px-6 py-8 pb-28 md:pb-10">
        <div className="mx-auto max-w-3xl space-y-5">
          {!supabaseConfigured ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Las fotos todavía no están activas en esta instalación. En cuanto se conecte el
              almacenamiento podrás subir tus fotos aquí.
            </div>
          ) : null}

          {/* Zona de subida */}
          <section className="rounded-2xl border border-dashed border-line bg-white p-6 text-center">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onFiles(e.target.files)}
              className="hidden"
            />
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-cloud text-navy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M12 3v13M7 8l5-5 5 5" />
              </svg>
            </div>
            <p className="font-display text-base font-semibold text-ink">Sube tus fotos</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              Arrastra varias de golpe o elígelas de tu carpeta. JPG, PNG o WEBP, hasta 10 MB cada una.
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy || !supabaseConfigured}
              className="mt-4 rounded-xl bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy
                ? progress
                  ? `Subiendo ${progress.done}/${progress.total}…`
                  : 'Subiendo…'
                : 'Elegir fotos'}
            </button>
            {error ? <p className="mt-3 text-sm text-coral">{error}</p> : null}
          </section>

          {/* Galería */}
          {photos.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              Aún no has subido fotos. Cuando las subas, aparecerán aquí y el asistente podrá usarlas.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted">
                Escribe debajo de cada foto qué se ve (p. ej. «recepción de la clínica», «equipo
                sonriendo»). Así el asistente elige mejor.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photos.map((p) => (
                  <div key={p.id} className="overflow-hidden rounded-xl border border-line bg-white">
                    <div className="relative aspect-square bg-cloud">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.label || 'Foto'} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => onDelete(p.id)}
                        title="Borrar foto"
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        </svg>
                      </button>
                    </div>
                    <input
                      defaultValue={p.label}
                      onBlur={(e) => onLabel(p.id, e.target.value)}
                      placeholder="¿Qué se ve en la foto?"
                      className="w-full border-t border-line bg-white px-3 py-2 text-[13px] text-ink outline-none placeholder:text-muted/60"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
